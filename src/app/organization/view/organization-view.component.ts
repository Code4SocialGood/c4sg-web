import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Rx';
import { OrganizationService } from '../common/organization.service';
import { ProjectService} from '../../project/common/project.service';
import { UserService } from '../../user/common/user.service';
import { AuthService } from '../../auth.service';
import { SkillService } from '../../skill/common/skill.service';
import { Project } from '../../project/common/project';
import { User } from '../../user/common/user';
import { Organization } from '../../organization/common/organization';
import { MaterializeAction } from 'angular2-materialize';
import { FormConstantsService } from '../../_services/form-constants.service';

declare const Materialize: any;

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
  modalActions = new EventEmitter<string|MaterializeAction>();

  displayShare = true;
  displayEdit = false;
  displayDelete = false;
  displayApprove = false;

  constructor(private organizationService: OrganizationService,
    private projectService: ProjectService,
    private userService: UserService,
    public authService: AuthService,
    private skillService: SkillService,
    public constantsService: FormConstantsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {
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

  pad(str: string, padValue: string, max: number): string {
    max += str.length;
    return (max - str.length > 0 ? padValue.repeat(max - str.length) + str : str);
  }

  setCategoryName(): void {
    if (this.organization.category === 'N') {
      this.categoryName = 'Nonprofit';
    } else if (this.organization.category === 'O') {
      this.categoryName = 'Open Source';
    } else if (this.organization.category === 'S') {
      this.categoryName = 'Social Enterprise';
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
        this.getProjects(org.id);
        this.setCategoryName();
        // Validation rules should force websiteUrl to start with http but add check just in case
        if (this.organization.websiteUrl && this.organization.websiteUrl.indexOf('http') !== 0) {
          this.organization.websiteUrl = `http://${this.organization.websiteUrl}`;
        }
        if (this.authService.authenticated() && this.authService.isAdmin()
          && (this.organization.status === 'P' || this.organization.status === 'C')) {
          this.displayApprove = true; // display buttons for Pendind or Declined organizations
        }
      },
      (err) => {
        console.error('An error occurred', err); // for demo purposes only
      }
    );
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
    this.userService.getUsersByOrganization(orgId).subscribe(
      response => this.user = response[0],
      errorProjects => console.log(errorProjects)
    );
  }

  getCountryName(countryCode): string {
    const countries = this.constantsService.getCountries();
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      return country.name;
    } else {
      return '';
    }
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
          Materialize.toast('The organization is deleted', 4000);
          // this.deleteGlobalActions.emit({action: 'toast', params: ['Organization deleted successfully', 4000]});
        },
        error => {
          console.log(error);
          Materialize.toast('Error while deleting an organiation', 4000);
          // this.deleteGlobalActions.emit({action: 'toast', params: ['Error while deleting an organiation', 4000]});
        }
      );
  }

  goBack(): void {
    this.location.back();
  }

  approve(): void {
    this.organizationService
      .approve(this.organization.id, 'A') // A for Active
      .subscribe(
        response => {
          this.organization.status = 'A'; // Removes the flag on web page after refreshing the page
          this.displayApprove = false; // Removes the button on web page after refreshing the page
          this.router.navigate(['/organization/view/' + this.organization.id]);
          Materialize.toast('The organization is approved', 4000);
        },
        error => {
          console.log(error);
        }
      );
  }

  decline(): void {
    this.organizationService
      .approve(this.organization.id, 'C') // C for Decline
      .subscribe(
        response => {
          this.router.navigate(['/organization/view/' + this.organization.id]);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
}
