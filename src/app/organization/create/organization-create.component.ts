import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrganizationService } from '../common/organization.service';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-create-organization',
  templateUrl: 'organization-create.component.html',
  styleUrls: ['organization-create.component.css']
})

export class OrganizationCreateComponent implements OnInit {
  public categories: String[];
  public countries: any[];
  public organization = this.initOrganization();
  public organizationForm: FormGroup;
  public formPlaceholder: {[key: string]: any} = {};
  public descMaxLength = 255;

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
              private route: ActivatedRoute,
              private router: Router,
              private fc: FormConstantsService,
              private el: ElementRef) { }

  ngOnInit(): void {

    this.categories = this.fc.getCategories();
    this.countries = this.fc.getCountries();

    this.organizationForm = this.fb.group({
      'photo': [this.organization.logo, []],
      'name': [this.organization.name || '', [Validators.required]],
      'website': [this.organization.website || '', [Validators.pattern(this.urlValidRegEx)]],
      'email': [this.organization.email || '', [Validators.pattern(this.emailValidRegEx)]],
      'phone': [this.organization.phone || '', []],
      'ein': [this.organization.ein || '', [Validators.pattern(this.einValidRegEx)]],
      'category': [this.organization.category || '', []],
      'address1': [this.organization.address1 || '', []],
      'address2': [this.organization.address2 || '', []],
      'city': [this.organization.city || '', []],
      'state': [this.organization.state || '', []],
      'country': [this.organization.country || '', []],
      'zip': [this.organization.zip || '', [Validators.pattern(this.zipValidRegEx)]],
      'description': [this.organization.description || '', [Validators.maxLength(this.descMaxLength)]
      ],
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
      'description': ''
    };
  }

  onSubmit(): void {
    this.organizationService
      .getOrganizations()
      .toPromise()
      .then(res => {
        const results: Array<any> = res;
        const body = this.organizationForm.value;
        return this.organizationService
                   .createOrganization(body)
                   .toPromise();
      })
      .then(
        res => {
          this.router.navigate(['/nonprofit/edit/3']);
        },
        err => this.handleError)
      .catch(this.handleError);
  }

  private handleError(err): void {
    console.error('An error occurred', err);
  }
}
