import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { OrganizationService } from './organization/common/organization.service';
import { Organization } from './organization/common/organization';

@Component({
// moduleId: module.id,  // For webpack, remove this
  selector: 'my-app',
  providers: [AuthService],
  templateUrl: './app.component.html',
  styleUrls: [ 'app.component.css' ]
})

export class AppComponent implements DoCheck {
    constructor(private router: Router, private auth: AuthService, private organizationService: OrganizationService) { }

    currentUserId: string;
    organizationId: string;

  // control nav style by changing the class name
  isAtHome() {
    if (this.router.url === '/' || this.router.url === '/#!') {
      return 'at-home';
    } else {
      return 'off-home';
    }
  }

  ngDoCheck() {
    if (this.auth.authenticated() && this.currentUserId == null)
    {
      this.currentUserId = this.auth.getCurrentUserId();
      if (this.currentUserId != '0' && this.currentUserId != null ) {
        // for a non-profit user, get the associated org-id
        this.organizationService.getUserOrganization(+this.currentUserId).subscribe(
          res => {
            let organization: Organization;
            // will contain at most 1 entry in the array when a match is found,
            // otherwise, data is undefined 
            organization = res[0];
            if (organization != undefined)
            {
              this.organizationId = organization.id.toString();
              localStorage.setItem("userOrganizationId", organization.id.toString()); 
            }
          },
          error => console.log(error)
        );
      }
    }
  }
}
