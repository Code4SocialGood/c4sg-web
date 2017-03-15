import { Injectable }             from '@angular/core';
import { Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }    from '@angular/router';
import { CanActivate }            from '@angular/router';
import { AuthService }            from './auth.service';
import { Location }               from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private location: Location) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.auth.authenticated()){
        let roles = next.data["roles"] as Array<string>;
        // Check if roles have NOT been set along with [AuthGuard] marker in auth.routing.ts
        // Then any authenticated user can access any pages be restrictive to all roles so this force setting the role restriction in the config
        if (roles === undefined)
        {
          return true;
        }
        // console.log("roles passed: " + roles);
        // console.log("current user role: " + JSON.parse(this.auth.getProfile()).app_metadata.roles);

        // If role restriction set in config, check if bypass in effect
        var result: boolean;
        roles.forEach(role => {
          if (this.auth.bypassRole(role)) {
            result = true; 
          }
        });
        if (result) {
          return true;  // Allow access
        }
        // If no bypass in effect and user role is not in role restriction, then no access
        if (roles.indexOf(JSON.parse(this.auth.getProfile()).app_metadata.roles) == -1)
        {
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