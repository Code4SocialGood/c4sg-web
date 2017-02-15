import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
    //moduleId: module.id,
    selector: 'create-project',
    templateUrl: './create.component.html',
    styleUrls: [ './create.component.css' ]
})

export class CreateProjectComponent {

    project: Project;
    params: Params;
    showAddress: boolean = false;
    public file_srcs: string[] = [];
    public debug_size_before: string[]= [];
    public debug_size_after: string[]=[];

    constructor(
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        public fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    //Upload image
    fileChange(input){
        this.readFiles(input.files);
    }

    readFile(file, reader, callback){

        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);

    }


    readFiles(files, index=0) {

        let reader = new FileReader();
        if (index in files) {

            this.readFile(files[index], reader, (result) => {

                let img = document.createElement("img");

                img.src = result;
                this.resize(img, 250, 250, (resized_jpeg, before, after)=>{
                    this.debug_size_before.push(before);
                    this.debug_size_after.push(after);

                    this.file_srcs.push(resized_jpeg);


                    this.readFiles(files, index+1);
                });
            });
        }else{

            this.changeDetectorRef.detectChanges();
        }
    }

    resize(img, MAX_WIDTH:number, MAX_HEIGHT:number, callback){
        return img.onload = () => {


            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            let canvas = document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0,  width, height);

            let dataUrl = canvas.toDataURL('image/jpeg');

            callback(dataUrl, img.src.length, dataUrl.length);
        };
    }


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

    toggleAddress(value):void {
        this.showAddress = value;
    }

}
