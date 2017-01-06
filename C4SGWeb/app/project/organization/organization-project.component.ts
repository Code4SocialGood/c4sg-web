import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
    moduleId: module.id,
    selector: 'my-projects',
    templateUrl: 'organization-project.component.html',
    styleUrls: ['organization-project.component.css']
})

export class OrganizationProjectComponent implements OnInit {

  projects: Object[];

	selectedProject: Project;

	constructor(private projectService: ProjectService, private router: Router) {
	}

    ngOnInit(): void {
        this.getProjects();
    }

	getProjects() {
		this.projectService.getProjects().subscribe(
			res => {
        		this.projects = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      		},
      		error => console.log(error)
		)
	}

    // TODO Don't provide the identity colume value
    add(name: string): void {
        name = name.trim();
        if (!name) { return; }

        let project = new Project(8, name, 1, 'description', 'logo.png', 'city', 'USA', '55311', 'Teens Give');

        this.projectService
            .add(project)
            .subscribe(
                response => {
                    this.getProjects();
                    this.router.navigate(['/nonprofits']);
                },
                error => console.log(error)
            );
    }

    delete(project: Project): void {
        this.projectService
            .delete(project.id)
            .subscribe(
                response => { // An error occurred SyntaxError: Unexpected end of JSON input
                    this.getProjects();
                    this.router.navigate(['/nonprofits']);
                },                           
                error => console.log(error)
            );
    }

    onSelect(project: Project): void {
        this.selectedProject = project;
        this.router.navigate(['/view-project', project.id]);
    }

}
