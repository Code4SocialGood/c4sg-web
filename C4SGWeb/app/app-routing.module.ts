import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { ListProjectComponent } from './project/list/list-project.component';
import { ViewProjectComponent } from './project/view/view-project.component';
import { CreateProjectComponent } from './project/create/create-project.component';

import { ListOrganizationComponent } from './organization/list/list-organization.component';
import { ViewOrganizationComponent } from './organization/view/view-organization.component';
import { CreateOrganizationComponent } from './organization/create/create-organization.component';

// import { ListVolunteerComponent } from './volunteer/list/list-volunteer.component';
// import { ViewVolunteerComponent } from './volunteer/view/view-volunteer.component';
// import { UserAccountComponent } from './volunteer/account/user-account.component';
// import { UserProfileComponent } from './volunteer/profile/user-profile.component';

import { RegistrationComponent } from './login/registration/registration.component';
import { LoginComponent } from './login/login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

import { UserListComponent }  from './user/list/list.component';
import { UserViewComponent }  from './user/view/user-view.component';

const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},

  {path: 'projects', component: ListProjectComponent},
  {path: 'view-project', component: ViewProjectComponent},
  //  {path: 'view-project/:id', component: ViewProjectComponent},
  {path: 'create-project', component: CreateProjectComponent},

  {path: 'nonprofits', component: ListOrganizationComponent},
  {path: 'view-nonprofit', component: ViewOrganizationComponent},
  {path: 'create-nonprofit', component: CreateOrganizationComponent},

  // {path: 'volunteers', component: ListVolunteerComponent},
  // {path: 'view-volunteer', component: ViewVolunteerComponent},
  // {path: 'account', component: UserAccountComponent},
  // {path: 'profile', component: UserProfileComponent},

  {path: 'register', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},

  { path: 'user/list', component: UserListComponent },
  { path: 'user/view/:id', component: UserViewComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
