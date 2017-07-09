import { Component, ElementRef, OnInit, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser/';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../common/user';
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

  public countries: any[];
  public user: User;
  public userForm: FormGroup;
  public formPlaceholder: { [key: string]: any } = {};
  public descMaxLength = 255;
  public states: String[];
  public loadedFile: any;
  public userId;
  public displayPhone = false;
  public displayProfile = false;
  public checkPublish = false;
  public checkNotify = false;
  public editFlag = false;
  public userSkillsArray: string[] = [];
  public skillsArray: string[] = [];
  public inputValue = '';
  public globalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();
  public avatar: any = '';
  public skillsOption = [{value: '1', name: 'CSS'},
    {value: '2', name: 'option2'},
    {value: '3', name: 'python'}];
  currentUserId: String;
  public isSkillExists = false;
  public isSkillLimit = false;
  public skill = '';
  public skillCounter = 0;

  public introMaxLength: number = this.validationService.introMaxLength;
  public introMaxLengthEntered = false;
  public introValueLength: number;
  public introFieldFocused = false;

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

    this.getFormConstants();
    this.initForm();

    this.route.params.subscribe(params => {
      // this.user.avatar = '';
      this.userId = +params['userId'];
      this.currentUserId = this.auth.getCurrentUserId();

      this.userService.getUser(this.userId)
        .subscribe(
          res => {
          this.user = res;
          this.avatar = this.user.avatarUrl;
          this.checkFlag();
          this.fillForm();
          this.checkRole(this.user.role);
          }, error => console.log(error)
        );

      this.skillService.getSkillsForUser(this.userId)
        .subscribe(
          res => {
            this.userSkillsArray = res;
          }, error => console.log(error)
        );

      this.skillService.getSkills()
        .subscribe(
          res => {
            res.map((obj) => {
              this.skillsArray.push(obj.skillName);
            });
          }, error => console.log(error)
        );
    });
  }

  ngAfterViewChecked(): void {
    // Work around for bug in Materialize library, form labels overlap prefilled inputs
    // See https://github.com/InfomediaLtd/angular2-materialize/issues/106
    if (Materialize && Materialize.updateTextFields) {
      // *** Does not seem to be needed - also prevents labels from moving when clicked ***
      Materialize.updateTextFields();
    }
  }

  private getFormConstants(): void {
    this.countries = this.constantsService.getCountries();
  }

  private initForm(): void {

    this.userForm = this.fb.group({
      'email': ['', []],
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

  checkRole(userRole: String): void {
    if (this.auth.isOrganization()) {
      this.displayPhone = true;
      this.userForm.controls.title.clearValidators();
      this.userForm.controls.description.clearValidators();
    }
    if (this.auth.isVolunteer()) {
      this.displayProfile = true;
    }
  }

 checkFlag(): void {
  if (this.user.publishFlag === 'Y') {
    this.checkPublish = true;
  }
  if (this.user.notifyFlag === 'Y' ) {
    this.checkNotify = true;
  }
 }

  onEditSkills() {
    this.editFlag = !this.editFlag;
  }

  onDeleteSkill(skillToDelete) {
    this.userSkillsArray = this.userSkillsArray.filter((projectSkill) => {
      return projectSkill !== skillToDelete;
    });
    console.log(this.userSkillsArray);
  }

  onAddListedSkill(optionValue) {
    this.skillCounter = this.userSkillsArray.length;
    console.log(optionValue.target.value);
    this.checkSkillList (optionValue.target.value);
    if (!this.isSkillExists && !this.isSkillLimit) {
      this.userSkillsArray.push(optionValue.target.value);
    }
    console.log(this.userSkillsArray);
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

    this.userService.update(this.user).subscribe(() => {
        this.globalActions.emit('toast');
        this.router.navigate(['/user/view', this.user.id]);
       },
        err => { console.error(err, 'An error occurred'); } );

    // TODO pass skill names
     this.skillService.updateUserSkills(this.userSkillsArray, this.user.id).subscribe(
      res => {
        this.globalActions.emit('toast');
      }, error => console.log(error)
     );
  }

  /*
    Orchestrates the avatar image upload sequence of steps
  */
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
}
