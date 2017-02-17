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
import { ProjectListComponent }  from './project/list/project-list.component';
import { ProjectViewComponent }  from './project/view/project-view.component';
import { ProjectCreateComponent }  from './project/create/project-create.component';

// Organization
import { OrganizationListComponent }  from './organization/list/organization-list.component';
import { OrganizationViewComponent } from './organization/view/organization-view.component';
import { OrganizationCreateComponent } from './organization/create/organization-create.component';

// User
import { UserAccountComponent }  from './user/account/user-account.component';
import { UserProfileComponent }  from './user/profile/user-profile.component';
import { UserListComponent }  from './user/list/user-list.component';
import { UserViewComponent }  from './user/view/user-view.component';

// Login
import { RegistrationComponent } from './login/registration/registration.component';
import { LoginComponent } from './login/login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

// Service
import { OrganizationService } from './organization/common/organization.service';
import { ProjectService }  from './project/common/project.service';
import { ProjectCreateService } from './project/create/project-create.service';
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

    ProjectListComponent,
    ProjectViewComponent,
    ProjectCreateComponent,

    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationCreateComponent,

    UserListComponent,
    UserViewComponent,
    UserAccountComponent,
    UserProfileComponent,

    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,

    MaterializeDirective,
  ],
  providers: [ ProjectService,
               ProjectCreateService,
               OrganizationService,
               UserService],

  bootstrap: [ AppComponent ]
})
export class AppModule {
}
