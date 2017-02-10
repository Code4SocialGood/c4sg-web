import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
    //moduleId: module.id,
    selector: 'my-projects',
    templateUrl: './volunteer-project.component.html',
    styleUrls: ['./volunteer-project.component.css']
})

export class VolunteerProjectComponent implements OnInit {

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

    getProjectsByKeyword(keyword: string) {
        keyword = keyword.trim();
        if (!keyword) { return; }

        this.projectService.getProjectsByKeyword(keyword).subscribe(
            res => {
                this.projects = JSON.parse(JSON.parse(JSON.stringify(res))._body);
                this.router.navigate(['/volunteers']);
            },
            error => console.log(error)
        )
    }

    onSelect(project: Project): void {
        this.selectedProject = project;
        this.router.navigate(['/view-project', project.id]);
    }
}
