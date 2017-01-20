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

const routes: Routes = [

    { path: '', component: HomeComponent },

    { path: 'projects', component: OrganizationProjectComponent },
    { path: 'create_project', component: CreateProjectComponent },
    { path: 'view-project/:id', component: ViewProjectComponent },

    { path: 'volunteers', component: VolunteerProjectComponent },
    { path: 'nonprofits', component: OrganizationProjectComponent },


    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
];
@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}