import {Component, OnInit, AfterViewChecked, EventEmitter} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser/';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {OrganizationService} from '../common/organization.service';
import {FormConstantsService} from '../../_services/form-constants.service';
import {ValidationService} from '../../_services/validation.service';
import {ImageUploaderService, ImageReaderResponse} from '../../_services/image-uploader.service';
import {AuthService} from '../../auth.service';

import {Organization} from '../common/organization';
import { MaterializeAction } from 'angular2-materialize';

declare const Materialize: any;

@Component({
  selector: 'my-edit-organization',
  templateUrl: 'organization-edit.component.html',
  styleUrls: ['organization-edit.component.scss']
})

export class OrganizationEditComponent implements OnInit, AfterViewChecked {
  public categories: { [key: string]: any };
  public countries: any[];
  // public states: String[];

  public organizationId;
  public organization: Organization;
  public organizationForm: FormGroup;
  currentUserId: String;

  // public loadedFile: any;
  public imageValid = true;
  private imageData: ImageReaderResponse;
  // private defaultImage = '../../../assets/default_image.png';

  public descMaxLength: number = this.validationService.descMaxLength;
  public descMaxLengthEntered = false;
  public descValueLength: number;
  public descFieldFocused = false;

  public globalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(public fb: FormBuilder,
              private organizationService: OrganizationService,
              private validationService: ValidationService,
              private auth: AuthService,
              private fc: FormConstantsService,
              // private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private router: Router,
              private imageUploader: ImageUploaderService) {
    this.urlValidator = this.urlValidator.bind(this);
  }

  ngOnInit(): void {

    this.getFormConstants();
    this.initForm();

    this.route.params.subscribe(params => {
      this.organizationId = +params['organizationId'];
      this.currentUserId = this.auth.getCurrentUserId();

      // OrgID = 0 means new organization.  The header should be updated with the new id when the org is created.
      if (this.organizationId === 0) {
        // this.organization.logo = this.defaultAvatar;
      }
      this.organizationService.getOrganization(this.organizationId)
        .subscribe(
          res => {
            this.organization = res;
            this.fillForm();
          }, error => console.log(error)
        );

      this.organizationService.retrieveLogo(this.organizationId)
        .subscribe(
          res => {
          }, error => console.log(error)
        );

      /*
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
       // this.organization.logo = logoText ? this.sanitizer.bypassSecurityTrustUrl(logoBase64) : this.defaultAvatar;
       this.fillForm();
       }, err => console.error('An error occurred', err)) // for demo purposes only
       .catch(err => console.error('An error occurred', err)); // for demo purposes only
       }*/
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
      'name': ['', []],
      'websiteUrl': ['', [this.urlValidator]],
      'ein': ['', []],
      'category': ['', []],
      'address1': ['', []],
      'address2': ['', []],
      'city': ['', []],
      'state': ['', []],
      'country': ['', []],
      'zip': ['', []],
      'description': ['', []]
    });

  }

  private fillForm(): void {
    this.organizationForm = this.fb.group({
      'name': [this.organization.name || '', [Validators.required]],
      'websiteUrl': [this.organization.websiteUrl || '', [this.urlValidator]],
      'ein': [this.organization.ein || '', []],
      'category': [this.organization.category || '', []],
      'address1': [this.organization.address1 || '', []],
      'address2': [this.organization.address2 || '', []],
      'city': [this.organization.city || '', []],
      'state': [this.organization.state || '', []],
      'country': [this.organization.country || '', []],
      'zip': [this.organization.zip || '', []],
      'description': [this.organization.description || '', [Validators.maxLength(this.descMaxLength)]]
    });
  }

  onSubmit(updatedData: any, event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.organizationId === 0) { // organization hasn't been created, create the organization
      this.createOrganization();
    } else { // Existing organization, update the organization
      this.updateOrganization();
    }
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
        if (this.imageData) {
          additionalCalls.push(
            this.organizationService
              .saveLogo(this.organization.id, this.imageData.formData)
          );
        }

        return Observable.forkJoin(additionalCalls);
      })
      .subscribe(res => {
        // After all calls are successfully made, go to the detail page
        this.router.navigate(['/organization/view/' + this.organization.id]);
      });
  }

  private updateOrganization(): void {
    const formData = this.organizationForm.value;
    formData.id = this.organization.id;
    this.organization.name = formData.name;
    this.organization.websiteUrl = formData.websiteUrl;
    this.organization.ein = formData.ein;
    this.organization.category = formData.category;
    this.organization.address1 = formData.address1;
    this.organization.address2 = formData.address2;
    this.organization.city = formData.city;
    this.organization.state = formData.state;
    this.organization.country = formData.country;
    this.organization.zip = formData.zip;
    this.organization.description = formData.description;

    this.organizationService
      .updateOrganization(this.organization)
      .subscribe(res => {
        Materialize.toast('Your organization is saved', 4000);
      });
  }

  // Validator website url
  urlValidator(control: FormControl): { [s: string]: boolean } {
    if (!control.value) {
      return null;
    }
    if (!this.validationService.urlValidRegEx.test(control.value)) {
      return {'urlIsNotValid': true};
    } else {
      return null;
    }
  }

  // Count chars in description field
  onCountCharDesc() {
    this.descValueLength = this.organizationForm.value.description.length;
    if (this.organizationForm.controls.description.invalid) {
      this.descMaxLengthEntered = true;
    } else {
      this.descMaxLengthEntered = false;
    }
  }

  onFocusDesc() {
    this.descFieldFocused = true;
    this.onCountCharDesc();
  }

  onBlurDesc() {
    if (!this.organizationForm.controls.description.invalid) {
      this.descFieldFocused = false;
    }
  }

  openModal(user) {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  onUploadImage(fileInput: any): void {
    // Make sure there are files before doing the upload
    if (fileInput.target.files && fileInput.target.files.length) {

      // Make sure the file is under 1MB
      if (fileInput.target.files[0].size < 1048576) {
        this.imageValid = true;
        if (this.organizationId === 0) {
          this.readImage(fileInput);
        } else {
          this.saveImage(fileInput);
        }
      } else {
        this.imageValid = false;
      }
    }
  }
  /*
  onUploadImage(fileInput: any): void {
    this.imageUploader.uploadImage(fileInput,
       this.user.id,
       this.userService.saveAvatar.bind(this.userService))
       .subscribe(res => {
         this.avatar = res.url;
       },
        err => { console.error(err, 'An error occurred'); } );
  } */

  private readImage(fileInput: any): void {
    this.imageUploader
      .readImage(fileInput)
      .subscribe(res => {
        this.organization.logoUrl = res.base64Image;
        this.imageData = res;
      });
  }

  private saveImage(fileInput: any): void {
    this.imageUploader.uploadImage(fileInput,
      this.organizationId,
      this.organizationService.saveLogo.bind(this.organizationService))
      .subscribe(res => {
          if (res.url) {
            this.organization.logoUrl = res.url;
          }
        },
        err => {
          console.error(err, 'An error occurred');
        });
  }
}
