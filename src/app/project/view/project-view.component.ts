import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { AuthService } from '../../auth.service';
import { MaterializeAction } from 'angular2-materialize';
import { ImageDisplayService } from '../../_services/image-display.service';

@Component({
  selector: 'my-view-project',
  templateUrl: 'project-view.component.html',
  styleUrls: ['project-view.component.css']
})

export class ProjectViewComponent implements OnInit {

  project: Project;
  params: Params;
  currentUserId: string;
  globalActions = new EventEmitter<string|MaterializeAction>();
  projectImage: any = '';

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private location: Location,
              private imageDisplay: ImageDisplayService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      const id = params['projectId'];

      this.imageDisplay.displayImage(id,
        this.projectService.retrieveImage.bind(this.projectService))
            .subscribe(res => this.projectImage = res.url );

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

  bookmark(): void {
    // check if user is logged in
    this.currentUserId = this.auth.getCurrentUserId();
    if (this.auth.authenticated() && this.currentUserId !== null && this.currentUserId !== '0') {
        this.projectService
            .bookmark(this.project.id, this.currentUserId)
            .subscribe(
                response => {

                    // display toast
                    this.globalActions.emit({action: 'toast', params: ['Bookmark added for the project', 4000]});

                },
                error => {
                    // display toast when bookmar is already added
                    this.globalActions.emit({action: 'toast', params: [JSON.parse(error._body).message, 4000]});
                }
            );
    } else {
        // display toast when user is not logged in
        this.globalActions.emit({action: 'toast', params: ['Please login to add bookmark', 4000]});
    }
  }
}
