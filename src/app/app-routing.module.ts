import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { ProjectListComponent } from './project/list/project-list.component';
import { ProjectViewComponent } from './project/view/project-view.component';
import { ProjectCreateComponent } from './project/create/project-create.component';

import { OrganizationListComponent } from './organization/list/organization-list.component';
import { OrganizationViewComponent } from './organization/view/organization-view.component';
import { OrganizationCreateComponent } from './organization/create/organization-create.component';
import { OrganizationEditComponent } from './organization/edit/organization-edit.component';

import { UserListComponent }  from './user/list/user-list.component';
import { UserViewComponent }  from './user/view/user-view.component';
import { UserAccountComponent } from './user/account/user-account.component';
import { UserProfileComponent } from './user/profile/user-profile.component';

import { AuthRoleSelectionComponent } from './auth.role.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},

  {path: 'project/list', component: ProjectListComponent},
  {path: 'project/view/:id', component: ProjectViewComponent},
  {path: 'project/create', component: ProjectCreateComponent, canActivate: [AuthGuard],
        data:{roles: ['ADMIN']}},
  {path: 'nonprofit/list', component: OrganizationListComponent},
  {path: 'nonprofit/view/:id', component: OrganizationViewComponent},
  {path: 'nonprofit/create', component: OrganizationCreateComponent, canActivate: [AuthGuard],
        data:{roles: ['ADMIN']}},
  {path: 'nonprofit/edit/:id', component: OrganizationEditComponent,
        data:{roles: ['ORGANIZATION']}},

  {path: 'user/list', component: UserListComponent},
  {path: 'user/view/:id', component: UserViewComponent, canActivate: [AuthGuard] },
  {path: 'account', component: UserAccountComponent},
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},

  {path: 'roleselect', component: AuthRoleSelectionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
