import { Injectable } from '@angular/core';
import { Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';
import { Project } from './project/common/project';
import { ProjectService } from './project/common/project.service';
import { User } from './user/common/user';
import { UserService } from './user/common/user.service';
import { Organization } from './organization/common/organization';
import { OrganizationService } from './organization/common/organization.service';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';


declare const Materialize: any;

@Injectable()
export class AuthGuard implements CanActivate {
    project: Project;
    user: User;
    organization: Organization;
    constructor(private auth: AuthService,
            private router: Router,
            private location: Location,
            private projectService: ProjectService,
            private userService: UserService,
            private organizationService: OrganizationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const appMetaData = 'http://app_metadata';
    if (this.auth.authenticated()) {
        const roles = next.data['roles'] as Array<string>;
        // Check if roles have NOT been set along with [AuthGuard] marker in auth.routing.ts
        // Any authenticated user can access any pages be restrictive to all roles so this force setting the role restriction in the config
        if (roles === undefined) {
            if (`${next.url[0]}/${next.url[1]}` === 'project/view') {

                const projectId: number = +next.url[2];
                return this.isProjectDetailAccessAllowed(projectId, 'view');

            } else if (`${next.url[0]}/${next.url[1]}` === 'organization/view') {

                const orgId: number = +next.url[2];
                return this.isOrganizationDetailAccessAllowed(orgId, 'view');

            } else if (`${next.url[0]}/${next.url[1]}` === 'user/view') {

                const userId: number = +next.url[2];
                return this.isUserDetailAccessAllowed(userId, 'view');

            } else if (`${next.url[0]}/${next.url[1]}` === 'project/edit') {

                const projectId: number = +next.url[2];
                return this.isProjectDetailAccessAllowed(projectId, 'edit');

            } else if (`${next.url[0]}/${next.url[1]}` === 'organization/edit') {

                const orgId: number = +next.url[2];
                return this.isOrganizationDetailAccessAllowed(orgId, 'edit');

            } else if (`${next.url[0]}/${next.url[1]}` === 'user/edit') {

                const userId: number = +next.url[2];
                return this.isUserDetailAccessAllowed(userId, 'edit');

            }

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

        if (`${next.url[0]}/${next.url[1]}` === 'project/view') {

            const projectId: number = +next.url[2];
            return this.isProjectViewAccessAllowedAsGuest(projectId);

        } else if (`${next.url[0]}/${next.url[1]}` === 'organization/view') {

            const orgId: number = +next.url[2];
            return this.isOrganizationViewAccessAllowedAsGuest(orgId);

        } else if (`${next.url[0]}/${next.url[1]}` === 'user/view') {

            const userId: number = +next.url[2];
            return this.isUserViewAccessAllowedAsGuest(userId);
        }


      // Save URL to redirect to after login and fetching profile to get roles
      localStorage.setItem('redirect_url', state.url);
      this.auth.login();
      this.router.navigate(['']);
      return false;
    }
  }

  private isProjectDetailAccessAllowed(projectId: number, action: string): Observable<boolean> {

    return this.projectService.getProject(projectId)
      .flatMap (projectResponse => {
            this.project = projectResponse;
            return this.userService.getUsersByOrganization(this.project.organizationId);
          })
      .map (userResponse => {

        this.user = userResponse[0];
        if (this.project !== undefined && this.auth.isAdmin()) {
            return true;
        } else if (this.user !== undefined
                && this.auth.isOrganization()
                && +this.auth.getCurrentUserId() === this.user.id) {

                return true;

        } else if (action === 'view' && this.project !== undefined && this.project.status === 'A') {
            return true;
        } else {
            this.router.navigate(['']);
            Materialize.toast('You do not have access to the page requested', 4000);
            return false;
        }
      },
      projectError => console.log(projectError));

  }

  private isOrganizationDetailAccessAllowed(orgId: number, action: string): Observable<boolean> {

    return this.organizationService.getOrganization(orgId)
          .map (orgResponse => {
                this.organization = orgResponse;
                return this.userService.getUsersByOrganization(orgId);
            })
            .map (userResponse => {
                this.user = userResponse[0];

                if (this.organization !== undefined && this.auth.isAdmin()) {
                    return true;
                } else if (this.user !== undefined
                        && this.auth.isOrganization()
                        && +this.auth.getCurrentUserId() === this.user.id
                        && this.organization.status !== 'D') {

                        return true;

                } else if (action === 'view' && this.organization !== undefined && this.organization.status === 'A') {
                    return true;
                } else {
                    this.router.navigate(['']);
                    Materialize.toast('You do not have access to the page requested', 4000);
                    return false;
                }
          },
          orgError => console.log(orgError));

  }

  private isUserDetailAccessAllowed(userId: number, action: string): Observable<boolean> {

    return this.userService.getUser(userId)
          .map(userResponse => {
                this.user = userResponse;
                if (this.user !== undefined && this.auth.isAdmin()) {
                    return true;
                } else if (this.user !== undefined
                        && +this.auth.getCurrentUserId() === this.user.id
                        && this.user.status !== 'D') {

                        return true;

                } else if (action === 'view' && this.user !== undefined
                        && this.user.status === 'A'
                        && this.user.publishFlag === 'Y') {
                    return true;
                } else {
                    this.router.navigate(['']);
                    Materialize.toast('You do not have access to the page requested', 4000);
                    return false;
                }
          },
          userError => console.log(userError));

  }

  private isProjectViewAccessAllowedAsGuest(projectId: number): Observable<boolean> {

    return this.projectService.getProject(projectId)
      .map (projectResponse => {
            this.project = projectResponse;
            if (this.project !== undefined && this.project.status === 'A') {
                return true;
            } else {
                this.router.navigate(['']);
                Materialize.toast('You do not have access to the page requested', 4000);
                return false;
            }
      },
      projectError => console.log(projectError));

  }

  private isOrganizationViewAccessAllowedAsGuest(orgId: number): Observable<boolean> {

    return this.organizationService.getOrganization(orgId)
          .map (orgResponse => {
                this.organization = orgResponse;
                if (this.organization !== undefined && this.organization.status === 'A') {
                    return true;
                } else {
                    this.router.navigate(['']);
                    Materialize.toast('You do not have access to the page requested', 4000);
                    return false;
                }
          },
          orgError => console.log(orgError));

  }

  private isUserViewAccessAllowedAsGuest(userId: number): Observable<boolean> {

    return this.userService.getUser(userId)
      .map(userResponse => {
            this.user = userResponse;
            if (this.user !== undefined
                    && this.user.status === 'A'
                    && this.user.publishFlag === 'Y' ) {
                return true;
            } else {
                this.router.navigate(['']);
                Materialize.toast('You do not have access to the page requested', 4000);
                return false;
            }
      },
      userError => console.log(userError));

  }
}
