import { AfterViewChecked, Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormConstantsService } from '../../_services/form-constants.service';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { AuthService } from '../../auth.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { SkillService } from '../../skill/common/skill.service';
import { User } from '../../user/common/user';
import { DataService } from '../../_services/data.service';
declare const Materialize: any;

@Component({
  selector: 'my-projects-volunteer',
  templateUrl: 'my-projects-volunteer.html',
  styleUrls: ['project-list.component.scss']
})

export class ProjectListVolunteerComponent implements OnInit, OnDestroy {
  bookmarkedProjects: Project[];
  acceptedProjects: Project[];
  declinedProjects: Project[];
  appliedProjects: Project[];
  projectsSubscription: Subscription;
  from: string;
  userId: number;
  projects: Project[];
  constructor(private projectService: ProjectService,
    public auth: AuthService
  ) { }
  ngOnInit(): void {
    this.userId = +this.auth.getCurrentUserId();
    this.from = 'myProjects';
    this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'B').subscribe(
      res => this.bookmarkedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
      error => console.log(error));
    this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'A').subscribe(
      res => this.appliedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
      error => console.log(error));
    this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'C').subscribe(
      res => this.acceptedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
      error => console.log(error));
    this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'D').subscribe(
      res => this.declinedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
      error => console.log(error));
  }
  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }
}
