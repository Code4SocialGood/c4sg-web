import './rxjs-extensions';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule }    from '@angular/http';

import {MaterializeDirective} from "angular2-materialize";

// Home
import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';
import { HomeComponent }  from './home/home.component';

// Project
import { VolunteerProjectComponent }  from './project/volunteer/volunteer-project.component';
import { OrganizationProjectComponent }  from './project/organization/organization-project.component';
import { ViewProjectComponent }  from './project/view/view-project.component';
import { SearchProjectComponent }  from './project/search/search-project.component';
import { CreateProjectComponent }  from './project/create/create.component';
import { ProjectService }  from './project/project.service';

import { AboutComponent }  from './about/about.component';
import { ContactComponent }  from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { RegistrationComponent } from './registration/registration.component';

// Dashboard
import { VolunteerUserComponent } from './user/volunteer/volunteer-user.component';
import { NonprofitUserComponent } from './user/nonprofit/nonprofit-user.component';
import { C4SGUserComponent } from './user/c4sg/c4sg-user.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RegistrationComponent,
    VolunteerProjectComponent,
    OrganizationProjectComponent,
    ViewProjectComponent,
    SearchProjectComponent,    
    MaterializeDirective,
    CreateProjectComponent,
    VolunteerUserComponent,
    NonprofitUserComponent,
    C4SGUserComponent,
  ],
  providers: [ ProjectService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
