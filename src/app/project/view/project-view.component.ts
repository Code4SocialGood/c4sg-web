import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../common/project';
import { Organization } from '../../organization/common/organization';
import { User } from '../../user/common/user';
import { JobTitle } from '../../job-title';
import { Applicant } from '../../user/common/applicant';
import { ProjectService } from '../common/project.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { UserService } from '../../user/common/user.service';
import { AuthService } from '../../auth.service';
import { SkillService} from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-view-project',
  providers: [AuthService],
  templateUrl: 'project-view.component.html',
  styleUrls: ['project-view.component.scss']
})

export class ProjectViewComponent implements OnInit {

  organization: Organization;
  project: Project;
  projects: Project[];
  public jobTitlesArray: JobTitle[] = [];
  numberOfProjects: number;
  params: Params;
  currentUserId: string;
  globalActions = new EventEmitter<string|MaterializeAction>();
  deleteGlobalActions = new EventEmitter<string|MaterializeAction>();
  // userProjectStatus: string;
  projectStatusApplied = false;
  projectStatusBookmarked = false;
  auth: AuthService;
  categoryName: string;

  modalActions = new EventEmitter<string|MaterializeAction>();

  displayShare = true;
  displayApply = false;
  displayBookmark = false;
  displayEdit = false;
  displayDelete = false;
  displayApplicants = false;
  applicants: Applicant[];

  projectId;

  constructor(private projectService: ProjectService,
              private organizationService: OrganizationService,
              private userService: UserService,
              private skillService: SkillService,
              public constantsService: FormConstantsService,
              private route: ActivatedRoute,
              private router: Router,
              public authService: AuthService,
              private location: Location) {
  }

  ngOnInit(): void {

    this.auth = this.authService;
    this.currentUserId = this.authService.getCurrentUserId();

    this.route.params.subscribe(params => {
      const id = params['projectId'];
      this.projectId = id;

      this.projectService.getProject(id)
      .subscribe(
          res => {
            this.project = res;
            this.getSkills(id);
            this.displayButtons();
            this.getOrganization(res.organizationId);
            this.getProjects(res.organizationId);
            this.getApplicants(id);
          },
          error => console.log(error)
          );

          this.userService.getAllJobTitles()
      .subscribe(
      res => {
        this.jobTitlesArray = res;
      }, error => console.log(error)
      );
    });
  }

  // Skills for this project
  getSkills(projectId): void {
    this.skillService.getSkillsByProject(projectId)
      .subscribe(
        result => {
          this.project.skills = result;
        }
      );
  }

