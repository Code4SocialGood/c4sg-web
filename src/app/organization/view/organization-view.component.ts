import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {OrganizationService} from '../common/organization.service';
import {Project} from '../../project/common/project';
import {ProjectService} from '../../project/common/project.service';

@Component({
  // moduleId: module.id,
  selector: 'my-organization',
  templateUrl: 'organization-view.component.html',
  styleUrls: ['organization-view.component.css']
})

export class OrganizationViewComponent implements OnInit, OnDestroy {
  public myOrganization;
  public organization;
  private orgIndex: number;
  private routeSubscription: Subscription;
  projects: Project[];

  constructor(private organizationService: OrganizationService, private projectService: ProjectService, private route: ActivatedRoute,
              private router: Router) {
    this.getRoute();
  }

  ngOnInit(): void {
    this.getOrganization(this.orgIndex);
    this.getProjects(this.orgIndex);
  }

  getRoute(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.orgIndex = +params['organizationId'];
      }
    );
  }

  getOrganization(id: number): void {
    this.organizationService.getOrganization(id + 1).subscribe(
      (res) => {
        this.organization = res.json();
      }, (err) => {
        console.error('An error occurred', err); // for demo purposes only
      }
    );
  }

  getProjects(id: number): void {
    this.projectService.getProjectByOrg(id).subscribe(
      res => {
        this.projects = res.json();
        this.projects.forEach((project) => {
          if (project.description.length > 100) {
            project.description = project.description.slice(0, 100) + "...";
          }
        });
      },
      error => console.log(error)
    );
  }

  edit(organization): void {
    this.router.navigate(['/nonprofit/edit', 2]);
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
