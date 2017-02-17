import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organization } from '../common/organization';
import { OrganizationService } from '../common/organization.service';

@Component({
  selector: 'my-organizations',
  templateUrl: 'organization-list.component.html',
  styleUrls: ['organization-list.component.css']
})

export class OrganizationListComponent implements OnInit {

  organizations: Object[];
  selectedOrganization: Organization;

  constructor(private organizationService: OrganizationService, private router: Router) {
  }

  ngOnInit(): void {
     this.getOrganizations();
  }

  getOrganizations() {
    this.organizationService.getOrganizations().subscribe(
      res => {
        this.organizations = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      },
      error => console.log(error)
    );
  }

  getOrganizationsByKeyword(keyword: string) {
    keyword = keyword.trim();
    if (!keyword) {
      return;
    }

    this.organizationService.getOrganizationsByKeyword(keyword).subscribe(
      res => {
        this.organizations = JSON.parse(JSON.parse(JSON.stringify(res))._body);
        this.router.navigate(['/organizations']);
      },
      error => console.log(error)
    );
  }

  onSelect(organization: Organization): void {
    this.selectedOrganization = organization;
    this.router.navigate(['/organization', organization.id]);
  }
}
