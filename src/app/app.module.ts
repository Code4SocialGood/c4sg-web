import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpModule, JsonpModule} from '@angular/http';
import {NavScrollDirective} from './navscroll.directive';

import {MaterializeModule} from 'angular2-materialize';
import {NgxPaginationModule} from 'ngx-pagination';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {HelpComponent} from './help/help.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {AppreciationsComponent} from './appreciations/appreciations.component';
import {ConsultantsComponent} from './consultants/consultants.component';
import {ContactComponent} from './contact/contact.component';
import {PartnersComponent} from './partners/partners.component';
import {StoriesComponent} from './stories/stories.component';

import {ApplicationEditComponent} from './application/edit/application-edit.component';
import {ApplicationViewComponent} from './application/view/application-view.component';
import {ApplicationProjectViewComponent} from './application/view/application-project-view.component';


import {ProjectListComponent} from './project/list/project-list.component';
import {ProjectViewComponent} from './project/view/project-view.component';
import {ProjectEditComponent} from './project/edit/project-edit.component';
import {ProjectListVolunteerComponent} from './project/list/my-projects-volunteer';
import {ProjectListNonprofitComponent} from './project/list/my-projects-nonprofit';



import {OrganizationListComponent} from './organization/list/organization-list.component';
import {OrganizationViewComponent} from './organization/view/organization-view.component';
import {OrganizationEditComponent} from './organization/edit/organization-edit.component';

import {UserListComponent} from './user/list/user-list.component';
import {UserViewComponent} from './user/view/user-view.component';
import {UserEditComponent} from './user/edit/user-edit.component';

import {AuthRoleSelectionComponent} from './auth.role.component';

import {SharedBtnComponent} from './_components/shared-btn/shared-btn.component';
import {SkillSelectComponent} from './_components/select-skill/skill-select.component';

import {OrganizationService} from './organization/common/organization.service';
import {ProjectService} from './project/common/project.service';
import {UserService} from './user/common/user.service';
import {SkillService} from './skill/common/skill.service';
import {ApplicationService} from './application/common/application.service';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import {FormConstantsService} from './_services/form-constants.service';
import {DeveloperService} from './about/common/developer.service';
import {ImageDisplayService} from './_services/image-display.service';
import {ImageUploaderService} from './_services/image-uploader.service';
import {DataService} from './_services/data.service';
import {ExtFileHandlerService} from './_services/extfilehandler.service';
import {ValidationService} from './_services/validation.service';
import {ScrollSkillsDirective} from './skill/scroll-skills.directive';

import { AgmCoreModule } from '@agm/core';
import { ProjectCardComponent } from './_components/project-card/project-card.component';
import { ProjectListSmallComponent } from './_components/project-card-small/project-card-small.component';
import { FeedbackBtnComponent } from './_components/feedback-btn/feedback-btn.component';
import { UserAvatarComponent } from './_components/user-avatar/user-avatar.component';
import { UserAvatarSmallComponent } from './_components/user-avatar-small/user-avatar-small.component';
import { UserAvatarHeaderComponent } from './_components/user-avatar-header/user-avatar-header.component';
import {MyPaginationControlsComponent} from './_components/my-pagination-controls/my-pagination-controls.component';
import { Http, RequestOptions } from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('access_token'))
  }), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    MaterializeModule,
    JsonpModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAq8AkZC-7OkXqM7bLjJ5OQQNDn1hW92o0'
    })
  ],
  declarations: [
    AppComponent,
    NavScrollDirective,
    HomeComponent,
    AboutComponent,
    HelpComponent,
    AppreciationsComponent,
    ConsultantsComponent,
    ContactComponent,
    PartnersComponent,
    StoriesComponent,

    HeaderComponent,
    FooterComponent,

    ApplicationEditComponent,
    ApplicationViewComponent,
    ApplicationProjectViewComponent,

    ProjectListComponent,
    ProjectViewComponent,
    ProjectEditComponent,
    ProjectListVolunteerComponent,
    ProjectListNonprofitComponent,

    OrganizationListComponent,
    OrganizationViewComponent,
    OrganizationEditComponent,

    UserListComponent,
    UserViewComponent,
    UserEditComponent,

    AuthRoleSelectionComponent,
    SkillSelectComponent,
    SharedBtnComponent,
    ScrollSkillsDirective,
    ProjectCardComponent,
    ProjectListSmallComponent,
    FeedbackBtnComponent,
    UserAvatarComponent,
    UserAvatarSmallComponent,
    UserAvatarHeaderComponent,
    MyPaginationControlsComponent,

  ],
  providers: [ProjectService,
    OrganizationService,
    UserService,
    FormConstantsService,
    AuthService,
    AuthGuard,
    DeveloperService,
    ImageDisplayService,
    ImageUploaderService,
    DataService,
    ValidationService,
    SkillService,
    ApplicationService,
    ExtFileHandlerService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }],

  bootstrap: [AppComponent]
})
export class AppModule {
}
