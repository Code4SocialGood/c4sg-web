import { Component, ElementRef, OnInit, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser/';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../common/user';
import { JobTitle } from '../../job-title';
import { UserService } from '../common/user.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { AuthService } from '../../auth.service';
import { SkillService } from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';
import { ExtFileHandlerService } from '../../_services/extfilehandler.service';
import { ValidationService } from '../../_services/validation.service';

declare var Materialize: any;

@Component({
  selector: 'my-edit-user',
  templateUrl: 'user-edit.component.html',
  styleUrls: ['user-edit.component.scss']
})

export class UserEditComponent implements OnInit, AfterViewChecked {

  currentUserId: String;
  public countries: any[];

  public userId;
  public user: User;
  public jobTitlesArray: JobTitle[] = [];
  public loadedFile: any;

  public userSkillsArray: string[] = [];
  public skillsArray: string[] = [];
  public skill = '';
  public skillCounter = 0;

  public inputValue = '';
  public avatar: any = '';

  public displayPhone = false;
  public isVolunteer = false;
  public isOrganization = false;
  public checkPublish = false;
  public checkNotify = false;
  public isSkillExists = false;
  public isSkillLimit = false;

  public introMaxLength: number = this.validationService.introMaxLength;
  public introMaxLengthEntered = false;
  public introValueLength: number;
  public introFieldFocused = false;

  public descMaxLength = 255;

  public userForm: FormGroup;
  public formPlaceholder: { [key: string]: any } = {};
  public globalActions = new EventEmitter<string|MaterializeAction>();

  constructor(
    public fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    public constantsService: FormConstantsService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService,
    private extfilehandler: ExtFileHandlerService,
    private validationService: ValidationService
  ) { }

  ngOnInit(): void {

    this.currentUserId = this.auth.getCurrentUserId();
    this.getFormConstants();
    this.initForm();

    if (this.auth.isOrganization()) {
      this.isOrganization = true;
    } else if (this.auth.isVolunteer()) {
      this.isVolunteer = true;
    }

    this.skillService.getSkills()
      .subscribe(
        res => {
          res.map((obj) => {
            this.skillsArray.push(obj.skillName);
          });
        }, error => console.log(error)
      );

    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.userService.getAllJobTitles()
        .subscribe(
        res => {
          this.jobTitlesArray = res;
        }, error => console.log(error)
        );
      // Populate user
      this.userService.getUser(this.userId)
        .subscribe(
          res => {
            this.user = res;
            this.avatar = this.user.avatarUrl;
            this.fillForm();

            if (this.user.publishFlag === 'Y') {
              this.checkPublish = true;
            }

            if (this.user.notifyFlag === 'Y' ) {
              this.checkNotify = true;
            }
          }, error => console.log(error)
        );

      // Populate skills list
      this.skillService.getSkillsForUser(this.userId)
        .subscribe(
          res => {
            this.userSkillsArray = res;
          }, error => console.log(error)
        );
    });
  }

  private getFormConstants(): void {
    this.countries = this.constantsService.getCountries();
  }

  private initForm(): void {

    this.userForm = this.fb.group({
      'email': ['', []],
      'jobTitleId': ['', []],
      'userName': ['', []],
      'firstName': ['', []],
      'lastName': ['', []],
      'state': ['', []],
      'country': ['', []],
      'phone': ['', []],
      'title': ['', []],
      'introduction': ['', []],
      'linkedinUrl': ['', []],
      'personalUrl': ['', []],
      'githubUrl': ['', []],
      'chatUsername': ['', []],
      'publishFlag': ['', []],
      'notifyFlag': ['', []]
    });
  }

  private fillForm(): void {

    this.userForm = this.fb.group({
      'email': [this.user.email || '', [Validators.required]],
      'jobTitleId': [this.user.jobTitleId || '', []],
      'userName': [this.user.userName || '', [Validators.required]],
      'firstName': [this.user.firstName || '', [Validators.required]],
      'lastName': [this.user.lastName || '', [Validators.required]],
      'state': [this.user.state || '', []],
      'country': [this.user.country || '', [Validators.required]],
      'phone': [this.user.phone || '', []],
      'title': [this.user.title || '', [Validators.required]],
      'introduction': [this.user.introduction || '', [Validators.compose([Validators.maxLength(1000)])]],
      'linkedinUrl': [this.user.linkedinUrl || '', []],
      'personalUrl': [this.user.personalUrl || '', []],
      'githubUrl': [this.user.githubUrl || '', []],
      'chatUsername': [this.user.chatUsername || '', []],
      'publishFlag': [this.user.publishFlag || '', []],
      'notifyFlag': [this.user.notifyFlag || '', []]
    });
  }

  onSubmit(updatedData: any, event): void {

    event.preventDefault();
    event.stopPropagation();

    this.user.userName = this.userForm.value.userName;
    this.user.firstName = this.userForm.value.firstName;
    this.user.lastName = this.userForm.value.lastName;
    this.user.state = this.userForm.value.state;
    this.user.country = this.userForm.value.country;
    this.user.phone = this.userForm.value.phone;
    this.user.title = this.userForm.value.title;
    this.user.introduction = this.userForm.value.introduction;
    this.user.linkedinUrl = this.userForm.value.linkedinUrl;
    this.user.personalUrl = this.userForm.value.personalUrl;
    this.user.githubUrl = this.userForm.value.githubUrl;
    this.user.chatUsername = this.userForm.value.chatUsername;
    this.user.jobTitleId = this.userForm.value.jobTitleId;

    if (this.userForm.value.publishFlag === true || this.userForm.value.publishFlag === 'Y' ) {
      this.user.publishFlag = 'Y';
    } else {
      this.user.publishFlag = 'N';
    }

    if (this.userForm.value.notifyFlag === true || this.userForm.value.notifyFlag === 'Y' ) {
      this.user.notifyFlag = 'Y';
    } else {
      this.user.notifyFlag = 'N';
    }

    this.userService.update(this.user)
      .subscribe(() => {
        this.globalActions.emit('toast');
        this.router.navigate(['/user/view', this.user.id]);
      },
        err => { console.error(err, 'An error occurred'); }
      );

    // Update skills for user
    this.skillService.updateUserSkills(this.userSkillsArray, this.user.id)
      .subscribe(
        res => {
        },
        err => { console.error(err, 'An error occurred'); }
      );
  }

  onDeleteSkill(skillToDelete) {
    this.userSkillsArray = this.userSkillsArray.filter((projectSkill) => {
      return projectSkill !== skillToDelete;
    });
  }

  onAddListedSkill(optionValue) {
    this.skillCounter = this.userSkillsArray.length;
    console.log(optionValue.target.value);
    this.checkSkillList (optionValue.target.value);
    if (!this.isSkillExists && !this.isSkillLimit) {
      this.userSkillsArray.push(optionValue.target.value);
    }
  }

  onAddOwnSkill(inputSkill) {
    this.skillCounter = this.userSkillsArray.length;
    console.log(inputSkill.value);
    if (inputSkill.value && inputSkill.value.trim()) {
      this.checkSkillList (inputSkill.value);
      if (!this.isSkillExists && !this.isSkillLimit) {
        this.userSkillsArray.push(inputSkill.value);
        this.inputValue = '';
      }
    }
  }

  checkSkillList(selectedSkill) {
    this.isSkillExists = false;
    this.isSkillLimit = false;
    this.skillCounter = this.skillCounter + 1;
    if ( this.skillCounter > 10 ) {
      this.isSkillLimit = true;
      this.globalActions.emit({action: 'toast', params: ['Skill list exceeds limit 10', 4000]});
    }
    if (!this.isSkillLimit) {
      for ( this.skill of this.userSkillsArray ) {
        if (selectedSkill === this.skill) {
          this.isSkillExists = true;
          this.globalActions.emit({action: 'toast', params: ['Selected skill already in the list', 4000]});
        }
      }
    }
  }

  // Count chars in introduction field
  onCountCharIntro() {
    this.introValueLength = this.userForm.value.introduction.length;
    if (this.userForm.controls.introduction.invalid) {
      this.introMaxLengthEntered = true;
    } else {
      this.introMaxLengthEntered = false;
    }
  }

  onFocusIntro() {
    this.introFieldFocused = true;
    this.onCountCharIntro();
  }

  onBlurIntro() {
    if (!this.userForm.controls.introduction.invalid) {
      this.introFieldFocused = false;
    }
  }

  // Orchestrates the avatar image upload sequence of steps
  onUploadAvatar(fileInput: any): void {
    // Function call to upload the file to AWS S3
    const upload$ = this.extfilehandler.uploadFile(fileInput, this.user.id, 'image');
    // Calls the function to save the avatar image url to the user's row
    upload$.switchMap( (res) => this.userService.saveAvatarImg(this.user.id, res),
      (outerValue, innerValue, outerIndex, innerIndex) => ({outerValue, innerValue, outerIndex, innerIndex}))
      .subscribe(res => {
        if (res.innerValue.text() === '') {
            this.avatar = res.outerValue;
            this.user.avatarUrl = this.avatar;
            console.log('Avatar successfully uploaded!');
        } else {
          console.error('Saving user avatar: Not expecting a response body');
        }}, (e) => {
          console.error('Avatar not saved. Not expecting a response body');
        });
  }

  // Does not seem to be needed - also prevents labels from moving when clicked
  ngAfterViewChecked(): void {
    // Work around for bug in Materialize library, form labels overlap prefilled inputs
    // See https://github.com/InfomediaLtd/angular2-materialize/issues/106
    // if (Materialize && Materialize.updateTextFields) {
    // Materialize.updateTextFields();
    // }
  }
}
