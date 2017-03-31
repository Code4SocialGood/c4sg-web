import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { HttpModule, JsonpModule }    from '@angular/http';
import { NavScrollDirective } from './navscroll.directive';

import { MaterializeModule } from 'angular2-materialize';

// Home
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

// Project
import { ProjectListComponent }  from './project/list/project-list.component';
import { ProjectViewComponent }  from './project/view/project-view.component';
import { ProjectCreateComponent }  from './project/create/project-create.component';
import { ProjectEditComponent }  from './project/edit/project-edit.component';
import { ProjectSearchComponent } from './project/search/project-search.component';

// Organization
import { OrganizationListComponent }  from './organization/list/organization-list.component';
import { OrganizationViewComponent } from './organization/view/organization-view.component';
import { OrganizationCreateComponent } from './organization/create/organization-create.component';
import { OrganizationEditComponent } from './organization/edit/organization-edit.component';

// User
import { UserAccountComponent }  from './user/account/user-account.component';
import { UserProfileComponent }  from './user/profile/user-profile.component';
import { UserListComponent }  from './user/list/user-list.component';
import { UserViewComponent }  from './user/view/user-view.component';

// Login
import { AuthRoleSelectionComponent } from './auth.role.component';

// Service
import { OrganizationService } from './organization/common/organization.service';
import { ProjectService }  from './project/common/project.service';
import { ProjectCreateService } from './project/create/project-create.service';
import { UserService }        from './user/common/user.service';
import { PagerService } from './_services/pager.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { FormConstantsService } from './_services/form-constants.service';
import { DeveloperService } from './about/common/developer.service';
import { ImageDisplayService } from './_services/image-display.service';
import { ImageUploaderService } from './_services/image-uploader.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    MaterializeModule,
    JsonpModule
  ],
  declarations: [
    AppComponent,
    NavScrollDirective,
    HomeComponent,
    AboutComponent,

    ProjectListComponent,
    ProjectViewComponent,
    ProjectCreateComponent,
    ProjectEditComponent,
    ProjectSearchComponent,

    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationCreateComponent,
    OrganizationEditComponent,

    UserListComponent,
    UserViewComponent,
    UserAccountComponent,
    UserProfileComponent,

    AuthRoleSelectionComponent,
  ],
  providers: [ ProjectService,
               ProjectCreateService,
               OrganizationService,
               UserService,
               PagerService,
               FormConstantsService,
               AuthService,
               AuthGuard,
               DeveloperService,
               ImageDisplayService,
               ImageUploaderService],

  bootstrap: [ AppComponent ]
})
export class AppModule {
}
