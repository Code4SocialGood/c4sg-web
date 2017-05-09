import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { ProjectListComponent } from './project/list/project-list.component';
import { ProjectViewComponent } from './project/view/project-view.component';
import { ProjectEditComponent } from './project/edit/project-edit.component';

import { OrganizationListComponent } from './organization/list/organization-list.component';
import { OrganizationViewComponent } from './organization/view/organization-view.component';
import { OrganizationEditComponent } from './organization/edit/organization-edit.component';

import { UserListComponent } from './user/list/user-list.component';
import { UserViewComponent } from './user/view/user-view.component';
import { UserAccountComponent } from './user/account/user-account.component';
import { UserProfileComponent } from './user/profile/user-profile.component';

import { AuthRoleSelectionComponent } from './auth.role.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},

  {path: 'project/list/:from', component: ProjectListComponent},
  {path: 'project/view/:projectId', component: ProjectViewComponent},
  {path: 'project/edit/:projectId', component: ProjectEditComponent, canActivate: [AuthGuard],
        data: {roles: ['ORGANIZATION', 'ADMIN']}},
  {path: 'project/delete/:projectId', component: ProjectViewComponent, canActivate: [AuthGuard],
        data: {roles: ['ORGANIZATION', 'ADMIN']}},

  {path: 'nonprofit/list', component: OrganizationListComponent},
  {path: 'nonprofit/view/:organizationId', component: OrganizationViewComponent},
  {path: 'nonprofit/edit/:organizationId', component: OrganizationEditComponent, canActivate: [AuthGuard],
        data: {roles: ['ORGANIZATION', 'ADMIN']}},
  {path: 'nonprofit/delete/:organizationId', component: OrganizationViewComponent, canActivate: [AuthGuard],
        data: {roles: ['ADMIN', 'ADMIN']}},

  {path: 'user/list', component: UserListComponent},
  {path: 'user/view/:userId', component: UserViewComponent},
  {path: 'account/:userId', component: UserAccountComponent, canActivate: [AuthGuard]},
  {path: 'profile/:userId', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'user/delete/:userId', component: UserViewComponent, canActivate: [AuthGuard]},

  {path: 'roleselect', component: AuthRoleSelectionComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