  // Projects for this organization
  getProjects(organizationId): void {
    this.projectService.getProjectByOrg(organizationId, 'A')
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

  // Organization for this project
  getOrganization(organizationId): void {

    this.organizationService.getOrganization(organizationId)
        .subscribe(
            resi => {
              this.organization = resi;

              // Validation rules should force websiteUrl to start with http but add check just in case
              if (this.organization.websiteUrl && this.organization.websiteUrl.indexOf('http') !== 0) {
                this.organization.websiteUrl = `http://${this.organization.websiteUrl}`;
              }

              if (this.organization.description != null && this.organization.description.length > 100) {
                  this.organization.description = this.organization.description.slice(0, 100) + '...';
              }

              this.setCategoryName();
            }
            );
  }

  // Gets applicants for this project
  getApplicants(projectId): void {

    this.userService.getApplicants(projectId)
          .subscribe(
            res => {
              this.applicants = res;
            }
          );
  }

  displayButtons(): void {

    if (!this.authService.authenticated()) {
      this.displayApply = true;
      this.displayBookmark = true;
    } else if (this.authService.authenticated()) {
      if (this.authService.isVolunteer()) {
        this.displayApply = true;
        this.displayBookmark = true;

        // Checks whether login user applied or bookmarked this project, to determine whether to disable Apply/Bookmark button
        const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();
        if (projectsIDs.appliedProjectsIDs.includes(this.projectId)) {
          this.projectStatusApplied = true;
        }
        if (projectsIDs.bookmarkedProjectsIDs.includes(this.projectId)) {
          this.projectStatusBookmarked = true;
        }
      } else if (this.authService.isOrganization()) {
        this.organizationService.getUserOrganization(Number(this.authService.getCurrentUserId())).subscribe(
          res => {
            let organization: Organization;
            organization = res[0];
            if ((organization !== undefined) && (organization.id === Number(this.project.organizationId))) {
              this.displayEdit = true;
              this.displayDelete = true;
              this.displayApplicants = true;
            }
            if (this.project.status === 'C') {
              this.displayDelete = false;
            }
          },
          error => console.log(error)
        );
      } else if (this.authService.isAdmin()) {
        this.displayEdit = true;
        this.displayDelete = true;
        this.displayApplicants = true;
        if (this.project.status === 'C') {
              this.displayDelete = false;
            }
      }
    }
  }


  saveUserProject(userId, status, applicant) {

    if (this.authService.authenticated() && this.currentUserId !== null && this.currentUserId !== '0') {
        return this.projectService
            .linkUserProject(this.project.id, userId, status)
            .subscribe(
                response => {
                    // display toast
                    if (status === 'A') {
                      this.globalActions.emit({action: 'toast', params: ['You have applied for the project', 4000]});
                      this.projectStatusApplied = true;
                    } else if (status === 'B') {
                      this.globalActions.emit({action: 'toast', params: ['You have bookmarked the project', 4000]});
                      this.projectStatusBookmarked = true;
                    } else if (status === 'C') {
                    this.globalActions.emit({action: 'toast', params: ['You have accepted the applicant', 4000]});
                    applicant.applicationStatus = 'C';

                  } else if (status === 'D') {
                    this.globalActions.emit({action: 'toast', params: ['You have declined the applicant', 4000]});
                      applicant.applicationStatus = 'D';
                  }
                    this.router.navigate(['/project/view', this.project.id]);
                },
                error => {
                    // display error toast
                    this.globalActions.emit({action: 'toast', params: [JSON.parse(error._body).message, 4000]});
                }
            );
    } else {
        localStorage.setItem('redirectAfterLogin', this.router.url);
       this.authService.login();
    }
}

  // apply(): void {
  //   this.userProjectStatus = 'A';
  //   if (this.authService.authenticated() && this.currentUserId !== null && this.currentUserId !== '0') {
  //     debugger;
  //       this.projectService
  //           .linkUserProject(this.project.id, this.currentUserId, this.userProjectStatus)
  //           .subscribe(
  //               response => {
  //                   // display toast
  //                   this.globalActions.emit({action: 'toast', params: ['Applied for the project', 4000]});
  //                   this.projectStatusApplied = true;
  //               },
  //               error => {
  //                   // display toast when bookmar is already added
  //                   this.globalActions.emit({action: 'toast', params: [JSON.parse(error._body).message, 4000]});
  //               }
  //           );
  //   } else {
  //       localStorage.setItem('redirectAfterLogin', this.router.url);
  //       this.authService.login();
  //   }
  // }

  // bookmark(): void {
  //   // check if user is logged in
  //   this.userProjectStatus = 'B';
  //   if (this.authService.authenticated() && this.currentUserId !== null && this.currentUserId !== '0') {
  //       this.projectService
  //           .linkUserProject(this.project.id, this.currentUserId, this.userProjectStatus)
  //           .subscribe(
  //               response => {
  //                   // display toast
  //                 this.globalActions.emit({action: 'toast', params: ['Bookmark added for the project', 4000]});
  //                 this.projectStatusBookmarked = true;
  //               },
  //               error => {
  //                   // display toast when bookmar is already added
  //                   this.globalActions.emit({action: 'toast', params: [JSON.parse(error._body).message, 4000]});
  //               }
  //           );
  //   } else {
  //       localStorage.setItem('redirectAfterLogin', this.router.url);
  //       this.authService.login();
  //   }
  // }

  edit(): void {
    this.router.navigate(['project/edit', this.project.id]);
  }

  delete(): void {
    this.projectService
      .delete(this.project.id)
      .subscribe(
        response => {
          this.router.navigate(['project/list/projects']);
          this.deleteGlobalActions.emit({action: 'toast', params: ['Project deleted successfully', 4000]});
        },
        error => {
            console.log(error);
            this.deleteGlobalActions.emit({action: 'toast', params: ['Error while deleting a project', 4000]});
        }
      );
  }

  openModal(project) {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
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
}
