import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable, enableProdMode } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { myConfig } from './auth.config';
import { User } from './user/common/user';
import { UserService } from './user/common/user.service';
import { OrganizationService } from './organization/common/organization.service';
import { Organization } from './organization/common/organization';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { AppRoles } from './roles';
import { Subscription, Observable } from 'rxjs/Rx';
import { Project } from './project/common/project';
import { ProjectService } from './project/common/project.service';
import { Http, Headers, Response, RequestOptions, URLSearchParams, Jsonp } from '@angular/http';

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
  apiRole = 'http://api-roles';
  app_metaData = 'http://app_metadata';
  isSocial = 'http://issocial';
  refreshSubscription: Subscription;
  defDurationInSec = 86400;

  webauth = new auth0.WebAuth({
    clientID: environment.auth_clientID,
    domain: environment.auth_domain,
    responseType: 'token',
    audience: environment.auth_api,
    scope: 'openid profile email scope',
    env: environment.auth_callback_env
  });

  constructor(private userService: UserService,
              private organizationService: OrganizationService,
              private projectService: ProjectService,
              private router: Router,
              private http: Http,
              private optionArgs: RequestOptions) {
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
        // console.log(JSON.stringify(delegationResult.Credentials));
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
    // this.lock.show();
    this.webauth.authorize({
      envars: environment.auth_callback_env
    });
  }

  public handleAuthentication(): void {
    this.webauth.parseHash(window.location.hash, (err, authResult) => {
      if (authResult && authResult.accessToken
        // && authResult.idToken     // no id token returned
      ) {
        window.location.hash = '';
        this.setSession(authResult);
        // set uset profile of already saved profile
        this.userProfile = JSON.parse(localStorage.getItem('profile'));
      // Add callback for lock `authenticated` event
      // Get the user profile
      this.webauth.client.userInfo(authResult.accessToken, (error, profile) => {
        let user;
        if (!error) {
          const jwtHelper = new JwtHelper();

          // email signups do not readily return a usable JWT, so we need to grab
          // the temporary token. social sign ups, however, do return the jwt, so we
          // don't do anything special in this case.

          try {
              jwtHelper.decodeToken(authResult.accessToken);
          } catch (e) {
              localStorage.setItem('access_token', authResult.idTokenPayload['http://tempToken']);
          }

          // Signed up via email/pwd
          const profIsSocialIDP = profile[this.isSocial] === undefined ?
            profile.identities[0].isSocial : profile[this.isSocial];
          const profAppMetadata = profile[this.app_metaData] === undefined ?
            profile.app_metadata : profile[this.app_metaData];
          const profAppMetadataRole = profile[this.apiRole] === undefined ?
            profile.app_metadata.roles : profile[this.apiRole];

            if (!profIsSocialIDP) {
              // this.userName = profile.user_metadata.user_name;
              this.userRole = profAppMetadataRole[0];
            } else { // Signed up via social providers
              // this.userName = profile.email;
              // ATM: assumption is there will always be only 1 role per user
              this.userRole = profAppMetadataRole[0];
              this.firstName = profile.given_name;
              this.lastName = profile.family_name;
            }
            // Store user profile
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('delgId', profAppMetadata.amzid);
            localStorage.setItem('delgSecId', profAppMetadata.amzsecid);
            this.userProfile = profile;

            this.email = profile.email;

            this.userService.getUserByEmail(this.email).subscribe(
              res => {
                const lemail = this.email;
                const luserRole = this.userRole;
                // const luserName = this.userName;
                const firstName = this.firstName !== undefined ? this.firstName : '';
                const lastName = this.lastName !== undefined ? this.lastName : '';
                // Check if response is undefined
                if (res) {
                  user = res;
                }
                localStorage.setItem('currentUserEmail', this.email);
                // If user not found, then create the user
                if (user === undefined) {
                  console.log('User does not exist');
                  const newUser: User = ({
                    id: 0,
                    email: lemail,
                    role: luserRole.toUpperCase().substr(0, 1),
                    // userName: luserName,
                    firstName: firstName,
                    lastName: lastName,
                    // publishFlag: 'N',
                    // notifyFlag: 'N',
                    // status: 'ACTIVE'
                    title: '',
                    introduction: ''
                  });

                  const curTime = new Date();
                  localStorage.setItem('currentUserEmail', lemail);
                  localStorage.setItem('currentUserRole', luserRole);
                  localStorage.setItem('currentUserFName', firstName);
                  localStorage.setItem('currentUserLName', lastName);

                  // Create a user
                  this.userService.add(newUser).subscribe(
                    res1 => {
                      user = res1;
                      localStorage.setItem('currentUserId', user.id);
                      this.setlocalStorageItems();
                      if (user.firstName !== '' && user.lastName !== '') {
                        localStorage.setItem('currentDisplayName', user.firstName + ' ' + user.lastName);
                        localStorage.setItem('currentUserFName',  user.firstName);
                        localStorage.setItem('currentUserLName', user.lastName);
                      } else {
                        localStorage.setItem('currentDisplayName', user.email);
                      }
                      localStorage.setItem('currentUserAvatar', user.avatarUrl);
                    },
                    error1 => {
                      this.logout();
                    });
                  this.router.navigate(['/user/edit/0']);
                  localStorage.setItem('redirectAfterLogin', this.router.url);
                } else {
                  // Store user id and display name
                  localStorage.setItem('currentUserId', user.id);
                  if (user.firstName !== '' && user.lastName !== '') {
                    localStorage.setItem('currentDisplayName', user.firstName + ' ' + user.lastName);
                    localStorage.setItem('currentUserFName',  user.firstName);
                    localStorage.setItem('currentUserLName', user.lastName);
                  } else {
                    localStorage.setItem('currentDisplayName', user.email);
                  }
                  localStorage.setItem('currentUserAvatar', user.avatarUrl);
                  this.setlocalStorageItems();
                  if (user.userName === null) {
                    this.router.navigate(['/user/edit/' + user.id]);
                    localStorage.setItem('redirectAfterLogin', '/user/edit/' + user.id);
                  }
                }

                if (environment.production && !environment.auth_tenant_shared) {
                  this.getDelegationToken();
                }

                // schedule renewal here
                this.scheduleRenewal();

                // Issue 356 - redirect user back to the page that requested login - project view page
                this.redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
                if (this.redirectAfterLogin) {
                  setTimeout(() => {
                    this.router.navigate([this.redirectAfterLogin]);
                  }, 100);
                } else {
                  setTimeout(() => this.router.navigate(['/']));
                }
              },
              error1 => console.log(error1)
            );
          }
        });
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn) + (new Date().getTime() / 1000));
    localStorage.setItem('access_token', authResult.accessToken);
    if (authResult.idToken !== null) {
      this.idToken = authResult.idToken;
      // localStorage.setItem('id_token', authResult.idToken);
    }
    const stime = `${(new Date().getTime() / 1000) + this.defDurationInSec}`;
    localStorage.setItem('expires_at', expiresAt == null ? stime : expiresAt);
    localStorage.setItem('state', authResult.state);
  }

  public authenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Math.round(new Date().getTime() / 1000) < expiresAt;
  }

  public logout() {
    // Remove token from localStorage
    let logoutURL = '';
    let profile: any;
    // let connection: string;
    // let accessToken: string;

    let loc: any;
    loc = window.location.origin; // current url
    profile = JSON.parse(localStorage.getItem('profile'));
    // connection = profile.identities[0].connection;

    // Seems the logout url works for all idp and username/pwd
    // if (connection === 'google-oauth2' || connection === 'Username-Password-Authentication') {
    logoutURL = `https://${environment.auth_domain}/v2/logout?returnTo=${encodeURI(loc)}`;
    // }
    // else {
    // logoutURL = `https://${environment.auth_domain}/v2/logout?federated&returnTo=`+ `${encodeURI(loc)}`;
    // }

    this.unscheduleRenewal();

    localStorage.removeItem('profile');
    localStorage.removeItem('access_token');
    // localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.clear();

    this.userProfile = undefined;

    // this.router.navigate(['/']);
    window.location.href = logoutURL; // DO NOT REMOVE
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
  currentUserHasAvatar() {
    return (localStorage.getItem('currentUserAvatar') !== '');
  }
  getCurrentUserFName() {
    return localStorage.getItem('currentUserFName');
  }
  getCurrentUserLName() {
    return localStorage.getItem('currentUserLName');
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
    return this.userProfile
      // && this.userProfile.app_metadata
      // && this.userProfile.app_metadata.roles;
      && this.userProfile[this.apiRole];
  }

  // Check if a user's role is ADMIN
  public isAdmin() {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    if (this.userProfile) {
      // against AppRoles.ADMIN
      if (this.bypassRole(AppRoles[0])) {
        return true;
      } else {
        if (this.userProfile[this.apiRole]) {
          return this.userProfile[this.apiRole][0] === AppRoles[0];
        } else if (this.userProfile.app_metadata.roles !== undefined) {
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
        if (this.userProfile[this.apiRole]) {
          return this.userProfile[this.apiRole][0] === AppRoles[1];
        } else if (this.userProfile.app_metadata.roles !== undefined) {
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
        if (this.userProfile[this.apiRole]) {
          return this.userProfile[this.apiRole][0] === AppRoles[2];
        } else if (this.userProfile.app_metadata.roles !== undefined) {
          return this.userProfile.app_metadata.roles.indexOf(AppRoles[2]) > -1;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  renewToken() {
    this.webauth.renewAuth({
      audience: environment.auth_api,
      redirectUri: `${environment.backend_url}/${environment.auth_silenturl}`,
      scope: 'openid profile email scope',
      usePostMessage: true,
    }, (err, result) => {
      if (!err) {
        this.setSession(result);
      } else {
        console.error('error renewing token');
      }
    });
  }

  scheduleRenewal() {
    if (!this.authenticated()) {
      console.error('returning coz not auth');
      return;
    }

    const expiresAt$ = JSON.parse(window.localStorage.getItem('expires_at')) * 1000;
    const source = Observable.of(expiresAt$).flatMap(
      expiresAt => {
        const now = Date.now();
        const refreshAt = expiresAt - 30000;
        const doWhen = (refreshAt - now) > 300000 ? (this.defDurationInSec * 1000) : (refreshAt - now);
        return Observable.timer(Math.max(1, doWhen), doWhen);
      });

    this.refreshSubscription = source.subscribe(t => {
      this.renewToken();
    });
  }

  unscheduleRenewal() {
    if (!this.refreshSubscription) {
      return;
    }
    this.refreshSubscription.unsubscribe();
  }

  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
