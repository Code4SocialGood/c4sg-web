import { Component, OnInit, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../common/project.service';
import { Project } from '../common/project';
import { Organization } from '../../organization/common/organization';
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
  public organizations: Organization[];

  public inputValue = '';
  public imageUrl: any = '';

  public projectSkillsArray: string[] = [];
  public skillsArray: string[] = [];
  public skill = '';
  public skillCounter = 0;

  public isCreate = false; // Create Project or Edit Project
  public isSkillExists = false;
  public isSkillLimit = false;

  public descMaxLength: number = this.validationService.descMaxLength;
  public descMaxLengthEntered = false;
  public descValueLength: number;
  public descFieldFocused = false;

  public projectForm: FormGroup;
  public globalActions = new EventEmitter<string|MaterializeAction>();

  constructor(public fb: FormBuilder,
              private projectService: ProjectService,
              private organizationService: OrganizationService,
              public constantsService: FormConstantsService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private router: Router,
              private skillService: SkillService,
              private extfilehandler: ExtFileHandlerService,
              private validationService: ValidationService
              ) {
  }

  ngOnInit(): void {

    this.currentUserId = this.auth.getCurrentUserId();
    this.getFormConstants();
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
                this.fillForm();
              });
            },
            error => console.log(error)
          );

        // Skills are empty for this new project
        this.projectSkillsArray = [];
      } else { // Edit Project
        // Populates the project
        this.projectService.getProject(this.projectId)
          .subscribe(
            resProject => {
              this.project = resProject;
              this.imageUrl = this.project.imageUrl;
              this.fillForm();
            }, error => console.log(error)
          );

        // Populates skills for the project
        this.skillService.getSkillsByProject(this.projectId)
          .subscribe(
            resSkillsProjects => {
              this.projectSkillsArray = resSkillsProjects;
            }, error => console.log(error)
          );
      }
    });
  }

  private getFormConstants(): void {
    this.countries = this.constantsService.getCountries();
  }

  private initForm(): void {

    this.projectForm = this.fb.group({
      'name': ['', []],
      'organizationId': ['', []],
      'description': ['', []],
      'remoteFlag': ['Y', []],
      'city': ['', []],
      'state': ['', []],
      'country': ['', []]
    });
  }

  private fillForm(): void {

    this.projectForm = this.fb.group({
      'name': [this.project.name || '', [Validators.required]],
      'organizationId': [this.project.organizationId || '', [Validators.required]],
      'description': [this.project.description || '', [Validators.compose([Validators.maxLength(1000)])]],
      'remoteFlag': [this.project.remoteFlag || '', [Validators.required]],
      'city': [this.project.city || '', []],
      'state': [this.project.state || '', []],
      'country': [this.project.country || '', []]
    });
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
            Materialize.toast('Your changes have been saved', 4000);
          }, error => console.log(error));
      });
  }

  onAddListedSkill(optionValue) {
    this.skillCounter = this.projectSkillsArray.length;
    this.checkSkillList (optionValue.target.value);
    if (!this.isSkillExists && !this.isSkillLimit) {
      this.projectSkillsArray.push(optionValue.target.value);
    }
    // console.log(this.projectSkillsArray);
  }

  onDeleteSkill(skillToDelete) {
    this.projectSkillsArray = this.projectSkillsArray.filter((projectSkill) => {
      return projectSkill !== skillToDelete;
    });
    // console.log(this.projectSkillsArray);
  }

  onAddOwnSkill(inputSkill) {
    this.skillCounter = this.projectSkillsArray.length;
    if (inputSkill.value && inputSkill.value.trim()) {
      this.checkSkillList (inputSkill.value);
      if (!this.isSkillExists && !this.isSkillLimit) {
        this.projectSkillsArray.push(inputSkill.value);
        this.inputValue = '';
        // console.log(this.projectSkillsArray);
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
      for (this.skill of this.projectSkillsArray) {
        if (selectedSkill === this.skill) {
          this.isSkillExists = true;
          this.globalActions.emit({action: 'toast', params: ['Selected skill already in the list', 4000]});
        }
      }
    }
  }

  // Orchestrates the project image upload sequence of steps
  onUploadImage(fileInput: any): void {
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
  }

  // Does not seem to be needed - also prevents labels from moving when clicked
  ngAfterViewChecked(): void {
    // Work around for bug in Materialize library, form labels overlap prefilled inputs
    // See https://github.com/InfomediaLtd/angular2-materialize/issues/106
    // if (Materialize && Materialize.updateTextFields) {
    //  Materialize.updateTextFields();
    // }
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

}
