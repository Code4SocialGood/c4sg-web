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
  selector: 'my-projects-nonprofit',
  templateUrl: 'my-projects-nonprofit.html',
  styleUrls: ['project-list.component.scss']
})


export class ProjectListNonprofitComponent implements OnInit, OnDestroy {
  activeProjects: Project[];
  closedProjects: Project[];
  projectsSubscription: Subscription;
  from: string;
  userId: number;
  orgId: number;
  totalItems = 0;
  projects: Project[];
  constructor(private organizationService: OrganizationService,
    private projectService: ProjectService,
    private skillService: SkillService,
    public auth: AuthService
  ) { }
  ngOnInit(): void {
    this.userId = +this.auth.getCurrentUserId();
    this.from = 'myProjects';
    this.organizationService.getUserOrganization(this.userId).subscribe(
      response => {
        this.orgId = response.reduce((acc) => acc).id;
        // Returns project of any status: 'A' and' 'C'
        this.projectsSubscription = this.projectService.getProjectByOrg(this.orgId, null).subscribe(
          res => {
            this.projects = res.json();
            this.totalItems = this.projects.length;
            this.projects.forEach((e: Project) => {
              this.skillService.getSkillsByProject(e.id).subscribe(
                result => {
                  e.skills = result;
                });
            });
            this.activeProjects = this.projects.filter((project) => project.status === 'A');
            this.closedProjects = this.projects.filter((project) => project.status === 'C');
            console.log('Active Projs=' + this.activeProjects);

          },
          error => console.log(error)
        );
      },
      error => console.log(error)
    );
  }
  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }
}

