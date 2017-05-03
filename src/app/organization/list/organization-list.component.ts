import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organization } from '../common/organization';
import { OrganizationService } from '../common/organization.service';
import { ImageDisplayService } from '../../_services/image-display.service';

declare const $: Function;

@Component({
  selector: 'my-organizations',
  templateUrl: 'organization-list.component.html',
  styleUrls: ['organization-list.component.scss']
})

export class OrganizationListComponent implements OnInit, AfterViewInit {
  keyword: string;
  p = 0;
  organizations: Object[];
  selectedOrganization?: Organization;

  // array of all items to be paged
  //   organizations: any[];


  constructor(
    private idService: ImageDisplayService,
    private organizationService: OrganizationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getOrganizations();
  }

  ngAfterViewInit(): void {
    // jquery script below opens up the modal dialog for delete confirmation
    $(document)
      .ready(() => {
        $('.modal')
          .modal();
      });
  }

  getOrganizations(keyword?: string, hasOpportunities?: boolean) {
    if (keyword) {
      this.keyword = keyword;
    }

    this.organizationService.searchOrganizations(keyword, hasOpportunities)
        .subscribe( res => {
            this.organizations = res;
            res.forEach((o: Organization) => {
            this.idService.displayImage(o.id,
              this.organizationService.retrieveLogo.bind(this.organizationService))
              .subscribe(logo => {
                o.logo = logo.url;
              });
            });
          },
          error => console.log(error)
        );
  }

  // pre delete
  confirmDelete(organization: Organization): void {
    this.selectedOrganization = organization;
  }

  onSelect(organization: Organization): void {
    this.selectedOrganization = organization;
    // this.router.navigate(['/nonprofit/view', organization.id]);
  }

  // delete callback
  delete(organization: Organization): void {
    this.organizationService.delete(organization.id)
        .subscribe(
          error => console.log(error)
        );
    // after deletion, the steps below updates the view and excludes the deleted organization
    this.organizations = this.organizations.filter(u => u !== organization);
    // this.pagedItems = this.pagedItems.filter(u => u !== organization);
    if (this.selectedOrganization === organization) {
      this.selectedOrganization = null;
    }
  }

  // edit callback, TODO
  edit(organization: Organization): void {
    this.selectedOrganization = organization;
    this.router.navigate(['/nonprofit/edit', organization.id]);
  }

}
