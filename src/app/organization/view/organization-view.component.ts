import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { OrganizationService } from '../common/organization.service';
import { ImageDisplayService } from '../../_services/image-display.service';
import {Project} from '../../project/common/project';
import {ProjectService} from '../../project/common/project.service';

@Component({
  // moduleId: module.id,
  selector: 'my-organization',
  templateUrl: 'organization-view.component.html',
  styleUrls: ['organization-view.component.scss']
})

export class OrganizationViewComponent implements OnInit, OnDestroy {
  public myOrganization;
  public organization: any = {};
  private orgIndex: number;
  private routeSubscription: Subscription;
  projects: Project[];

  constructor(private organizationService: OrganizationService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private imageDisplay: ImageDisplayService) {

      this.getRoute();
  }

  ngOnInit(): void {
  }

  getRoute(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.orgIndex = +params['organizationId'];

        this.organization.logo = '';
        this.getOrganization(this.orgIndex);
      }
    );
  }

  getOrganization(id: number): void {
    this.organizationService.getOrganization(id).subscribe(
      (res) => {
        const org = res;
        this.organization = org;
        this.getLogo(org.id);
        this.getProjects(org.id);

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
    this.projectService.getProjectByOrg(id).subscribe(
      res => {
        this.projects = res.json();
        this.projects.forEach((project) => {
          if (project.description && project.description.length > 100) {
            project.description = project.description.slice(0, 100) + '...';
          }
        });
      },
      error => console.log(error)
    );
  }

  edit(organization): void {
    this.router.navigate(['/nonprofit/edit', 2]);
  }

  confirmDelete(organization): void {
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }
}
