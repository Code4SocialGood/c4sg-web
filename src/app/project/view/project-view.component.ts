import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { Organization } from '../../organization/common/organization';
import { AuthService } from '../../auth.service';
import { MaterializeAction } from 'angular2-materialize';
import { ImageDisplayService } from '../../_services/image-display.service';

@Component({
  selector: 'my-view-project',
  providers: [AuthService],
  templateUrl: 'project-view.component.html',
  styleUrls: ['project-view.component.scss']
})

export class ProjectViewComponent implements OnInit {

  project: Project;
  organization: Organization;
  projects: Project[];
  numberOfProjects: number;
  params: Params;
  currentUserId: string;
  globalActions = new EventEmitter<string|MaterializeAction>();
  deleteGlobalActions = new EventEmitter<string|MaterializeAction>();
  projectImage: any = '';
  orgImage: any = '';

  displayApply = false;
  displayBookmark = false;
  displayShare = false;
  displayEdit = false;
  displayDelete = false;

  constructor(private projectService: ProjectService,
              private organizationService: OrganizationService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private location: Location,
              private imageDisplay: ImageDisplayService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['projectId'];

      this.imageDisplay.displayImage(id, this.projectService.retrieveImage.bind(this.projectService))
          .subscribe (
              res => this.projectImage = res.url
              );

      this.projectService.getProject(id)
      .subscribe(
          res => {
            this.project = res;

            // Organization for this project
            this.organizationService.getOrganization(res.organizationId)
                .subscribe(
                    resi => {
                      this.organization = resi;

                      // Validation rules should force websiteUrl to start with http but add check just in case
                      if (this.organization.websiteUrl && this.organization.websiteUrl.indexOf('http') !== 0) {
                        this.organization.websiteUrl = `http://${this.organization.websiteUrl}`;
                      }

                      if (this.organization.description.length > 100) {
                          this.organization.description = this.organization.description.slice(0, 100) + '...';
                      }
                    }
                    );

            // Projects for this organization
            this.projectService.getProjectByOrg(res.organizationId)
                  .subscribe(
                      resProjects => this.projects = resProjects.json(),
                      errorProjects => console.log(errorProjects)
                  );

            this.imageDisplay.displayImage(res.organizationId, this.organizationService.retrieveLogo.bind(this.organizationService))
                .subscribe (
                    resi => {
                      this.orgImage = resi.url;
                    }
                    );

            this.displayButtons();

          },
          error => console.log(error)
          );
    });
  }

  displayButtons(): void {

    if (!this.authService.authenticated()) {
      this.displayApply = true;
      this.displayBookmark = true;
      this.displayShare = true;
    } else if (this.authService.authenticated()) {
      if (this.authService.isVolunteer()) {
        this.displayApply = true;
        this.displayBookmark = true;
        this.displayShare = true;
      } else if (this.authService.isOrganization()) {
        this.organizationService.getUserOrganization(Number(this.authService.getCurrentUserId())).subscribe(
          res => {
            let organization: Organization;
            organization = res[0];
            if ((organization !== undefined) && (organization.id == this.project.organizationId)) {
              this.displayEdit= true;
              this.displayDelete = true;
              this.displayShare = true;
            }
          },
          error => console.log(error)
        );
      } else if (this.authService.isAdmin()) {
        this.displayEdit= true;
        this.displayDelete = true;
        this.displayShare = true;
      }  
    }  
  }

  apply(): void {
    // TODO
  }

  bookmark(): void {
    // check if user is logged in
    this.currentUserId = this.authService.getCurrentUserId();
    if (this.authService.authenticated() && this.currentUserId !== null && this.currentUserId !== '0') {
        this.projectService
            .bookmark(this.project.id, this.currentUserId)
            .subscribe(
                response => {
                    // display toast
                    this.globalActions.emit({action: 'toast', params: ['Bookmark added for the project', 4000]});

                },
                error => {
                    // display toast when bookmar is already added
                    this.globalActions.emit({action: 'toast', params: [JSON.parse(error._body).message, 4000]});
                }
            );
    } else {
        // display toast when user is not logged in
        this.globalActions.emit({action: 'toast', params: ['Please login to add bookmark', 4000]});
    }
  }

  edit(): void {
    this.router.navigate(['project/edit', this.project.id]);
  }

  delete(): void {
    this.projectService
      .delete(this.project.id)
      .subscribe(
        response => {
          this.router.navigate(['project/list']);
          // display toast
          this.deleteGlobalActions.emit({action: 'toast', params: ['Project deleted successfully', 4000]});
        },
        error => {
            console.log(error);
            this.deleteGlobalActions.emit({action: 'toast', params: ['Error while deleting a project', 4000]});
        }
      );
  }
}
