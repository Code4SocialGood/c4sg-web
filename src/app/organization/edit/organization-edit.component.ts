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
import { MaterializeAction } from 'angular2-materialize';
import { ExtFileHandlerService } from '../../_services/extfilehandler.service';

declare const Materialize: any;

@Component({
  selector: 'my-edit-organization',
  templateUrl: 'organization-edit.component.html',
  styleUrls: ['organization-edit.component.scss']
})

export class OrganizationEditComponent implements OnInit, AfterViewChecked {
  public categories: { [key: string]: any };
  public countries: any[];

  public organizationId;
  public organization: Organization;
  public organizationForm: FormGroup;
  currentUserId: String;

  public descMaxLength: number = this.validationService.descMaxLength;
  public descMaxLengthEntered = false;
  public descValueLength: number;
  public descFieldFocused = false;

  public globalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();
  public logoUrl: any = '';

  constructor(public fb: FormBuilder,
              private organizationService: OrganizationService,
              private validationService: ValidationService,
              private auth: AuthService,
              public constantsService: FormConstantsService,
              private route: ActivatedRoute,
              private router: Router,
              private extfilehandler: ExtFileHandlerService
              ) {
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
      }

      this.organizationService.getOrganization(this.organizationId)
        .subscribe(
          res => {
            this.organization = res;
            this.logoUrl = this.organization.logoUrl;
            this.fillForm();
          }, error => console.log(error)
        );

      this.organizationService.retrieveLogo(this.organizationId)
        .subscribe(
          res => {
          }, error => console.log(error)
        );
    });
  }

  ngAfterViewChecked(): void {
    // Work around for bug in Materialize library, form labels overlap prefilled inputs
    // See https://github.com/InfomediaLtd/angular2-materialize/issues/106
    if (Materialize && Materialize.updateTextFields) {
      // *** Does not seem to be needed - also prevents labels from moving when clicked ***
      // Materialize.updateTextFields();
    }
  }

  private getFormConstants(): void {
    this.categories = this.constantsService.getCategories();
    this.countries = this.constantsService.getCountries();
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
    if (this.organizationId === 0) { // Create the organization
      this.createOrganization();
    } else { // Update the organization
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

  /*
    Orchestrates the organization logo upload sequence of steps
  */
  onUploadLogo(fileInput: any): void {
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
  }
}
