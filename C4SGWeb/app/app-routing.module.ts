import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VolunteerProjectComponent }  from './project/volunteer/volunteer-project.component';
import { OrganizationProjectComponent }  from './project/organization/organization-project.component';
import { ViewProjectComponent }  from './project/view/view-project.component';
import { SearchProjectComponent }  from './project/search/search-project.component';
import { CreateProjectComponent }  from './project/create/create.component';

import { AppComponent }  from './app.component';
import { HomeComponent }  from './home/home.component';
import { AboutComponent }  from './about/about.component';
import { ContactComponent }  from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { RegistrationComponent } from './registration/registration.component';

import { VolunteerUserComponent } from './user/volunteer/volunteer-user.component';
import { NonprofitUserComponent } from './user/nonprofit/nonprofit-user.component';
import { C4SGUserComponent } from './user/c4sg/c4sg-user.component';

const routes: Routes = [

    { path: '', component: HomeComponent },

    { path: 'projects', component: OrganizationProjectComponent },
    { path: 'create_project', component: CreateProjectComponent },
    { path: 'view-project/:id', component: ViewProjectComponent },

    { path: 'volunteers', component: VolunteerProjectComponent },
    { path: 'nonprofits', component: OrganizationProjectComponent },

    { path: 'volunteerUser', component: VolunteerUserComponent },
    { path: 'nonprofitUser', component: NonprofitUserComponent },
    { path: 'c4sgUser', component: C4SGUserComponent },
    
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'register' , component: RegistrationComponent }
];
@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}