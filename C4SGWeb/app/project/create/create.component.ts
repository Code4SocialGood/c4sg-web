import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
    moduleId: module.id,
    selector: 'create-project',
    templateUrl: 'create.component.html',
    styleUrls: [ 'create.component.css' ]
})

export class CreateProjectComponent {

    project: Project;
    params: Params;

    constructor(
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        public fb: FormBuilder
    ) {}

    // create form and validation
    createProjectForm = this.fb.group({
        name: ["", Validators.required],
        orgName: ["", Validators.required],
        shortDescription: ["", [
                Validators.required,
                Validators.maxLength(200)
            ]],
        description: ["", Validators.required],
        remote: [false],
        address: [false],
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        zip: ""
    });

    // retrieve info from form 
    createProject(): void {
        let form = this.createProjectForm.value;
    
        let project = new Project(
            form.name, 
            form.organization, 
            form.shortDescription, 
            form.description,
            form.line1,
            form.line2,
            form.city,
            form.country,
            form.zip
        );

        this.projectService
            .add(project)
            .subscribe(
                response => {
                    this.router.navigate(['/projects']);
                },
                error => console.log(error)
            );
        }

    cancel(): void {
       this.router.navigate(['/projects']);
    }

}
