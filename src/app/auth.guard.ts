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
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

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
    if (this.auth.authenticated()) {
        const roles = next.data['roles'] as Array<string>;
        // Check if roles have NOT been set along with [AuthGuard] marker in auth.routing.ts
        // Any authenticated user can access any pages be restrictive to all roles so this force setting the role restriction in the config
        if (roles === undefined) {
            
            if(`${next.url[0]}/${next.url[1]}` === 'project/view'){
            
                let projectId: number = +next.url[2];
                return this.projectService.getProject(projectId)
                  .flatMap(projectResponse => {
                        this.project = projectResponse;
                        return this.userService.getUsersByOrganization(this.project.organizationId);
                      })
                  .map(userResponse => {
                        this.user = userResponse[0];                        
                            
                        if(this.project !== undefined && this.auth.isAdmin()){
                            return true;
                        }
                        else if(this.user !== undefined 
                                && this.auth.isOrganization()
                                && +this.auth.getCurrentUserId() === this.user.id){
                            
                                return true;
                                                    
                        }
                        else if (this.project !== undefined && this.project.status === 'A'){
                            return true;
                        }
                        else {
                            this.router.navigate(['/project/list/projects']);
                            return false;
                        }                          
                  },
                  projectError => console.log(projectError));            
            }
            else if(`${next.url[0]}/${next.url[1]}` === 'organization/view'){
                
                let orgId: number = +next.url[2];
                return this.organizationService.getOrganization(orgId)
                  .map(orgResponse => {
                        this.organization = orgResponse;
                        return this.userService.getUsersByOrganization(orgId);
                    })
                    .map(userResponse => {
                        this.user = userResponse[0];                        
                            
                        if(this.organization !== undefined && this.auth.isAdmin()){
                            return true;
                        }
                        else if(this.user !== undefined 
                                && this.auth.isOrganization()
                                && +this.auth.getCurrentUserId() === this.user.id
                                && this.organization.status !== 'D'){
                            
                                return true;
                                                    
                        }
                        else if (this.organization !== undefined && this.organization.status === 'A'){
                            return true;
                        }
                        else {
                            this.router.navigate(['/organization/list/organizations']);
                            return false;
                        }                          
                  },
                  orgError => console.log(orgError));                
            }
            else if(`${next.url[0]}/${next.url[1]}` === 'user/view'){
                
                let userId: number = +next.url[2];
                return this.userService.getUser(userId)
                  .map(userResponse => {
                        this.user = userResponse;
                        if(this.user !== undefined && this.auth.isAdmin()){
                            return true;
                        }
                        else if(this.user !== undefined 
                                && +this.auth.getCurrentUserId() === this.user.id
                                && this.user.status !== 'D'){
                            
                                return true;
                                                    
                        }
                        else if (this.user !== undefined 
                                && this.user.status === 'A'
                                && this.user.publishFlag === 'Y'){
                            return true;
                        }
                        else {
                            this.router.navigate(['/user/list/users']);
                            return false;
                        }                          
                  },
                  userError => console.log(userError));                
            }else if(`${next.url[0]}/${next.url[1]}` === 'project/edit'){
            
                let projectId: number = +next.url[2];
                return this.projectService.getProject(projectId)
                  .flatMap(projectResponse => {
                        this.project = projectResponse;
                        return this.userService.getUsersByOrganization(this.project.organizationId);
                      })
                  .map(userResponse => {
                        this.user = userResponse[0];                        
                            
                        if(this.project !== undefined && this.auth.isAdmin()){
                            return true;
                        }
                        else if(this.user !== undefined 
                                && this.auth.isOrganization()
                                && +this.auth.getCurrentUserId() === this.user.id){
                            
                                return true;
                                                    
                        }
                        else {
                            this.router.navigate(['/project/list/projects']);
                            return false;
                        }                          
                  },
                  projectError => console.log(projectError));  
                  
            }else if(`${next.url[0]}/${next.url[1]}` === 'organization/edit'){
                
                let orgId: number = +next.url[2];
                return this.organizationService.getOrganization(orgId)
                  .map(orgResponse => {
                        this.organization = orgResponse;
                        return this.userService.getUsersByOrganization(orgId);
                    })
                    .map(userResponse => {
                        this.user = userResponse[0];                        
                            
                        if(this.organization !== undefined && this.auth.isAdmin()){
                            return true;
                        }
                        else if(this.user !== undefined 
                                && this.auth.isOrganization()
                                && +this.auth.getCurrentUserId() === this.user.id
                                && this.organization.status !== 'D'){
                            
                                return true;
                                                    
                        }else {
                            this.router.navigate(['/organization/list/organizations']);
                            return false;
                        }                          
                  },
                  orgError => console.log(orgError));                
            }else if(`${next.url[0]}/${next.url[1]}` === 'user/edit'){
                
                let userId: number = +next.url[2];
                return this.userService.getUser(userId)
                  .map(userResponse => {
                        this.user = userResponse;
                        if(this.user !== undefined && this.auth.isAdmin()){
                            return true;
                        }
                        else if(this.user !== undefined 
                                && +this.auth.getCurrentUserId() === this.user.id
                                && this.user.status !== 'D'){
                            
                                return true;
                                                    
                        }else {
                            this.router.navigate(['/user/list/users']);
                            return false;
                        }                          
                  },
                  userError => console.log(userError));                
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
        // If no bypass in effect and user role is not in role restriction, then no access
        if (roles.indexOf(JSON.parse(this.auth.getProfile()).app_metadata.roles[0]) === -1) {
          this.location.back();
          return false;
        }
        return true;
    } else {
    
        if(`${next.url[0]}/${next.url[1]}` === 'project/view'){
            
            let projectId: number = +next.url[2];
            return this.projectService.getProject(projectId)
              .map(projectResponse => {
                    this.project = projectResponse;
                    if (this.project !== undefined && this.project.status === 'A'){
                        return true;
                    }
                    else {
                        this.router.navigate(['/project/list/projects']);
                        return false;
                    }                          
              },
              projectError => console.log(projectError));            
        }else if(`${next.url[0]}/${next.url[1]}` === 'organization/view'){
                
                let orgId: number = +next.url[2];
                return this.organizationService.getOrganization(orgId)
                  .map(orgResponse => {
                        this.organization = orgResponse;
                        if (this.organization !== undefined && this.organization.status === 'A'){
                            return true;
                        }
                        else {
                            this.router.navigate(['/organization/list/organizations']);
                            return false;
                        }                          
                  },
                  orgError => console.log(orgError));                
        }else if(`${next.url[0]}/${next.url[1]}` === 'user/view'){
                
                let userId: number = +next.url[2];
                return this.userService.getUser(userId)
                  .map(userResponse => {
                        this.user = userResponse;
                        if (this.user !== undefined 
                                && this.user.status === 'A'
                                && this.user.publishFlag === 'Y'){
                            return true;
                        }
                        else {
                            this.router.navigate(['/user/list/users']);
                            return false;
                        }                          
                  },
                  userError => console.log(userError));                
            }
            
    
      // Save URL to redirect to after login and fetching profile to get roles
      localStorage.setItem('redirect_url', state.url);
      this.auth.login();
      this.router.navigate(['']);
      return false;
    }
  }
}
