import './rxjs-extensions';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { MaterializeDirective } from 'angular2-materialize';
import { MaterialModule } from '@angular/material';

// Home
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

// Project
import { ListProjectComponent }  from './project/list/list-project.component';
import { ViewProjectComponent }  from './project/view/view-project.component';
import { CreateProjectComponent }  from './project/create/create-project.component';

// Organization
import { ListOrganizationComponent }  from './organization/list/list-organization.component';
import { ViewOrganizationComponent } from './organization/view/view-organization.component';
import { CreateOrganizationComponent } from './organization/create/create-organization.component';

// Volunteer
// import { ListVolunteerComponent }  from './volunteer/list/list-volunteer.component';
// import { ViewVolunteerComponent } from './volunteer/view/view-volunteer.component';
// import { UserAccountComponent }  from './volunteer/account/user-account.component';
// import { UserProfileComponent }  from './volunteer/profile/user-profile.component';

import { UserListComponent }  from './user/list/list.component';
import { UserViewComponent }  from './user/view/user-view.component';

// Login
import { RegistrationComponent } from './login/registration/registration.component';
import { LoginComponent } from './login/login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

// Service
import { VolunteerService } from './volunteer/volunteer.service';
import { OrganizationService } from './organization/organization.service';
import { ProjectService }  from './project/project.service';
import { CreateProjectService } from './project/create/create-project.service';

import { UserService }        from './user/common/user.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,

    ListProjectComponent,
    ViewProjectComponent,
    CreateProjectComponent,

    ListOrganizationComponent,
    ViewOrganizationComponent,
    CreateOrganizationComponent,

//    ListVolunteerComponent,
//    ViewVolunteerComponent,
//    UserAccountComponent,
//    UserProfileComponent,

    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,

    MaterializeDirective,

    UserListComponent,
    UserViewComponent
  ],
  providers: [ ProjectService,
               OrganizationService,
               VolunteerService,
               CreateProjectService,
               UserService],

  bootstrap: [ AppComponent ]
})
export class AppModule {
}
