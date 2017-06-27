import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { OrganizationService } from '../organization/common/organization.service';
import { Organization } from '../organization/common/organization';

@Component({
// moduleId: module.id,  // For webpack, remove this
  selector: 'my-c4sg-header',
  providers: [AuthService],
  templateUrl: './header.component.html',
  styleUrls: [ 'header.component.scss' ]
})

export class HeaderComponent implements DoCheck, OnInit {

  currentUserId: string;
  organizationId: string;
  atHome = false;

  constructor(private router: Router, public authSvc: AuthService, private organizationService: OrganizationService) {
  }

  ngOnInit(): void {
    // Subscribe to updates to the organization
    this.organizationService.organizationLinkedSource$.subscribe(res => {
      this.setOrganizationId(res);
    });
  }
  loadProjects(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/project/list', 'reload'], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/project/list/projects']));
  }
  loadVolunteers(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/user/list', { from: 'reload' }], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/user/list']));
  }

  loadOrganizations(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/organization/list', 'reload'], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/organization/list/organizations']));
  }

  private setOrganizationId(organizationId: string): void {
    this.organizationId = organizationId;
    localStorage.setItem('userOrganizationId', organizationId);
  }

  // control nav style by changing the class name
  isAtHome() {
    if (this.router.url === '/' || this.router.url === '/#!') {
      return 'at-home';
    }
    return 'off-home';
  }

  ngDoCheck() {
    if (this.authSvc.authenticated() && this.currentUserId == null) {
      this.currentUserId = this.authSvc.getCurrentUserId();
      if (this.currentUserId !== '0' && this.currentUserId !== null ) {
        // for a non-profit user, get the associated org-id
        this.organizationService.getUserOrganization(+this.currentUserId).subscribe(
          res => {
            let organization: Organization;
            // will contain at most 1 entry in the array when a match is found,
            // otherwise, data is undefined
            organization = res[0];
            if (organization !== undefined) {
              this.setOrganizationId(organization.id.toString());
            }
          },
          error => console.log(error)
        );
      }
    }
  }
}
