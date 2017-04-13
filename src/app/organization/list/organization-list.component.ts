import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organization } from '../common/organization';
import { OrganizationService } from '../common/organization.service';

declare const $: Function;

@Component({
  selector: 'my-organizations',
  templateUrl: 'organization-list.component.html',
  styleUrls: ['organization-list.component.scss']
})

export class OrganizationListComponent implements OnInit, AfterViewInit {

  p = 0;
  organizations: Object[];
  selectedOrganization?: Organization;

  // array of all items to be paged
//   organizations: any[];


  constructor(private organizationService: OrganizationService,
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

  getOrganizations() {
    this.organizationService.getOrganizations()
        .subscribe(
          res => this.organizations = res,
          error => console.log(error)
        );
  }

  getOrganizationsByKeyword(keyword: string) {
    keyword = keyword.trim();

    if (!keyword) {
      return;
    }

    this.organizationService
        .getOrganizationsByKeyword(keyword)
        .subscribe(
          res => {
            this.organizations = res;
            this.router.navigate(['/organization']);
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
