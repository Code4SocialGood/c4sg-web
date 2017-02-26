import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { OrganizationService } from '../common/organization.service';

@Component({
  // moduleId: module.id,
  selector: 'my-organization',
  templateUrl: 'organization-view.component.html',
  styleUrls: ['organization-view.component.css']
})

export class OrganizationViewComponent implements OnInit, OnDestroy {
  public myOrganization;
  public organization;
  private orgIndex: number;
  private routeSubscription: Subscription;

  constructor(private organizationService: OrganizationService, private route: ActivatedRoute) {
    this.getRoute();
  }

  ngOnInit(): void {
    this.getOrganization(this.orgIndex);
  }

  getRoute(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.orgIndex = +params['id'];
      }
    );
  }

  getOrganization(id: number): void {
    this.organizationService.getOrganization(id).subscribe(
      (res) => {
        this.organization = res.json();
      }, (err) => {
        console.error('An error occurred', err); // for demo purposes only
      }
    );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }
}

// TODO: Move code below to organization-create.component.ts

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
// import { OrganizationService } from '../common/organization.service';

// @Component({
//   // moduleId: module.id,
//   selector: 'my-organization',
//   templateUrl: 'organization-view.component.html',
//   styleUrls: ['organization-view.component.css']
// })

// export class OrganizationViewComponent implements OnInit {

//   public myOrganization = new FormGroup({
//     organizationName: new FormControl(''),
//     website: new FormControl('', Validators.required),
//     email: new FormControl('', Validators.required),
//     phone: new FormControl('', Validators.required),
//     ein: new FormControl('', Validators.required),
//     category: new FormControl({value: '', disabled: true}, Validators.required),
//     address1: new FormControl('', Validators.required),
//     address2: new FormControl('', Validators.required),
//     city: new FormControl('', Validators.required),
//     state: new FormControl({value: '', disabled: true}, Validators.required),
//     country: new FormControl({value: '', disabled: true}, Validators.required),
//     zip: new FormControl('', Validators.required),
//     shortDescription: new FormControl('', Validators.required),
//     detailedDescription: new FormControl('', Validators.required)
//   });

//   constructor(public fb: FormBuilder, private organizationService: OrganizationService) { }

//   ngOnInit(): void {
//     this.organizationService.getOrganization(2).subscribe(
//       (res) => {
//         const organization = res.json();

//         this.myOrganization.setValue({organizationName: organization.name,
//           website: organization.website || '',
//           email: organization.email || '',
//           phone: organization.phone || '',
//           ein: organization.ein || '',
//           category: organization.category || '',
//           address1: organization.address1 || '',
//           address2: organization.address2 || '',
//           city: organization.city || '',
//           state: organization.state || '',
//           country: organization.country || '',
//           zip: organization.zip || '',
//           shortDescription: organization.briefDescription || '',
//           detailedDescription: organization.detailedDescription || ''
//         });
//       }, (err) => {
//         console.error('An error occurred', err); // for demo purposes only
//       }
//     );
//   }

//   updateOrganization(event) {
//     const organizationData = this.myOrganization.value;
//     console.log(event);
//     console.log(organizationData);
//   }

// }
