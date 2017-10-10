import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { User } from '../common/user';
import { Project } from '../../project/common/project';
import { Organization } from '../../organization/common/organization';
import { JobTitle } from '../../job-title';
import { UserService } from '../common/user.service';
import { AuthService } from '../../auth.service';
import { SkillService } from '../../skill/common/skill.service';
import { ProjectService} from '../../project/common/project.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { MaterializeAction } from 'angular2-materialize';
import { FormConstantsService } from '../../_services/form-constants.service';

declare var Materialize: any;

@Component({
  // moduleId: module.id,
  selector: 'my-view-user',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.scss']
})

export class UserViewComponent implements OnInit {

  user: User;
  loggedInUserId: number;
  projects: Project[];
  organization: Organization;
  avatar: any = '';
  public jobTitlesArray: JobTitle[] = [];
  categoryName: string;

  displayEdit = false;
  displayDelete = false;

  globalActions = new EventEmitter<string | MaterializeAction>();
  modalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private organizationService: OrganizationService,
    public authService: AuthService,
    private skillService: SkillService,
    public constantsService: FormConstantsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['userId'];
    this.loggedInUserId = +this.authService.getCurrentUserId();
    this.getUser(id);
    this.displayButtons(id);
    this.userService.getAllJobTitles()
      .subscribe(
      res => {
        this.jobTitlesArray = res;
      }, error => console.log(error)
      );
  }

  pad(str: string, padValue: string, max: number): string {
    max += str.length;
    return (max - str.length > 0 ? padValue.repeat(max - str.length) + str : str);
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      res => {
        this.user = res;

        if (this.user.role === 'V') { // Gets accepted projects for volunteer history
          this.getAcceptedProjects(id);

          this.skillService.getSkillsForUser(id).subscribe(
            result => {
              this.user.skills = result;
            },
            error => console.log(error)
          );
        } else if (this.user.role === 'O') { // Gets organization and projects
          this.getOrganizationAndProjects(id);
        }
      },
      error => console.log(error)
    );
  }

  // Organization and Projects for this user
  getOrganizationAndProjects(userId): void {

    this.organizationService.getUserOrganization(userId)
      .subscribe(
          resi => {
            this.organization = resi[0];

            // Validation rules should force websiteUrl to start with http but add check just in case
            if (this.organization.websiteUrl && this.organization.websiteUrl.indexOf('http') !== 0) {
              this.organization.websiteUrl = `http://${this.organization.websiteUrl}`;
            }

            if (this.organization.description != null && this.organization.description.length > 100) {
                this.organization.description = this.organization.description.slice(0, 100) + '...';
            }

            this.setCategoryName();

            this.projectService.getProjectByOrg(this.organization.id, 'A')
              .subscribe(
                resProjects => {
                  this.projects = resProjects.json();
                  this.projects.forEach((e: Project) => {
                    this.skillService.getSkillsByProject(e.id).subscribe(
                      response => {
                        e.skills = response;
                      });
                  });
                },
                  errorProjects => console.log(errorProjects)
              );
          }
      );
  }

  setCategoryName(): void {
    if (this.organization.category === 'N') {
      this.categoryName = 'Nonprofit';
    } else if (this.organization.category === 'O') {
      this.categoryName = 'Open Source';
    } else if (this.organization.category === 'S') {
      this.categoryName = 'Social Enterprise';
    } else if (this.organization.category === 'U') {
      this.categoryName = 'Startup';
    }
  }

  displayButtons(id: number): void {

    if (this.authService.authenticated()) {
      if (this.authService.isAdmin()) {
        this.displayEdit = true;
        this.displayDelete = true;
      }
    }
  }

  edit(organization): void {
    this.router.navigate(['/user/edit', this.user.id]);
  }

  delete(): void {
    this.userService
      .delete(this.user.id)
      .subscribe(
      response => {
        Materialize.toast('The user is deleted', 4000);
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error => {
        console.error(error, 'An error occurred');
        Materialize.toast('Error deleting the user', 4000);
      }
      );
  }

  goBack(): void {
    this.location.back();
  }

  getAcceptedProjects(id: number) {
    this.projectService.getProjectByUser(id, 'C').subscribe(
      res => {
        this.projects = res.json();
        this.projects.forEach((project) => {
          if (project.description && project.description.length > 100) {
            project.description = project.description.slice(0, 100) + '...';
          }
           this.skillService.getSkillsByProject(project.id).subscribe(
                result => {
                     project.skills = result;
                      });
        });
      },
      error => console.log(error)
    );
  }

  openModal() {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
  }

  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }
}
