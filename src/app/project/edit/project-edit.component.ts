import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../common/project.service';
import { Project } from '../common/project';
import { FormConstantsService } from '../../_services/form-constants.service';
import { SkillService } from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'my-edit-project',
  templateUrl: 'project-edit.component.html',
  styleUrls: ['project-edit.component.scss']
})

export class ProjectEditComponent implements OnInit {
  public countries: any[];
  public project: Project;
  public projectId;
  public projectImageUrl = '../../../assets/default_image.png';
  public projectForm: FormGroup;
  public projectSkillsArray: string[] = [];
  public skillsArray: string[] = [];
  public inputValue = '';
  public globalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(public fb: FormBuilder,
              private projectService: ProjectService,
              private fc: FormConstantsService,
              private route: ActivatedRoute,
              private skillService: SkillService) {
  }

  ngOnInit(): void {

    this.getFormConstants();
    this.initForm();

    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];

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
      'projectName': ['', []],
      'organizationName': ['', []],
      'projectDescription': ['', []],
      'remoteFlag': ['Y', []],
      'city': ['', []],
      'state': ['', []],
      'country': ['', []]
    });
  }

  private fillForm(): void {

    this.projectForm = this.fb.group({
      'projectName': [this.project.name || '', [Validators.required]],
      'organizationName': [this.project.organizationName || '', []],
      'projectDescription': [this.project.description || '', []],
      'remoteFlag': [this.project.remoteFlag || '', [Validators.required]],
      'city': [this.project.city || '', []],
      'state': [this.project.state || '', []],
      'country': [this.project.country || '', []]
    });
  }

  onSubmit(updatedData: any, event): void {
    event.preventDefault();
    event.stopPropagation();

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
    );

    // TODO pass skill names
    // this.skillService.updateSkills(this.projectSkillsArray, this.project.id).subscribe(
    //  res => {
    //    this.globalActions.emit('toast');
    //  }, error => console.log(error)
    // );
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

  openModal(user) {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
}
