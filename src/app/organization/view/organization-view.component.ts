import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { OrganizationService } from '../common/organization.service';
import { ImageDisplayService } from '../../_services/image-display.service';

@Component({
  // moduleId: module.id,
  selector: 'my-organization',
  templateUrl: 'organization-view.component.html',
  styleUrls: ['organization-view.component.css']
})

export class OrganizationViewComponent implements OnInit, OnDestroy {
  public myOrganization;
  public organization: any = {};
  private orgIndex: number;
  private routeSubscription: Subscription;

  constructor(private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private router: Router,
    private imageDisplay: ImageDisplayService) {

    this.getRoute();
  }

  ngOnInit(): void {
    this.organization.logo = ''
    this.getOrganization(this.orgIndex);
  }

  getRoute(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.orgIndex = +params['organizationId'];
      }
    );
  }

  getOrganization(id: number): void {
    this.organizationService.getOrganization(id).subscribe(
      (res) => {
        const org = res;
        this.organization = org;
        this.imageDisplay.displayImage(id,
            this.organizationService.retrieveLogo.bind(this.organizationService))
            .subscribe(res => this.organization.logo = res.url)
      },
      (err) => {
        console.error('An error occurred', err); // for demo purposes only
      }
    );
  }

  edit(organization): void {
    this.router.navigate(['/nonprofit/edit', 2]);
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }
}
