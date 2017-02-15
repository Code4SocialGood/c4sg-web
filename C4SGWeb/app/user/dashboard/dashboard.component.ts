import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {OrganizationService} from './organization/organization.service';

@Component({
  selector: 'my-projects',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor(public fb: FormBuilder, private organizationService: OrganizationService) {
  }

  public myAccount = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  public myProfile = new FormGroup({
    linkedin: new FormControl('', Validators.required),
    github: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    resume: new FormControl('', Validators.required),
    skills: new FormControl('', Validators.required)
  });

  public myOrganization = new FormGroup({
    organizationName: new FormControl(''),
    website: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    ein: new FormControl('', Validators.required),
    category: new FormControl({value: '', disabled: true}, Validators.required),
    address1: new FormControl('', Validators.required),
    address2: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl({value: '', disabled: true}, Validators.required),
    country: new FormControl({value: '', disabled: true}, Validators.required),
    zip: new FormControl('', Validators.required),
    shortDescription: new FormControl('', Validators.required),
    detailedDescription: new FormControl('', Validators.required)
  });

  updateAccount(event) {
    let accountData = this.myAccount.value;
    console.log(event);
    console.log(accountData);
  }

  updateProfile(event) {
    console.log(event);
  }

  updateOrganization(event) {
    let organizationData = this.myOrganization.value;
    console.log(event);
    console.log(organizationData);
  }

  ngOnInit(): void {
    this.organizationService.getOrganization(2).subscribe(
      (res) => {
        const organization = res.json();

        this.myOrganization.setValue({
          organizationName: organization.name,
          website: organization.website || '',
          email: organization.email || '',
          phone: organization.phone || '',
          ein: organization.ein || '',
          category: organization.category || '',
          address1: organization.address1 || '',
          address2: organization.address2 || '',
          city: organization.city || '',
          state: organization.state || '',
          country: organization.country || '',
          zip: organization.zip || '',
          shortDescription: organization.briefDescription || '',
          detailedDescription: organization.detailedDescription || ''
        });
      }, (err) => {
        console.error('An error occurred', err); // for demo purposes only
      }
    );
  }
}
