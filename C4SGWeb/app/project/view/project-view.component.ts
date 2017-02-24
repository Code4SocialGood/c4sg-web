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
              private router: Router,
              private location: Location) {
  }

  ngOnInit(): void {

    this.route.params.forEach((params: Params) => {

      let id = +params['id'] - 1;

      this.projectService.getProject(id).subscribe(
        res => {
          this.project = JSON.parse(JSON.parse(JSON.stringify(res))._body);
        },
        error => console.log(error)
      );
    });
  }

  update(): void {

    this.projectService
      .update(this.project)
      .subscribe(
        response => {
          this.router.navigate(['/nonprofits']);
        },
        error => console.log(error)
      );
  }

  goBack(): void {
    this.location.back();
  }
}
