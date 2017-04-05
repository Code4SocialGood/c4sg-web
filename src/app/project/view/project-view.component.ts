import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { ImageDisplayService } from '../../_services/image-display.service';

@Component({
  selector: 'my-view-project',
  templateUrl: 'project-view.component.html',
  styleUrls: ['project-view.component.css']
})

export class ProjectViewComponent implements OnInit {

  project: Project;
  params: Params;
  projectImage: any = '';

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private imageDisplay: ImageDisplayService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['projectId'];

      this.imageDisplay.displayImage(id,
        this.projectService.retrieveImage.bind(this.projectService))
        .subscribe(res => this.projectImage = res.url )
      
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
}
