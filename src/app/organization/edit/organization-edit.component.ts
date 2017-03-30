import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser/';
import { ActivatedRoute } from '@angular/router';

import { OrganizationService } from '../common/organization.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { ImageUploaderService } from '../../_services/image-uploader.service';

@Component({
  selector: 'edit-organization',
  templateUrl: 'organization-edit.component.html',
  styleUrls: ['organization-edit.component.css']
})

export class OrganizationEditComponent implements OnInit {
  public categories: String[];
  public countries: any[];
  private editOrg = true; // TODO: Set editOrg on init. Need to know edit/add when saving changes
  public organization = this.initOrganization();
  public organizationForm: FormGroup;
  public formPlaceholder = {};
  public shortDescMaxLength = 255;
  public states: String[];
  public loadedFile: any;
  public organizationId = 2; //TODO: set organizationId on init based on user data

  // RegEx validators
  private einValidRegEx = /^[1-9]\d?-\d{7}$/;
  // tslint:disable-next-line:max-line-length
  private emailValidRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public httpValidRegEx = /^https?:\/\//;
  // tslint:disable-next-line:max-line-length
  private urlValidRegEx = /^(https?):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+([a-zA-Z]{2,9})(:\d{1,4})?([-\w\/#~:.?+=&%@~]*)$/;
  public zipValidRegEx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

  constructor(
    public fb: FormBuilder,
    private organizationService: OrganizationService,
    private fc: FormConstantsService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private imageUploader: ImageUploaderService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.organizationId = +params['organizationId'];
      this.getFormConstants();

      if (this.editOrg) { // edit existing org
        this.organization.logo = '';
        this.initForm();
        this.organizationService.getOrganization(this.organizationId).toPromise()
          .then(res => {
            this.editOrg = true;
            this.organization = res;
            // NOTE: Logo retrieval is a temporary fix until form can be properly submitted with logo
            return this.organizationService.retrieveLogo(this.organizationId).toPromise()
          })
          .then(res => {
            this.organization.logo = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64, '+ res.text());
            this.initForm();
          }, err => console.error('An error occurred', err)) // for demo purposes only
          .catch(err => console.error('An error occurred', err)); // for demo purposes only
      } else { // add new org
        this.editOrg = null;
        this.initForm();
      }

    })
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

  onUploadLogo(fileInput: any): void {
    this.imageUploader.uploadImage(fileInput,
       this.organizationId,
       this.organizationService.saveLogo.bind(this.organizationService))
       .subscribe(res => {this.organization.logo = res.url},
                  err => {console.error(err, 'An error occurred')} )
  }
  onSubmit(): void {
    // TODO: complete submission logic...
    if (this.editOrg) {
      // save ... call OrganizationService.???
    } else {
      // add new org ... call OrganizationService.???
    }
  }
}
