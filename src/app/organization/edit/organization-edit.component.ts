import {Component, OnInit, AfterViewChecked, EventEmitter} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser/';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {OrganizationService} from '../common/organization.service';
import {FormConstantsService} from '../../_services/form-constants.service';
import {ValidationService} from '../../_services/validation.service';
import {AuthService} from '../../auth.service';

import {Organization} from '../common/organization';
import {MaterializeAction} from 'angular2-materialize';
import {ExtFileHandlerService} from '../../_services/extfilehandler.service';

declare const Materialize: any;

@Component({
  selector: 'my-edit-organization',
  templateUrl: 'organization-edit.component.html',
  styleUrls: ['organization-edit.component.scss']
})

export class OrganizationEditComponent implements OnInit, AfterViewChecked {

  public currentUserId: String;
  public countries: any[];
  public categories: { [key: string]: any };

  public organizationId;
  public organization: Organization;
  public logoUrl: any = '';

  public descMaxLength: number = this.validationService.descMaxLength;
  public descMaxLengthEntered = false;
  public descValueLength: number;
  public descFieldFocused = false;

  public isNew = false;
  public isPending = false;

  public organizationForm: FormGroup;
  public globalActions = new EventEmitter<string|MaterializeAction>();

  constructor(public fb: FormBuilder,
              private organizationService: OrganizationService,
              private validationService: ValidationService,
              private auth: AuthService,
              public constantsService: FormConstantsService,
              private route: ActivatedRoute,
              private router: Router,
              private extfilehandler: ExtFileHandlerService
              ) {
    // this.urlValidator = this.urlValidator.bind(this); // No URL validation
  }

  ngOnInit(): void {

    this.currentUserId = this.auth.getCurrentUserId();
    this.getFormConstants();
    this.initForm();

    this.route.params.subscribe(params => {
      this.organizationId = +params['organizationId'];

      this.organizationService.getOrganization(this.organizationId)
        .subscribe(
          res => {
            this.organization = res;
            this.logoUrl = this.organization.logoUrl;
            if (this.organization.status === 'N') {
              this.isNew = true;
            } else if (this.organization.status === 'P') {
              this.isPending = true;
            }

            this.fillForm();
          }, error => console.log(error)
        );
    });
  }

  private getFormConstants(): void {
    this.categories = this.constantsService.getCategories();
    this.countries = this.constantsService.getCountries();
  }

  private initForm(): void {
    this.organizationForm = this.fb.group({
      'name': ['', []],
      'websiteUrl': ['', []],
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
      'websiteUrl': [this.organization.websiteUrl || '', []], // []]
      'ein': [this.organization.ein || '', []],
      'category': [this.organization.category || '', [Validators.required]],
      'address1': [this.organization.address1 || '', []],
      'address2': [this.organization.address2 || '', []],
      'city': [this.organization.city || '', []],
      'state': [this.organization.state || '', []],
      'country': [this.organization.country || '', [Validators.required]],
      'zip': [this.organization.zip || '', []],
      'description': [this.organization.description || '', [Validators.maxLength(this.descMaxLength)]]
    });
  }

  onSubmit(updatedData: any, event): void {
    event.preventDefault();
    event.stopPropagation();

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

    /* We skip organization approval process during initial release, may add it later if we see a need
    // For new organization, set status from 'N' (New) to 'P' (Ppending)
    if (this.organization.status === 'N') {
      this.organization.status = 'P';
      this.isNew = false;
      this.isPending = true;
    }
    */

    // For new organization, set status from 'N' (New) to 'A' (Active)
    if (this.organization.status === 'N') {
      this.organization.status = 'A';
      this.isNew = false;
      this.isPending = false;
    }

    this.organizationService
      .updateOrganization(this.organization)
      .subscribe(res => {
        Materialize.toast('Your organization is saved', 4000);
         // For active organization, forward to organization view page
        if (this.organization.status === 'A') {
          this.router.navigate(['/organization/view/' + this.organization.id]);
        }
      });

  }

  // Orchestrates the organization logo upload sequence of steps
  onUploadLogo(fileInput: any): void {
    if (fileInput.target.files[0].size < this.constantsService.maxFileSize) {
    // Function call to upload the file to AWS S3
    const upload$ = this.extfilehandler.uploadFile(fileInput, this.organization.id, 'image');

    // Calls the function to save the logo image url to the organization's row
    upload$.switchMap( (res) => this.organizationService.saveLogoImg(this.organization.id, res),
      (outerValue, innerValue, outerIndex, innerIndex) => ({outerValue, innerValue, outerIndex, innerIndex}))
      .subscribe(res => {
        if (res.innerValue.text() === '') {
            this.logoUrl = res.outerValue;
            this.organization.logoUrl = this.logoUrl;
            console.log('Logo successfully uploaded!');
        } else {
          console.error('Saving organization logo: Not expecting a response body');
        }}, (e) => {
          console.error('Logo not saved. Not expecting a response body');
        });
    } else {
      Materialize.toast('Maximum image size allowed is 1MB', 4000);
    }
  }

  deleteImage() {
    this.logoUrl = '';
    this.organizationService.saveLogoImg(this.organizationId, this.logoUrl)
      .subscribe(res => {
          this.organization.logoUrl = this.logoUrl;
        },
        (error) => {
          console.log('Image not deleted successfully');
        }
      );
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

  ngAfterViewChecked(): void {
    // Activate the labels so that the text does not overlap
    document.getElementById('name-label').classList.add('active');
    document.getElementById('address1-label').classList.add('active');
    document.getElementById('city-label').classList.add('active');
    document.getElementById('website-label').classList.add('active');
    document.getElementById('ein-label').classList.add('active');
    document.getElementById('address2-label').classList.add('active');
    document.getElementById('state-label').classList.add('active');
    document.getElementById('zip-label').classList.add('active');
    document.getElementById('desc-label').classList.add('active');

    if (Materialize && Materialize.updateTextFields) {
      Materialize.updateTextFields();
    }
  }

  /*
  onDelete(): void {
    this.organizationService
      .delete(this.organization.id)
      .subscribe(
        response => {
          this.router.navigate(['/organization/list/organizations']);
          Materialize.toast('The organization is deleted', 4000);
        },
        error => {
          console.log(error);
          Materialize.toast('Error deleting the organiation', 4000);
        }
      );
  } */

  /* Obsolete - No Validation on website url
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
  */
}
