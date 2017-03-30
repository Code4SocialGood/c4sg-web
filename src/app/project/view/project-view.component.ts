import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';

@Component({
  selector: 'view-project',
  templateUrl: 'project-view.component.html',
  styleUrls: ['project-view.component.css']
})

export class ProjectViewComponent implements OnInit {

  project: Project;
  params: Params;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['projectId'];

      this.projectService.getProject(id)
          .subscribe(
            res => this.project = res,
            error => console.log(error)
          );
    });
  }

  edit(): void {
    this.router.navigate(['project/edit', this.project.id]);
  }

  delete(): void {

    this.projectService
      .delete(this.project.id)
      .subscribe(
        response => {
          this.router.navigate(['project/list']);
        },
        error => console.log(error)
      );
  }
  
  bookmark():void {
    //check if user is logged in
    
    //call REST API
    
    //display toast
  }

  goBack(): void {
    this.location.back();
  }
}
