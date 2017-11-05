import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { ConsultantsComponent } from './consultants/consultants.component';
import { ContactComponent } from './contact/contact.component';
import { AppreciationsComponent } from './appreciations/appreciations.component';
import { PartnersComponent } from './partners/partners.component';
import { StoriesComponent } from './stories/stories.component';

import { ProjectListComponent } from './project/list/project-list.component';
import { ProjectViewComponent } from './project/view/project-view.component';
import { ProjectEditComponent } from './project/edit/project-edit.component';
import { ProjectEditJobTitleResolve } from './project/edit/project-edit-resolve-jobtitles';

import { OrganizationListComponent } from './organization/list/organization-list.component';
import { OrganizationViewComponent } from './organization/view/organization-view.component';
import { OrganizationEditComponent } from './organization/edit/organization-edit.component';

import { UserListComponent } from './user/list/user-list.component';
import { UserViewComponent } from './user/view/user-view.component';
import { UserEditComponent } from './user/edit/user-edit.component';

import { AuthRoleSelectionComponent } from './auth.role.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'help', component: HelpComponent},
  {path: 'consultants', component: ConsultantsComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'appreciations', component: AppreciationsComponent},
  {path: 'partners', component: PartnersComponent},
  {path: 'stories', component: StoriesComponent},

  {path: 'project/list/:from', component: ProjectListComponent},
  {path: 'project/view/:projectId', component: ProjectViewComponent},
  {path: 'project/edit/:projectId', component: ProjectEditComponent, canActivate: [AuthGuard],
  resolve: {
      JobTitles: ProjectEditJobTitleResolve
    },
        data: {roles: ['ORGANIZATION', 'ADMIN']}},
  {path: 'project/delete/:projectId', component: ProjectViewComponent, canActivate: [AuthGuard],
        data: {roles: ['ORGANIZATION', 'ADMIN']}},

  {path: 'organization/list/:from', component: OrganizationListComponent},
  {path: 'organization/view/:organizationId', component: OrganizationViewComponent},
  {path: 'organization/edit/:organizationId', component: OrganizationEditComponent, canActivate: [AuthGuard],
        data: {roles: ['ORGANIZATION', 'ADMIN']}},
  {path: 'organization/delete/:organizationId', component: OrganizationViewComponent, canActivate: [AuthGuard],
        data: {roles: ['ADMIN', 'ADMIN']}},

  {path: 'user/list', component: UserListComponent},
  {path: 'user/view/:userId', component: UserViewComponent},
  {path: 'user/edit/:userId', component: UserEditComponent, canActivate: [AuthGuard]},
  {path: 'user/delete/:userId', component: UserViewComponent, canActivate: [AuthGuard]},

  {path: 'roleselect', component: AuthRoleSelectionComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    ProjectEditJobTitleResolve
  ]
})

export class AppRoutingModule {
}
