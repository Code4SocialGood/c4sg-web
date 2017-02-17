import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project }        from '../project/common/project';
import { ProjectService } from '../project/common/project.service';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})

export class HomeComponent implements OnInit {

    projects: Project[] = [];

    constructor(private projectService: ProjectService, private router: Router) {
    }

    ngOnInit(): void {
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
      );
    }
}
