import { Component, OnInit, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../common/project.service';
import { Project } from '../common/project';
import { User } from '../../user/common/user';
import { JobTitle } from '../../job-title';
import { Organization } from '../../organization/common/organization';
import { UserService } from '../../user/common/user.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { SkillService } from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';
import { AuthService} from '../../auth.service';
import { ExtFileHandlerService } from '../../_services/extfilehandler.service';
import { ValidationService } from '../../_services/validation.service';


declare const Materialize: any;

@Component({
  selector: 'my-edit-project',
  templateUrl: 'project-edit.component.html',
  styleUrls: ['project-edit.component.scss']
})

export class ProjectEditComponent implements OnInit, AfterViewChecked {

  public currentUserId;
  public countries: any[];

  public projectId;
  public organizationId;
  public project: Project;
  public organization: Organization;
  // public user: User;
  public organizations: Organization[];

  public inputValue = '';
  public imageUrl: any = '';
  public jobTitlesArray: JobTitle[] = [];
  public projectSkillsArray: string[] = [];
  public skillsArray: string[] = [];
  public skill = '';
  public skillCounter = 0;

  public isCreate = false; // Create Project or Edit Project
  public isSkillExists = false;
  public isSkillLimit = false;

  public isOrgNew = false;
  public isOrgPending = false;
  public isOrgActive = false;
  public displayClose = false;
  public user: User;
  public isUserInfoIncomplete = false;

  public descMaxLength: number = this.validationService.descMaxLength;
  public descMaxLengthEntered = false;
  public descValueLength: number;
  public descFieldFocused = false;

  public projectForm: FormGroup;

  public globalActions = new EventEmitter<string|MaterializeAction>();
  public modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(public fb: FormBuilder,
              private projectService: ProjectService,
              private organizationService: OrganizationService,
              public constantsService: FormConstantsService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private router: Router,
              private skillService: SkillService,
              private extfilehandler: ExtFileHandlerService,
              private validationService: ValidationService,
              private userService: UserService,
              ) {

  }

  ngOnInit(): void {

    this.currentUserId = this.auth.getCurrentUserId();
    this.getFormConstants();
   // this.getjobTitles();
    this.route.data
      .subscribe((data: { JobTitles: JobTitle[] }) => {
        this.jobTitlesArray = data.JobTitles;
      });
    this.initForm();
    // Populates skills list
    this.skillService.getSkills()
      .subscribe(
        resSkills => {
          resSkills.map((obj) => {
            this.skillsArray.push(obj.skillName);
          });
        }, error => console.log(error)
      );

    this.route.params.subscribe(params => {
      this.projectId = +params['projectId'];

      if (this.projectId === 0) { // Create Project
        this.isCreate = true;

        // Gets organization ID for this new project
        this.organizationId = localStorage.getItem('userOrganizationId');

        // Gets project ID for this new project, backend will create a new empty project with project status 'N'.
        this.projectService.getProjectByOrg(Number(this.organizationId), 'N')
          .subscribe(
            res => {
              let projects: Project[];
              projects = res.json();
              projects.forEach((e: Project) => {
                this.projectId = e.id.toString();
                this.project = e;
                this.imageUrl = this.project.imageUrl;
                // this.getjobTitles();
                this.project.jobTitleId = 0;
                this.project.remoteFlag = 'Y';
                this.fillForm();
              });
            },
            error => console.log(error)
          );

        // Skills are empty for this new project
        this.projectSkillsArray = [];

        // Check organization status
        this.organizationService.getOrganization(this.organizationId)
          .subscribe(
            res => {
              this.organization = res;
              if (this.organization.status === 'N') {
                this.isOrgNew = true;
              } else if (this.organization.status === 'P') {
                this.isOrgPending = true;
              } else if (this.organization.status === 'A') {
                this.isOrgActive = true;
              }

              this.fillForm();
            }, error => console.log(error)
          );
        this.userService.getUser(this.currentUserId)
          .subscribe(
          res => {
            this.user = res;
            if (this.user === null || this.user === undefined) {
              this.isUserInfoIncomplete = true;
            } else {
              if (this.user.userName === null || this.user.userName === ''
                || this.user.firstName === null || this.user.firstName === ''
                || this.user.lastName === null || this.user.lastName === ''
                || this.user.country === null || this.user.country === ''
                || this.user.title === null || this.user.title === '') {
                this.isUserInfoIncomplete = true;
              }
            }
          });
      } else { // Edit Project
        // Populates the project
        this.projectService.getProject(this.projectId)
          .subscribe(
            resProject => {
              this.project = resProject;
              this.imageUrl = this.project.imageUrl;
              this.fillForm();
              if (this.project.status === 'A') {
                this.displayClose = true;
              }
            }, error => console.log(error)
          );

        // Populates skills for the project
        this.skillService.getSkillsByProject(this.projectId)
          .subscribe(
            resSkillsProjects => {
              this.projectSkillsArray = resSkillsProjects;
            }, error => console.log(error)
          );

        this.isOrgActive = true; // Org must be active so that a project could be created
      }
    });

  }

  private getFormConstants(): void {
    this.countries = this.constantsService.getCountries();
  }

 /*private getjobTitles(): void {
   this.userService.getAllJobTitles()
        .subscribe(
        res => {
          this.jobTitlesArray = res;
        }, error => console.log(error)
        );
 }*/

  private initForm(): void {

    this.projectForm = this.fb.group({
      'name': ['', []],
      'organizationId': ['', []],
      'jobTitleId': ['0', []],
      'description': ['', []],
      'remoteFlag': ['Y', []],
      'city': ['', []],
      'state': ['', []],
      'country': ['', []]
    });
  }

  private fillForm(): void {
    if (this.project !== null && this.project !== undefined) {
      this.projectForm = this.fb.group({
        'name': [this.project.name || '', [Validators.required]],
        'organizationId': [this.project.organizationId || '', [Validators.required]],
        'jobTitleId': [this.project.jobTitleId || '', []],
        'description': [this.project.description || '', [Validators.compose([Validators.maxLength(10000)])]],
        'remoteFlag': [this.project.remoteFlag || '', [Validators.required]],
        'city': [this.project.city || '', []],
        'state': [this.project.state || '', []],
        'country': [this.project.country || '', []]
      });
    }
  }

  onSubmit(updatedData: any, event): void {
    event.preventDefault();
    event.stopPropagation();

    const formData = this.projectForm.value;
    formData.id = this.project.id;

    this.project.name = formData.name;
    this.project.description = formData.description;
    this.project.remoteFlag = formData.remoteFlag;

    this.project.city = formData.city;
    this.project.state = formData.state;

    this.project.country = formData.country;
    this.project.jobTitleId = formData.jobTitleId;

    if (this.isCreate) {
      this.project.status = 'A';
    }

    this.projectService
      .update(this.project)
      .subscribe(res => {
        this.skillService
          .updateProjectSkills(this.projectSkillsArray, this.project.id)
          .subscribe(result => {
            this.router.navigate(['/project/view/' + this.project.id]);
            Materialize.toast('The project is saved', 4000);
          }, error => console.log(error));
      });
  }

  onAddListedSkill(optionValue) {
    this.skillCounter = this.projectSkillsArray.length;
    this.checkSkillList (optionValue.target.value);
    if (!this.isSkillExists && !this.isSkillLimit) {
      this.projectSkillsArray.push(optionValue.target.value);
    }
  }

  onDeleteSkill(skillToDelete) {
    this.projectSkillsArray = this.projectSkillsArray.filter((projectSkill) => {
      return projectSkill !== skillToDelete;
    });
  }

  onAddOwnSkill(inputSkill) {
    this.skillCounter = this.projectSkillsArray.length;
    if (inputSkill.value && inputSkill.value.trim()) {
      this.checkSkillList (inputSkill.value);
      if (!this.isSkillExists && !this.isSkillLimit) {
        this.projectSkillsArray.push(inputSkill.value);
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
      const value = '{action: "toast", params: ["Skill list exceeds limit 10", 4000]}';
      this.globalActions.emit(value);
    }

    if (!this.isSkillLimit) {
      for (this.skill of this.projectSkillsArray) {
        if (selectedSkill === this.skill) {
          this.isSkillExists = true;
          const value = '{action: "toast", params: ["Selected skill already in the list", 4000]}';
          this.globalActions.emit(value);
        }
      }
    }
  }

  // Orchestrates the project image upload sequence of steps
  onUploadImage(fileInput: any): void {
    if (fileInput.target.files[0].size < this.constantsService.maxFileSize) {
    // Function call to upload the file to AWS S3
    const upload$ = this.extfilehandler.uploadFile(fileInput, this.project.id, 'image');

    // Calls the function to save the project image url to the project's row
    upload$.switchMap( (res) => this.projectService.saveProjectImg(this.project.id, res),
      (outerValue, innerValue, outerIndex, innerIndex) => ({outerValue, innerValue, outerIndex, innerIndex}))
      .subscribe(res => {
        if (res.innerValue.text() === '') {
            this.imageUrl = res.outerValue;
            this.project.imageUrl = this.imageUrl;
        } else {
          console.error('Saving project image: Not expecting a response body');
        }}, (e) => {
          console.error('Image not saved. Not expecting a response body');
        });
    } else {
      Materialize.toast('Maximum image size allowed is 1MB', 4000);
    }
  }

  deleteImage() {
    this.imageUrl = '';
    this.projectService.saveProjectImg(this.projectId, this.imageUrl)
      .subscribe(res => {
          this.project.imageUrl = this.imageUrl;
        },
        (error) => {
          console.log('Image not deleted successfully');
        }
      );
  }


  ngAfterViewChecked(): void {
    // Activate the labels so that the text does not overlap
    document.getElementById('name-label').classList.add('active');
    document.getElementById('desc-label').classList.add('active');
    document.getElementById('city-label').classList.add('active');
    document.getElementById('state-label').classList.add('active');

    if (Materialize && Materialize.updateTextFields) {
      Materialize.updateTextFields();
    }
  }

  // Count chars in introduction field
  onCountCharDescription() {
    this.descValueLength = this.projectForm.value.description.length;
    if (this.projectForm.controls.description.invalid) {
      this.descMaxLengthEntered = true;
    } else {
      this.descMaxLengthEntered = false;
    }
  }

  onFocusDescription() {
    this.descFieldFocused = true;
    this.onCountCharDescription();
  }

  onBlurDescription() {
    if (!this.projectForm.controls.description.invalid) {
      this.descFieldFocused = false;
    }
  }

  onClose(): void {
    this.projectService
      .delete(this.project.id)
      .subscribe(
        response => {
          Materialize.toast('The project is closed', 4000);
          this.router.navigate(['/project/view', this.project.id]);
        },
        error => {
          console.log(error);
          Materialize.toast('Error closing the project', 4000);
        }
      );
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

}
