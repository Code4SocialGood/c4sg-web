import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../common/project.service';
import { Project } from '../common/project';
import { Organization } from '../../organization/common/organization';
import { OrganizationService } from '../../organization/common/organization.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { SkillService } from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';
import {AuthService} from '../../auth.service';

declare const Materialize: any;

@Component({
  selector: 'my-edit-project',
  templateUrl: 'project-edit.component.html',
  styleUrls: ['project-edit.component.scss']
})

export class ProjectEditComponent implements OnInit {
  public countries: any[];
  public project: Project;
  public organization: Organization;
  public organizations: Organization[];
  public organizationId;
  public projectId;
  public currentUserId;
  public projectImageUrl = '../../../assets/default_image.png';
  public projectForm: FormGroup;
  public projectSkillsArray: string[] = [];
  public skillsArray: string[] = [];
  public inputValue = '';
  public globalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();
  public displayOrgField = false;
  public isOrganization = false;

  constructor(public fb: FormBuilder,
              private projectService: ProjectService,
              private organizationService: OrganizationService,
              private fc: FormConstantsService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private router: Router,
              private skillService: SkillService) {
  }

  ngOnInit(): void {

    this.getFormConstants();
    this.currentUserId = this.auth.getCurrentUserId();
    this.displayOrgId();
    this.initForm();

    this.route.params.subscribe(params => {
      this.projectId = +params['projectId'];

      if (this.projectId !== 0) { // Edit Project
        this.projectService.getProject(this.projectId)
          .subscribe(
            res => {
              this.project = res;
              this.fillForm();
            }, error => console.log(error)
          );

        this.projectService.retrieveImage(this.projectId)
          .subscribe(
            res => {
            }, error => console.log(error)
          );

        this.skillService.getSkillsByProject(this.projectId)
          .subscribe(
            res => {
              this.projectSkillsArray = res;
            }, error => console.log(error)
          );
      }

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

  private getFormConstants(): void {
    this.countries = this.fc.getCountries();
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
      'description': [this.project.description || '', []],
      'remoteFlag': [this.project.remoteFlag || '', [Validators.required]],
      'city': [this.project.city || '', []],
      'state': [this.project.state || '', []],
      'country': [this.project.country || '', []]
    });
  }

  onSubmit(updatedData: any, event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.projectId === 0) { // create the project
      this.createProject();
    } else { // Update the project
      this.updateProject();
    }

    /*
    this.project.name = updatedData.projectName;
    this.project.description = updatedData.projectDescription;
    this.project.remoteFlag = updatedData.remoteFlag;
    this.project.city = updatedData.city;
    this.project.state = updatedData.state;
    this.project.country = updatedData.country;

    this.projectService.update(this.project).subscribe(
      res => {
        this.globalActions.emit('toast');
      }, error => console.log(error)
    );*/

    // TODO pass skill names
    // this.skillService.updateSkills(this.projectSkillsArray, this.project.id).subscribe(
    //  res => {
    //    this.globalActions.emit('toast');
    //  }, error => console.log(error)
    // );
  }

  private createProject(): void {

    // TODO:
    // For nonprofit user, find the organization of the user, assign organization ID to the project
    // For admin user, there should be a field to enter org ID
    if (this.isOrganization) {
      const formData = this.projectForm.value;
      formData.organizationId = this.organizationId;
    }
    this.projectService
      .add(this.projectForm.value)
      .map(res => {
        this.project = res.project;

        // Only need to save the logo if a logo was uploaded
        /* TODO
        if (this.imageData) {
          additionalCalls.push(
            this.organizationService
              .saveLogo(this.organization.id, this.imageData.formData)
          );
        }*/

        // return Observable.forkJoin(additionalCalls);
        this.skillService.updateSkills(this.projectSkillsArray, this.project.id).subscribe(
          result => {
            this.globalActions.emit('toast');
          }, error => console.log(error)
        );
      })
      .subscribe(res => {
        // After all calls are successfully made, go to the detail page
        this.router.navigate(['/project/view/' + this.project.id]);
        this.globalActions.emit({action: 'toast', params: ['Project Created Successfully', 4000]});
              });
  }

  private updateProject(): void {

    const formData = this.projectForm.value;
    formData.id = this.project.id;

    this.project.name = formData.projectName;
    this.project.description = formData.projectDescription;
    this.project.remoteFlag = formData.remoteFlag;
    this.project.city = formData.city;
    this.project.state = formData.state;
    this.project.country = formData.country;

    this.projectService
      .update(this.project)
      .subscribe(res => {
        Materialize.toast('Your project is saved', 4000);
        // this.globalActions.emit('toast');
      });
  }

  onAddListedSkill(optionValue) {
    console.log(optionValue.target.value);
    this.projectSkillsArray.push(optionValue.target.value);
    console.log(this.projectSkillsArray);
  }

  onDeleteSkill(skillToDelete) {
    this.projectSkillsArray = this.projectSkillsArray.filter((projectSkill) => {
      return projectSkill !== skillToDelete;
    });
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

  changeImage(event) {
    this.projectImageUrl = event.target.files;
  }

  displayOrgId() {
    if (this.auth.isAdmin()) {
      this.displayOrgField = true;
    }
    if (this.auth.isOrganization()) {
      this.organizationService.getUserOrganization(this.currentUserId)
        .subscribe(
          res => {
            this.isOrganization = true;
            this.organizations = res;
            this.organizations.forEach((org: Organization) => {
              this.organizationId = org.id;
            });
          }, error => console.log(error)
        );

    }
  }
}
