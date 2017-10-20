import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private location: Location) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const appMetaData = 'http://app_metadata';

    if (this.auth.authenticated()) {
        const roles = next.data['roles'] as Array<string>;
        // Check if roles have NOT been set along with [AuthGuard] marker in auth.routing.ts
        // Any authenticated user can access any pages be restrictive to all roles so this force setting the role restriction in the config
        if (roles === undefined) {
          return true;
        }
        // console.log("roles passed: " + roles);
        // console.log("current user role: " + JSON.parse(this.auth.getProfile()).app_metadata.roles);

        // If role restriction set in config, check if bypass in effect
        let result: boolean;
        roles.forEach(role => {
          if (this.auth.bypassRole(role)) {
            result = true;
          }
        });
        if (result) {
          return true;  // Allow access
        }
        const profile: any  = JSON.parse(this.auth.getProfile());
        // If no bypass in effect and user role is not in role restriction, then no access
        let profRole = '';
        if (profile[appMetaData] !== undefined) {
          profRole =  profile[appMetaData].roles[0];
        } else if (profile.app_metadata !== undefined) {
            profRole =  profile.app_metadata.roles[0];
        }
        if (roles.indexOf(profRole) === -1) {
          this.location.back();
          return false;
        }
        return true;
    } else {
      // Save URL to redirect to after login and fetching profile to get roles
      localStorage.setItem('redirect_url', state.url);
      this.auth.login();
      this.router.navigate(['']);
      return false;
    }
  }
}
