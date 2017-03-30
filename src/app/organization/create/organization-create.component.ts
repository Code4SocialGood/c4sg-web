import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrganizationService } from '../common/organization.service';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'create-organization',
  templateUrl: 'organization-create.component.html',
  styleUrls: ['organization-create.component.css']
})

export class OrganizationCreateComponent implements OnInit {
  public categories: String[];
  public countries: any[];
  private editOrg = false; // TODO: Set editOrg on init. Need to know edit/add when saving changes
  public organization = this.initOrganization();
  public organizationForm: FormGroup;
  public formPlaceholder = {};
  public shortDescMaxLength = 255;
  public states: String[];

  // RegEx validators
  private einValidRegEx = /^[1-9]\d?-\d{7}$/;
  // tslint:disable-next-line:max-line-length
  private emailValidRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public httpValidRegEx = /^https?:\/\//;
  // tslint:disable-next-line:max-line-length
  private urlValidRegEx = /^(https?):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+([a-zA-Z]{2,9})(:\d{1,4})?([-\w\/#~:.?+=&%@~]*)$/;
  public zipValidRegEx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

  constructor(public fb: FormBuilder,
              private organizationService: OrganizationService,
              private fc: FormConstantsService,
              private el: ElementRef) { }

  ngOnInit(): void {
    this.getFormConstants();

    if (this.editOrg) { // edit existing org
      this.initForm();
      // TODO: Pass variable to getOrganization() instead of hard-coded value
      this.organizationService.getOrganization(2)
          .subscribe(
            res => {
              this.organization = res;
              this.editOrg = true;
              this.initForm();
            }, this.handleError
          );
    } else { // add new org
      this.editOrg = null;
      this.initForm();
    }
  }

  private getFormConstants(): void {
    this.categories = this.fc.getCategories();
    this.countries = this.fc.getCountries();
    this.states = this.fc.getStates();
  }

  private initForm(): void {
    this.organizationForm = this.fb.group({
      'photo': [this.organization.logo, []],
      'name': [this.organization.name || '', [Validators.required]],
      'website': [this.organization.website || '', [Validators.pattern(this.urlValidRegEx)]],
      'email': [this.organization.email || '', [Validators.required, Validators.pattern(this.emailValidRegEx)]],
      'phone': [this.organization.phone || '', [Validators.required]],
      'ein': [this.organization.ein || '', [Validators.pattern(this.einValidRegEx)]],
      'category': [this.organization.category || '', [Validators.required]],
      'address1': [this.organization.address1 || '', [Validators.required]],
      'address2': [this.organization.address2 || '', []],
      'city': [this.organization.city || '', []],
      'state': [this.organization.state || '', []],
      'country': [this.organization.country || '', [Validators.required]],
      'zip': [this.organization.zip || '', [Validators.required, Validators.pattern(this.zipValidRegEx)]],
      'shortDescription': [this.organization.briefDescription || '',
        [Validators.required, Validators.maxLength(this.shortDescMaxLength)]
      ],
      'longDescription': [this.organization.detailedDescription || '', [Validators.required]],
    });
  }

  // initialize organization with blank values
  private initOrganization(): any {
    return {
      'logo': '',
      'name': '',
      'website': '',
      'email': '',
      'phone': '',
      'ein': '',
      'category': '',
      'address1': '',
      'address2': '',
      'city': '',
      'state': '',
      'country': '',
      'zip': '',
      'briefDescription': '',
      'detailedDescription': ''
    };
  }

  onSubmit(): void {
    if (this.editOrg) {
    } else {
      this.organizationService
          .getOrganizations()
          .toPromise()
          .then(res => {

            // TODO: Change this according to back-end feature changes
            const results: Array<any> = res;
            const body = this.organizationForm.value;
            body.id = results[results.length - 1].id + 1;
            body.description = body.shortDescription;
            body.status = 'ACTIVE';

            return this.organizationService
                       .createOrganization(body)
                       .toPromise()
          })
          .then(
            res => console.log('Successfully created organization'),
            err => this.handleError)
          .catch(this.handleError)
    }
  }

  private handleError(err): void {
    console.error('An error occurred', err)
  }
}
