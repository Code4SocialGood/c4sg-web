import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable, enableProdMode } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { myConfig } from './auth.config';
import { User } from './user/common/user';
import { UserService } from './user/common/user.service';
import { OrganizationService } from './organization/common/organization.service';
import { Organization } from './organization/common/organization';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { AppRoles } from './roles';
import { Subscription } from 'rxjs/Rx';
import { Project } from './project/common/project';
import { ProjectService } from './project/common/project.service';

declare const Auth0Lock: any;
declare const auth0: any;

@Injectable()
export class AuthService {

  userProfile: any;
  // userName = ''; Don't handle username with auth0. It is set by user from applicaiton only.
  userRole: string;
  email: string;
  firstName: string;
  lastName: string;
  redirectAfterLogin: string;
  idToken: string;
  currentUserId: string;
  projectsSubscription: Subscription;

  // These options are being added to customize signup
  options = {
    // No login after email/pwd signup
    loginAfterSignUp: false,
    // set to not remember last login
    rememberLastLogin: false,
    // Override the Auth0 logo
    theme: {
      logo: '../assets/logo.png'
    },
    // Override the title
    languageDictionary: {
      title: 'C4SG'
    },
    auth: {
      redirectUrl: window.location.origin,
      responseType: 'token',
      params: { scope: 'openid email user_metadata app_metadata' },
    },
    // Add a user name input text
    additionalSignUpFields: [
      // {
      // name: "user_name",
      // placeholder: "User name",
      // validator: function(user_name) {
      //   return {
      //     valid: user_name.length >= 8,
      //     hint: "Must have 8 or more chars"
      //   }
      // } },
      // Add a User role selection of either Volunteer or NonProfit
      {
        type: 'select',
        name: 'user_role',
        placeholder: 'Sign up as a',
        options: [
          { value: 'VOLUNTEER', label: 'Volunteer User' },
          { value: 'ORGANIZATION', label: 'Organization User' },
          { value: 'ADMIN', label: 'Admin User' }
        ],
        prefill: 'VOLUNTEER'
      }
    ]
  };

  // Configure Auth0 with options
  lock = new Auth0Lock(environment.auth_clientID, environment.auth_domain, this.options);

  webauth = new auth0.WebAuth({ domain: environment.auth_domain, clientID: environment.auth_clientID });

