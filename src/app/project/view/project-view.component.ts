import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../common/project';
import { Organization } from '../../organization/common/organization';
import { User } from '../../user/common/user';
import { JobTitle } from '../../job-title';
import { ProjectService } from '../common/project.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { UserService } from '../../user/common/user.service';
import { AuthService } from '../../auth.service';
import { SkillService} from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';
import { FormConstantsService } from '../../_services/form-constants.service';

declare const Materialize: any;

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
  user: User;
  public jobTitlesArray: JobTitle[] = [];
  numberOfProjects: number;
  params: Params;
  currentUserId: string;
  // userProjectStatus: string;

  auth: AuthService;
  categoryName: string;

  globalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();

  displayShare = true;
  displayApply = false;
  displayBookmark = false;
  displayEdit = false;
  displayReopen = false;
  displayClose = false;
  displayApplicants = false;
  displayApplicationForm = false;

  userProfileIncomplete = false;
  projectStatusApplied = false;
  projectStatusBookmarked = false;
  projectStatusAccepted = false;

  projectStatusDeclined = false;
  prevPage: string;
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
    this.prevPage = localStorage.getItem('prevPage');
    localStorage.setItem('prevPage', '');

    this.projectService.getProject(id)
        .subscribe(
          res => {
            this.project = res;
            this.getSkills(id);
            this.displayButtons();
            this.getOrganization(res.organizationId);
            this.getProjects(res.organizationId);

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

  pad(str: string, padValue: string, max: number): string {
    max += str.length;
    return (max - str.length > 0 ? padValue.repeat(max - str.length) + str : str);
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

  displayButtons(): void {

    if (!this.authService.authenticated()) {
      this.displayApply = true;
      this.displayBookmark = true;
    } else if (this.authService.authenticated()) {
      if (this.authService.isVolunteer()) {
        this.displayApply = true;
        this.displayBookmark = true;
        // if user applied or bookmarked this project, disable the apply/bookmark button
        const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();

        if (projectsIDs != null) {
          if (projectsIDs.appliedProjectsIDs != null
            && projectsIDs.appliedProjectsIDs.split(',').includes(this.projectId)) {
            this.projectStatusApplied = true;
          } else {
            this.projectStatusApplied = false;
          }
          if (projectsIDs.bookmarkedProjectsIDs != null
            && projectsIDs.bookmarkedProjectsIDs.split(',').includes(this.projectId)) {
            this.projectStatusBookmarked = true;
          } else {
            this.projectStatusBookmarked = false;
          }
          if (projectsIDs.acceptedProjectsIDs != null
            && projectsIDs.acceptedProjectsIDs.split(',').includes(this.projectId)) {
            this.projectStatusAccepted = true;
          } else {
            this.projectStatusAccepted = false;
          }
          if (projectsIDs.declinedProjectsIDs != null
            && projectsIDs.declinedProjectsIDs.split(',').includes(this.projectId)) {
            this.projectStatusDeclined = true;
          } else {
            this.projectStatusDeclined = false;
          }
        }

        // If user profile hasn't complete, user can't apply
        this.userService.getUser(Number(this.currentUserId)).subscribe(
          res => {
            this.user = res;
            if (!this.user.userName) {
              this.userProfileIncomplete = true;
            }
          },
          error => console.log(error)
        );
      } else if (this.authService.isOrganization()) {
        this.organizationService.getUserOrganization(Number(this.authService.getCurrentUserId())).subscribe(
          res => {
            let organization: Organization;
            organization = res[0];
            if ((organization !== undefined) && (organization.id === Number(this.project.organizationId))) {
              this.displayEdit = true;
              this.displayClose = true;
              this.displayApplicants = true;
              this.displayReopen = false;
            }
            if (this.project.status === 'C') {
              this.displayClose = false;
              this.displayShare = false;
              this.displayEdit = false;
              this.displayReopen = true;

            }
          },
          error => console.log(error)
        );
      } else if (this.authService.isAdmin()) {
        this.displayEdit = true;
        this.displayClose = true;
        this.displayApplicants = true;
        this.displayReopen = false;
        if (this.project.status === 'C') {
          this.displayClose = false;
          this.displayShare = false;
          this.displayEdit = false;
          this.displayReopen = true;
        }
      }
    }
  }

  toggleApplicationForm(): void {
      if (this.authService.authenticated() && this.currentUserId !== null && this.currentUserId !== '0') {
        if (this.displayApplicationForm === false) {
            this.displayApplicationForm = true;
        } else {
            this.displayApplicationForm = false;
        }
      } else {
        localStorage.setItem('redirectAfterLogin', this.router.url);
        this.authService.login();
      }
  }

  // refer application component
  onApplicationCreated(applicationCreated: boolean): void {
    if (applicationCreated) {
        this.projectStatusApplied = true;
        this.toggleApplicationForm();
        const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();
        localStorage.setItem('appliedProjectsIDs', (projectsIDs.appliedProjectsIDs + ',' + this.project.id));
        this.globalActions.emit({action: 'toast', params: ['You have applied for the project', 4000]});

    } else {
        this.globalActions.emit({action: 'toast', params: ['Error in application', 4000]});
        this.projectStatusApplied = false;
    }
  }

  // refer application component
  onApplicationAccepted(applicationAccepted: boolean): void {
    if (applicationAccepted) {

        const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();
        localStorage.setItem('acceptedProjectsIDs', (projectsIDs.acceptedProjectsIDs + ',' + this.project.id));
        this.globalActions.emit({action: 'toast', params: ['You have accepted the applicant', 4000]});

    } else {
        this.globalActions.emit({action: 'toast', params: ['Error in accepting the applicant', 4000]});
    }
  }

  // refer application component
  onApplicationDeclined(applicationDeclined: boolean): void {
    if (applicationDeclined) {

        const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();
        localStorage.setItem('declinedProjectsIDs', (projectsIDs.declinedProjectsIDs + ',' + this.project.id));
        this.globalActions.emit({action: 'toast', params: ['You have declined the applicant', 4000]});

    } else {
        this.globalActions.emit({action: 'toast', params: ['Error in declining the applicant', 4000]});
    }
  }

  // refer application component
  isBadgeGiven(badgeGiven: boolean): void {
    if (badgeGiven) {
        this.globalActions.emit({action: 'toast', params: ['You have given out a badge to the volunteer.', 4000]});
    } else {
        this.globalActions.emit({action: 'toast', params: ['Error in giving a badge to the volunteer', 4000]});
    }
  }

  createBookmark(): void {
        if (this.authService.authenticated() && this.currentUserId !== null && this.currentUserId !== '0') {
            this.projectService.createBookmark(this.project.id, this.currentUserId)
            .subscribe(res => {
                const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();
                localStorage.setItem('bookmarkedProjectsIDs', (projectsIDs.bookmarkedProjectsIDs + ',' + this.project.id));
                this.projectStatusBookmarked = true;
                this.globalActions.emit({action: 'toast', params: ['You have bookmarked the project', 4000]});
            }, (error) => {
                this.globalActions.emit({action: 'toast', params: ['Error creating bookmark', 4000]});
            });
        } else {
          localStorage.setItem('redirectAfterLogin', this.router.url);
          this.authService.login();
        }
  }

  edit(): void {
    this.router.navigate(['project/edit', this.project.id]);
  }

  reOpen(): void {
    this.project.status = 'A';
    this.projectService
      .update(this.project)
      .subscribe(res => {
        this.router.navigate(['/project/view/' + this.project.id]);
        Materialize.toast('The project is reopened', 4000);
        this.displayEdit = true;
        this.displayClose = true;
        this.displayApplicants = true;
        this.displayReopen = false;
      }, error => console.log(error));
  }

  goBack(): void {
    localStorage.setItem('prevPage', 'ProjectList');
    this.location.back();

  }

  onClose(): void {
    this.projectService
      .delete(this.project.id)
      .subscribe(
        response => {
          this.router.navigate(['/project/view', this.project.id]);
          Materialize.toast('The project is closed', 4000);
          this.project.status = 'C';
          this.displayClose = false;
          this.displayShare = false;
          this.displayEdit = false;
          this.displayReopen = true;
          // this.router.navigate(['/project/view', this.project.id]);
        },
        error => {
            Materialize.toast('Error closing the project', 4000);
            console.log(error);
        }
      );
  }

  redirectToMySettings(): void {
    this.router.navigate(['user/edit', this.currentUserId]);
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
