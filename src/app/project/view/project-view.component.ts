import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'view-project',
  templateUrl: 'project-view.component.html',
  styleUrls: ['project-view.component.css']
})

export class ProjectViewComponent implements OnInit {

  project: Project;
  params: Params;
  currentUserId: string;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router,              
              private auth: AuthService) {

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
    if (this.auth.authenticated() && this.currentUserId == null)
    {
        this.currentUserId = this.auth.getCurrentUserId();
        if (this.currentUserId != '0' && this.currentUserId != null ) {
        
            console.log('Project id' + this.project.id + 'user id:' + this.currentUserId)
    
            this.projectService
                .bookmark(this.project.id, this.currentUserId)
                .subscribe(
                    response => {
                        console.log('bookmark added for project:' + this.project.id +' and user:' + this.currentUserId)
                    },
                    error => console.log(JSON.parse(error._body).message) 
                );
        }
        else{
            console.log('Please login to add bookmark.');
        }
    }
    else{
        console.log('Please login to add bookmark.');
    }   
    
    //display toast
  }

  goBack(): void {
    this.location.back();
  }
}
