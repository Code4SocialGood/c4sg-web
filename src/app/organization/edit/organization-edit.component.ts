import { Component, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser/';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganizationService } from '../common/organization.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { ImageUploaderService } from '../../_services/image-uploader.service';
import { AuthService } from '../../auth.service';

import { Organization } from '../common/organization';

declare var Materialize: any;

@Component({
  selector: 'my-edit-organization',
  templateUrl: 'organization-edit.component.html',
  styleUrls: ['organization-edit.component.css']
})

export class OrganizationEditComponent implements OnInit, AfterViewChecked {
  public categories: { [key: string]: any };
  public countries: any[];
  public organization = this.initOrganization();
  public organizationForm: FormGroup;
  public formPlaceholder: { [key: string]: any } = {};
  public descMaxLength = 255;
  public states: String[];
  public loadedFile: any;
  public organizationId;
  public logoValid = true;

  currentUserId: String;
  authSvc: AuthService;

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
    private auth: AuthService,
    private fc: FormConstantsService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private imageUploader: ImageUploaderService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.getFormConstants();
      this.organization.logo = '';
      this.initForm();

      this.organizationId = +params['organizationId'];

      // OrgID = 0 is from menu item when user logs in. It indicates no org has been created.
      // Check whether user created the org after he logs in. Note that orgId stays at 0 in menu item.
      if (this.organizationId === 0) {
        this.currentUserId = this.auth.getCurrentUserId();
        this.organizationService.getUserOrganization(+this.currentUserId).subscribe(
          res => {
            this.organization = res[0];
            if (this.organization !== undefined) {
              this.organizationId = this.organization.id.toString();
              localStorage.setItem('userOrganizationId', this.organization.id.toString());
            }
          },
          error => console.log(error)
        );
      }

      if (this.organizationId !== 0) { // organization has been created already
        this.organizationService.getOrganization(this.organizationId).toPromise()
          .then(res => {
            this.organization = res;

            // NOTE: Logo retrieval is a temporary fix until form can be properly submitted with logo
            return this.organizationService.retrieveLogo(this.organizationId).toPromise();
          })
          .then(res => {
            const defaultAvatar = '../../../assets/default_avatar.png';
            const logoText = res.text();
            this.organization.logo = logoText ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64, ${logoText}`) : defaultAvatar;
            this.initForm();
          }, err => console.error('An error occurred', err)) // for demo purposes only
          .catch(err => console.error('An error occurred', err)); // for demo purposes only
      }
    });
  }

  ngAfterViewChecked(): void {
    // Work around for bug in Materialize library, form labels overlap prefilled inputs
    // See https://github.com/InfomediaLtd/angular2-materialize/issues/106
    if (Materialize && Materialize.updateTextFields) {
      Materialize.updateTextFields();
    }
  }

  private getFormConstants(): void {
    this.categories = this.fc.getCategories();
    this.countries = this.fc.getCountries();
  }

  private initForm(): void {
    this.organizationForm = this.fb.group({
      'name': [this.organization.name || '', [Validators.required]],
      'websiteURL': [this.organization.websiteURL || '', [Validators.pattern(this.urlValidRegEx)]],
      'contactEmail': [this.organization.contactEmail || '', [Validators.pattern(this.emailValidRegEx)]],
      'contactName': [this.organization.contactName || '', []],
      'contactPhone': [this.organization.contactPhone || '', []],
      'contactTitle': [this.organization.contactTitle || '', []],
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

  onUploadLogo(fileInput: any): void {
    // Make sure there are files before doing the upload
    if (fileInput.target.files && fileInput.target.files.length) {
      // Make sure the file is under 1MB
      if (fileInput.target.files[0].size < 1048576) {
        this.logoValid = true;
        this.imageUploader.uploadImage(fileInput,
          this.organizationId,
          this.organizationService.saveLogo.bind(this.organizationService))
          .subscribe(res => {
            if (res.url) {
              this.organization.logo = res.url;
            }
          },
          err => { console.error(err, 'An error occurred'); });
      } else {
        this.logoValid = false;
      }
    }
  }

  onSubmit(): void {
    if (this.organizationId === 0) { // organization hasn't been created by the nonprofit user
      // add new org ... call OrganizationService.???
    } else {
      // save ... call OrganizationService.???
    }
  }

  // initialize organization with blank values
  private initOrganization(): any {
    return {
      'logo': '',
      'name': '',
      'websiteURL': '',
      'contactEmail': '',
      'contactName': '',
      'contactPhone': '',
      'contactTitle': '',
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

}
