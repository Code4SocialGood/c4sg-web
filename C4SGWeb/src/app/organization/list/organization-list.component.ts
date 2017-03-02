import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organization } from '../common/organization';
import { OrganizationService } from '../common/organization.service';
import { PagerService } from '../../_services/pager.service';

declare const $: Function;

@Component({
  selector: 'my-organizations',
  templateUrl: 'organization-list.component.html',
  styleUrls: ['organization-list.component.css']
})

export class OrganizationListComponent implements OnInit, AfterViewInit {

  organizations: Object[];
  selectedOrganization: Organization;

  // array of all items to be paged
  // organizations: any[];

  // pager Object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(private organizationService: OrganizationService,
              private router: Router, private pagerService: PagerService) {
  }

  ngOnInit(): void {
     this.getOrganizations();
  }

   ngAfterViewInit(): void {
    // jquery script below opens up the modal dialog for delete confirmation
    $(document).ready(() => {
      $('.modal').modal();
    });
  }

  getOrganizations() {
    this.organizationService.getOrganizations().subscribe(
      res => {
        this.organizations = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      },
      error => console.log(error)
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.organizations.length, page);

    // get current page of items
    this.pagedItems = this.organizations.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getOrganizationsByKeyword(keyword: string) {
    keyword = keyword.trim();
    if (!keyword) {
      return;
    }

    this.organizationService.getOrganizationsByKeyword(keyword).subscribe(
      res => {
        this.organizations = JSON.parse(JSON.parse(JSON.stringify(res))._body);
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
    this.router.navigate(['/organization', organization.id]);
  }

   // delete callback
  delete(organization: Organization): void { /*
    this.organizationService.delete(organization.id).subscribe(
      error => console.log(error)
    );
   // after deletion, the steps below updates the view and excludes the deleted organization
    this.organizations = this.organizations.filter(u => u !== organization);
    this.pagedItems = this.pagedItems.filter(u => u !== organization);
    if (this.selectedOrganization === organization) {
      this.selectedOrganization = null;
    } */
  }

  // edit callback, TODO
  edit(organization: Organization): void {
    this.selectedOrganization = organization;
    // this.router.navigate(['/organization', organization.id]);
  }

}
