import { Component, ElementRef, OnInit, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser/';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OrganizationService } from '../common/organization.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { ImageUploaderService, ImageReaderResponse } from '../../_services/image-uploader.service';
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
  private logoData: ImageReaderResponse;
  private defaultAvatar = '../../../assets/default_image.png';

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
      this.currentUserId = this.auth.getCurrentUserId();

      // OrgID = 0 means new organization.  The header should be updated with the new id when the org is created.
      if (this.organizationId === 0) {
        this.organization.logo = this.defaultAvatar;
      }

      if (this.organizationId !== 0) { // organization has been created already
        this.organizationService.getOrganization(this.organizationId).toPromise()
          .then(res => {
            this.organization = res;

            // NOTE: Logo retrieval is a temporary fix until form can be properly submitted with logo
            return this.organizationService.retrieveLogo(this.organizationId).toPromise();
          })
          .then(res => {
            const logoText = res.text();
            const logoBase64 = `data:image/png;base64, ${logoText}`;

            this.organization.logo = logoText ? this.sanitizer.bypassSecurityTrustUrl(logoBase64) : this.defaultAvatar;
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
      'websiteUrl': [this.organization.websiteUrl || '', [Validators.pattern(this.urlValidRegEx)]],
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
        if (this.organizationId === 0) {
          this.readLogo(fileInput);
        } else {
          this.saveLogo(fileInput);
        }
      } else {
        this.logoValid = false;
      }
    }
  }

  onSubmit(): void {
    if (this.organizationId === 0) { // organization hasn't been created by the nonprofit user
      // New organization, create the organization
      this.createOrganization();
    } else {
      // Existing organization, update the organization
      this.updateOrganization();
    }
  }

  // initialize organization with blank values
  private initOrganization(): any {
    return {
      'logo': '',
      'name': '',
      'websiteUrl': '',
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

  private createOrganization(): void {
    this.organizationService
      .createOrganization(this.organizationForm.value)
      .flatMap(res => {
        this.organization = res.organization;

        // additionalCalls that need to be made AFTER the org is saved
        // This includes the call to link the user and the organization
        const additionalCalls = [
          this.organizationService
            .linkUserOrganization(this.currentUserId, this.organization.id)
        ];

        // Only need to save the logo if a logo was uploaded
        if (this.logoData) {
          additionalCalls.push(
            this.organizationService
              .saveLogo(this.organization.id, this.logoData.formData)
          );
        }

        return Observable.forkJoin(additionalCalls);
      })
      .subscribe(res => {
        // After all calls are successfully made, go to the detail page
        this.router.navigate(['/nonprofit/view/' + this.organization.id]);
      });
  }

  private readLogo(fileInput: any): void {
    this.imageUploader
      .readImage(fileInput)
      .subscribe(res => {
        this.organization.logo = res.base64Image;
        this.logoData = res;
      });
  }

  private saveLogo(fileInput: any): void {
    this.imageUploader.uploadImage(fileInput,
      this.organizationId,
      this.organizationService.saveLogo.bind(this.organizationService))
      .subscribe(res => {
        if (res.url) {
          this.organization.logo = res.url;
        }
      },
      err => { console.error(err, 'An error occurred'); });
  }

  private updateOrganization(): void {
    const formData = this.organizationForm.value;
    formData.id = this.organization.id;

    this.organizationService
      .updateOrganization(formData)
      .subscribe(res => {
        Materialize.toast('Your organization is saved', 4000);
      });
  }
}
