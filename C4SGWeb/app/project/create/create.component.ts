import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
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
        private location: Location
    ) {}

    create(): void {

        let project = new Project(8, name, 1, 'description', 'logo.png', 'city', 'USA', '55311', 'Teens Give');

        this.projectService
            .add(project)
            .subscribe(
                response => {
                    this.router.navigate(['/']);
                },
                error => console.log(error)
            );
    }

    cancel(): void {
       this.location.back();
    }

}