  constructor(private userService: UserService,
    private organizationService: OrganizationService,
    private projectService: ProjectService,
    private router: Router) {

    // set uset profile of already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));

    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', this.idToken = authResult.idToken);
      localStorage.setItem('accessToken', authResult.accessToken);

      // Get the user profile
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        let user;
        if (!error) {
          // Signed up via email/pwd
          if (!profile.identities[0].isSocial) {
            // this.userName = profile.user_metadata.user_name;
            this.userRole = profile.app_metadata.roles[0];
          } else { // Signed up via social providers
            // this.userName = profile.email;
            // ATM: assumption is there will always be only 1 role per user
            this.userRole = profile.app_metadata.roles[0];
            this.firstName = profile.given_name;
            this.lastName = profile.family_name;
          }
          // Store user profile
          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('delgId', profile.app_metadata.amzid);
          localStorage.setItem('delgSecId', profile.app_metadata.amzsecid);
          this.userProfile = profile;

          this.email = profile.email;

          userService.getUserByEmail(this.email).subscribe(
            res => {
              const lemail = this.email;
              const luserRole = this.userRole;
              // const luserName = this.userName;
              const firstName = this.firstName !== undefined ? this.firstName : '';
              const lastName = this.lastName !== undefined ? this.lastName : '';
              // console.log(res);
              // Check if response is undefined
              if (res) {
                user = res;
              }
              // If user not found, then create the user
              if (user === undefined) {
                console.log('User does not exist');
                const newUser: User = ({
                  id: 0,
                  email: lemail,
                  role: luserRole.toUpperCase().substr(0, 1),
                  // userName: luserName,
                  firstName: firstName,
                  lastName: lastName
                  // publishFlag: 'N',
                  // notifyFlag: 'N',
                  // status: 'ACTIVE'
                });

                // Create a user
                userService.add(newUser).subscribe(
                  res1 => {
                    user = res1;
                    localStorage.setItem('currentUserId', user.id);
                    if (user.firstName !== '' && user.lastName !== '') {
                      localStorage.setItem('currentDisplayName', user.firstName + ' ' + user.lastName);
                    } else {
                      localStorage.setItem('currentDisplayName', user.email);
                    }
                    localStorage.setItem('currentUserAvatar', user.avatarUrl);
                  },
                  error1 => console.log(error1));
              } else {
                // Store user id and display name
                localStorage.setItem('currentUserId', user.id);
                if (user.firstName !== '' && user.lastName !== '') {
                  localStorage.setItem('currentDisplayName', user.firstName + ' ' + user.lastName);
                } else {
                  localStorage.setItem('currentDisplayName', user.email);
                }
                localStorage.setItem('currentUserAvatar', user.avatarUrl);
                this.setlocalStorageItems();
              }

              if (environment.production && !environment.auth_tenant_shared) {
                this.getDelegationToken();
              }

              // Issue 356 - redirect user back to the page that requested login - project view page
              this.redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
              if (this.redirectAfterLogin) {
                setTimeout(() => { this.router.navigate([this.redirectAfterLogin]); }, 100);
              } else {
                setTimeout(() => this.router.navigate(['/']));
              }
            },
            error1 => console.log(error1)
          );
        }
      });
    });

    // Function call to show errors
    const llock = this.lock;
    this.lock.on('authorization_error', function (error) {
      console.log('AuthZ error', error);
      llock.show({
        flashMessage: {
          type: 'error',
          text: error.error_description
        }
      });
    });
  }

  public setlocalStorageItems() {
    console.log('************SetLocalStorageItems for the user');
    this.currentUserId = this.getCurrentUserId();
    if (this.authenticated() && this.currentUserId != null) {
      // this.currentUserId = this.getCurrentUserId();

      if (this.isOrganization()) { // if user is Organization User
        if (this.currentUserId !== '0' && this.currentUserId !== null) {
          // Get the associated organzation id
          this.organizationService.getUserOrganization(+this.currentUserId).subscribe(
            res => {
              let organization: Organization;
              // will contain at most 1 entry in the array when a match is found, otherwise, data is undefined
              organization = res[0];
              if (organization !== undefined) {
                this.setOrganizationId(organization.id.toString());
              }
            },
            error => console.log(error)
          );
        }
      }

      if (this.isVolunteer()) { // if user is Volunteer User
        // Save the appliedProjectIDs and bookmarkedProjectIDs in local storage
        this.projectsSubscription = this.projectService.getProjectByUser(+this.currentUserId, 'B').subscribe(
          res => {
            const bookmarkedProjectsIDs = (JSON.parse(JSON.parse(JSON.stringify(res))._body)).map((project) => project.id);
            localStorage.setItem('bookmarkedProjectsIDs', bookmarkedProjectsIDs.toString());
          },
          error => console.log(error));
        this.projectsSubscription = this.projectService.getProjectByUser(+this.currentUserId, 'A').subscribe(
          res => {
            const appliedProjectsIDs = (JSON.parse(JSON.parse(JSON.stringify(res))._body)).map((project) => project.id);
            localStorage.setItem('appliedProjectsIDs', appliedProjectsIDs.toString());
          },
          error => console.log(error));
        this.projectsSubscription = this.projectService.getProjectByUser(+this.currentUserId, 'C').subscribe(
          res => {
            const acceptedProjectsIDs = (JSON.parse(JSON.parse(JSON.stringify(res))._body)).map((project) => project.id);
            localStorage.setItem('acceptedProjectsIDs', acceptedProjectsIDs.toString());
          },
          error => console.log(error));
        this.projectsSubscription = this.projectService.getProjectByUser(+this.currentUserId, 'D').subscribe(
          res => {
            const declinedProjectsIDs = (JSON.parse(JSON.parse(JSON.stringify(res))._body)).map((project) => project.id);
            localStorage.setItem('declinedProjectsIDs', declinedProjectsIDs.toString());
          },
          error => console.log(error));
      }
    }

  }
  private setOrganizationId(organizationId: string): void {
    // this.organizationId = organizationId;
    localStorage.setItem('userOrganizationId', organizationId);
  }
  public getUserOrganizationId() {
    return localStorage.getItem('userOrganizationId');
  }

  private getDelegationToken() {
    const opt = {
      client_id: environment.auth_clientID,
      id_token: this.idToken,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      scope: 'openid',
      api_type: 'aws'
    };
    this.webauth.client.delegation(opt, function (err, delegationResult) {
      if (!err) {
        localStorage.removeItem('delgId');
        localStorage.removeItem('delgSecId');
        localStorage.setItem('delgcred', JSON.stringify(delegationResult.Credentials));
      } else {
        console.warn('Unable to get delegation token');
      }
    });
  }
  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    let logoutURL = '';
    let profile: any;
    let connection: string;
    let accessToken: string;

    let loc: any;
    loc = window.location.origin; // current url
    profile = JSON.parse(localStorage.getItem('profile'));
    accessToken = localStorage.getItem('accessToken');
    connection = profile.identities[0].connection;

    // Seems the logout url works for all idp and username/pwd
    // if (connection === 'google-oauth2' || connection === 'Username-Password-Authentication') {
    logoutURL = `https://${environment.auth_domain}/v2/logout?returnTo=${encodeURI(loc)}`;
    // }
    // else {
    // logoutURL = `https://${environment.auth_domain}/v2/logout?federated&returnTo=`+ `${encodeURI(loc)}`;
    // }
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('accessToken');
    localStorage.clear();

    this.userProfile = undefined;

    this.router.navigate(['/']);
  }

  // Returns user profile
  getProfile(): any {
    return localStorage.getItem('profile');
  }

  // Returns current user's application user id
  getCurrentUserId() {
    return localStorage.getItem('currentUserId');
  }

  // Returns current user's first name + last name OR email
  getCurrentDisplayName() {
    return localStorage.getItem('currentDisplayName');
  }
  getCurrentUserAvatar() {
    return localStorage.getItem('currentUserAvatar');
  }

  // Code below is used to override role
  bypassRole(roleToCheck: string): boolean {
    // For prod, this override will not function
    if (!environment.production) {
      // If a user decides to override, the 'bypassRole is set to true'
      if (myConfig.bypassRole) {
        // If a bypass is set then an override 'roleAs' is expected
        if (roleToCheck === myConfig.roleAs) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  }

  // Common check if a user profile exists and has application metadata
  public hasRoles() {
    return this.userProfile && this.userProfile.app_metadata
      && this.userProfile.app_metadata.roles;
  }

  // Check if a user's role is ADMIN
  public isAdmin() {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    if (this.userProfile) {
      // against AppRoles.ADMIN
      if (this.bypassRole(AppRoles[0])) {
        return true;
      } else {
        if (this.userProfile.app_metadata.roles) {
          return this.userProfile.app_metadata.roles.indexOf(AppRoles[0]) > -1;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  // Check if a user's role is VOLUNTEER
  public isVolunteer() {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    if (this.userProfile) {
      // against AppRoles.VOLUNTEER
      if (this.bypassRole(AppRoles[1])) {
        return true;
      } else {
        if (this.userProfile.app_metadata.roles) {
          return this.userProfile.app_metadata.roles.indexOf(AppRoles[1]) > -1;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  // Check if a user's role is ORGANIZATION
  public isOrganization() {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    if (this.userProfile) {
      // against AppRoles.ORGANIZATION
      if (this.bypassRole(AppRoles[2])) {
        return true;
      } else {
        if (this.userProfile.app_metadata.roles) {
          return this.userProfile.app_metadata.roles.indexOf(AppRoles[2]) > -1;
        } else {
          return false;
        }
      }
    }
    return false;
  }
}
