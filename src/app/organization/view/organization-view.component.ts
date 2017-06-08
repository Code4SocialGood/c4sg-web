import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { OrganizationService } from '../common/organization.service';
import { ProjectService} from '../../project/common/project.service';
import { UserService } from '../../user/common/user.service';
import { AuthService } from '../../auth.service';
import { ImageDisplayService } from '../../_services/image-display.service';
import { SkillService } from '../../skill/common/skill.service';
import { Project } from '../../project/common/project';
import { User } from '../../user/common/user';
import { Organization } from '../../organization/common/organization';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'my-organization',
  templateUrl: 'organization-view.component.html',
  styleUrls: ['organization-view.component.scss']
})

export class OrganizationViewComponent implements OnInit, OnDestroy {

  organization: any = {};
  projects: Project[];
  user: User;
  categoryName: string;
  private routeSubscription: Subscription;
  globalActions = new EventEmitter<string|MaterializeAction>();
  deleteGlobalActions = new EventEmitter<string|MaterializeAction>();
  defaultAvatarOrganization = '../../assets/default_image.png';

  displayShare = true;
  displayEdit = false;
  displayDelete = false;

  constructor(private organizationService: OrganizationService,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthService,
    private skillService: SkillService,
    private route: ActivatedRoute,
    private router: Router,
    private imageDisplay: ImageDisplayService) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.getOrganization(+params['organizationId']);
        this.displayButtons(+params['organizationId']);
        this.getUser(+params['organizationId']);
      }
    );
  }

  setCategoryName(): void {
    if (this.organization.category === 'N') {
      this.categoryName = 'Nonprofit';
    } else if (this.organization.category === 'O') {
      this.categoryName = 'Open Source';
    } else if (this.organization.category === 'M') {
      this.categoryName = 'Misc';
    }
  }

  displayButtons(organizationId: number): void {

    if (!this.authService.authenticated()) {
      this.displayShare = true;
    } else if (this.authService.authenticated()) {
      if (this.authService.isAdmin()) {
        this.displayEdit = true;
        this.displayDelete = true;
      }
    }
  }

  getOrganization(id: number): void {
    this.organizationService.getOrganization(id).subscribe(
      (res) => {
        const org = res;
        this.organization = org;
        this.getLogo(org.id);
        this.getProjects(org.id);
        this.setCategoryName();
        // Validation rules should force websiteUrl to start with http but add check just in case
        if (this.organization.websiteUrl && this.organization.websiteUrl.indexOf('http') !== 0) {
          this.organization.websiteUrl = `http://${this.organization.websiteUrl}`;
        }
      },
      (err) => {
        console.error('An error occurred', err); // for demo purposes only
      }
    );
  }

  getLogo(id: number): void {
    this.imageDisplay.displayImage(id,
      this.organizationService.retrieveLogo.bind(this.organizationService))
      .subscribe(res => this.organization.logo = res.url);
  }

  getProjects(id: number): void {
    this.projectService.getProjectByOrg(id, 'A').subscribe(
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

  getUser(orgId: number): void {
    // TODO pending backend findUserForOrg
    this.userService.getUser(2).subscribe(
      response => this.user = response,
      errorProjects => console.log(errorProjects)
    );
  }

  edit(organization): void {
    this.router.navigate(['/organization/edit', this.organization.id]);
  }

  delete(): void {
    this.organizationService
      .delete(this.organization.id)
      .subscribe(
        response => {
          this.router.navigate(['/organization/list/organizations']);
          this.deleteGlobalActions.emit({action: 'toast', params: ['Organization deleted successfully', 4000]});
        },
        error => {
            console.log(error);
            this.deleteGlobalActions.emit({action: 'toast', params: ['Error while deleting an organiation', 4000]});
        }
      );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }
}
