import { Component, ElementRef, OnInit, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser/';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../common/user';
import { UserService } from '../common/user.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { ImageUploaderService, ImageReaderResponse } from '../../_services/image-uploader.service';
import { AuthService } from '../../auth.service';
import { SkillService } from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';

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
  public projectSkillsArray: string[] = [];
  public skillsArray: string[] = [];
  public inputValue = '';
  private defaultAvatar = '../../../assets/default_image.png';
  public globalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();
  public avatar: any = '';
  public skillsOption = [{value: '1', name: 'CSS'},
    {value: '2', name: 'option2'},
    {value: '3', name: 'python'}];
  currentUserId: String;

  constructor(
    public fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private fc: FormConstantsService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private imageUploader: ImageUploaderService,
    private skillService: SkillService
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
          this.checkRole(this.user.role);
          this.checkFlag();
          this.fillForm();
          }, error => console.log(error)
        );

      this.skillService.getSkillsForUser(this.userId)
        .subscribe(
          res => {
            this.projectSkillsArray = res;
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

      // NOTE: Logo retrieval is a temporary fix until form can be properly submitted with logo
      // return this.userService.retrieveLogo(this.organizationId).toPromise();
      // const logoText = res.text();
      // const logoBase64 = `data:image/png;base64, ${logoText}`;
      // this.organization.logo = logoText ? this.sanitizer.bypassSecurityTrustUrl(logoBase64) : this.defaultAvatar;
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
    this.countries = this.fc.getCountries();
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
      'facebookUrl': ['', []],
      'twitterUrl': ['', []],
      'publishFlag': ['', []],
      'notifyFlag': ['', []]
    });
  }

  private fillForm(): void {

    this.userForm = this.fb.group({
      'email': [this.user.email || '', [Validators.required]],
      'userName': [this.user.userName || '', [Validators.required]],
      'firstName': [this.user.firstName || '', []],
      'lastName': [this.user.lastName || '', []],
      'state': [this.user.state || '', []],
      'country': [this.user.country || '', [Validators.required]],
      'phone': [this.user.phone || '', []],
      'title': [this.user.title || '', []],
      'introduction': [this.user.introduction || '', []],
      'linkedinUrl': [this.user.linkedinUrl || '', []],
      'personalUrl': [this.user.personalUrl || '', []],
      'githubUrl': [this.user.githubUrl || '', []],
      'facebookUrl': [this.user.facebookUrl || '', []],
      'twitterUrl': [this.user.twitterUrl || '', []],
      'publishFlag': [this.user.publishFlag || '', []],
      'notifyFlag': [this.user.notifyFlag || '', []]
    });
  }

  checkRole(userRole: String): void {
    if (this.auth.isOrganization()) {
      this.displayPhone = true;
    }
    if (this.auth.isVolunteer() || this.auth.isAdmin()) {
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
    this.projectSkillsArray = this.projectSkillsArray.filter((projectSkill) => {
      return projectSkill !== skillToDelete;
    });
    console.log(this.projectSkillsArray);
  }

  onAddListedSkill(optionValue) {
    console.log(optionValue.target.value);
    this.projectSkillsArray.push(optionValue.target.value);
    console.log(this.projectSkillsArray);
  }

  onAddOwnSkill(inputSkill) {
    console.log(inputSkill.value);
    if (inputSkill.value && inputSkill.value.trim()) {
      this.projectSkillsArray.push(inputSkill.value);
      this.inputValue = '';
      console.log(this.projectSkillsArray);
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
    this.user.facebookUrl = this.userForm.value.facebookUrl;
    this.user.twitterUrl = this.userForm.value.twitterUrl;
    this.user.publishFlag = this.userForm.value.publishFlag;
    this.user.notifyFlag = this.userForm.value.notifyFlag;

    this.userService.update(this.user).subscribe(() => {
        this.globalActions.emit('toast');
       },
        err => { console.error(err, 'An error occurred'); } );

    // TODO pass skill names
    // this.skillService.updateSkills(this.userSkillsArray, this.user.id).subscribe(
    //  res => {
    //    this.globalActions.emit('toast');
    //  }, error => console.log(error)
    // );
  }
}
