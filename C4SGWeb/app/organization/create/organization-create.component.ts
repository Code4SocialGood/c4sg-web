import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Organization } from '../common/organization';
import { OrganizationService } from '../common/organization.service';

@Component({
  selector: 'create-organization',
  templateUrl: 'organization-create.component.html',
  styleUrls: ['organization-create.component.css']
})

export class OrganizationCreateComponent {

    organization: Organization;
    params: Params;

  constructor(private organizationService: OrganizationService, private router: Router) {
  }

}
