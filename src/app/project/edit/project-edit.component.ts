import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../common/project.service';
import { Project } from '../common/project';
import { FormConstantsService } from '../../_services/form-constants.service';
import { SkillService } from '../../skill/common/skill.service';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs/Observable;
import { ImageUploaderService, ImageReaderResponse } from '../../_services/image-uploader.service';
declare const Materialize: any;

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
              private router: Router,
              private skillService: SkillService,
              private imageUploader: ImageUploaderService) {
  }

  ngOnInit(): void {    
    this.route.params.subscribe(params => {

    this.getFormConstants();
    this.initForm();
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

      this.skillService.getSkills()
        .subscribe(
          res => {
            res.map((obj) => {
              this.skillsArray.push(obj.skillName);
            });
          }, error => console.log(error)
        );
       }
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
      'remoteFlag': ['', [Validators.required]],
      'city': ['', []],
      'state': ['', []],
      'country': ['', []]
    });
  }

  private fillForm(): void {

    this.projectForm = this.fb.group({
      'name': [this.project.name || '', [Validators.required]],
      'organizationId': [this.project.organizationId || '', []],
      'description': [this.project.description || '', []],
      'remoteFlag': [this.project.remoteFlag || '', [Validators.required]],
      'city': [this.project.city || '', []],
      'state': [this.project.state || '', []],
      'country': [this.project.country || '', []]
    });
  }

  changeImage(event) {
    this.projectImageUrl = event.target.files;
  }

  onEditSkills() {
    this.editFlag = !this.editFlag;
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
    this.projectService.createProject(this.projectForm.value).subscribe(res => {
           this.project = res.project;
           this.skillService.updateSkills(this.projectSkillsArray, this.project.id); 
           // After all calls are successfully made, go to the view page
        this.router.navigate(['/project/view/' + this.project.id]);
      }, error => console.log(error)
     );
  }
  
  private updateProject(): void {
  const formData = this.projectForm.value;
    formData.id = this.project.id;
    formData.status = 'A';

 this.projectService.updateProject(formData).subscribe(
    res => {
        this.project = res.project;
        this.skillService.updateSkills(this.projectSkillsArray, this.project.id);
        // After all calls are successfully made, go to the view page
        this.router.navigate(['/project/view/' + this.project.id]);
      }, error => console.log(error));  
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
onUploadLogo(fileInput: any): void {
    // Make sure there are files before doing the upload
    if (fileInput.target.files && fileInput.target.files.length) {

      // Make sure the file is under 1MB
      if (fileInput.target.files[0].size < 1048576) {
        this.logoValid = true;
        if (this.projectId === 0) {
          this.readLogo(fileInput);
        } else {
          this.saveLogo(fileInput);
        }
      } else {
        this.logoValid = false;
      }
    }
  }

  private readLogo(fileInput: any): void {
    this.imageUploader
      .readImage(fileInput)
      .subscribe(res => {
        this.project.imageUrl = res.base64Image;
        this.logoData = res;
      });
  }

  private saveLogo(fileInput: any): void {
    this.imageUploader.uploadImage(fileInput,
      this.projectId,
      this.projectService.saveLogo.bind(this.projectService))
      .subscribe(res => {
        if (res.url) {
            this.project.imageUrl = res.url;
        }
      },
      err => { console.error(err, 'An error occurred'); });
  }
}
