import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { OrganizationService } from '../common/organization.service';
import { UploaderService } from '../../_services/uploader.service';
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
    private uploader:UploaderService,) {
    this.getRoute();
    this.organization.logo = '';
  }

  ngOnInit(): void {
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
        const org = res.json()
        org.logo = ''
        this.organization = org
        this.uploader.displayImage(id,
            this.organizationService.retrieveLogo.bind(this.organizationService),
            (img: any) => this.organization.logo = img)
      }, 
      (err) => {
        console.error('An error occurred', err); 
      }
    )
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }
}
