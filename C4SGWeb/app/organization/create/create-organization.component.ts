import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css']
})

export class CreateOrganizationComponent {

    organization: Organization;
    params: Params;

  constructor(private organizationService: OrganizationService, private router: Router) {
  }

}
