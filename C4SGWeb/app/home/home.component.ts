import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';
import { Project }        from '../project/common/project';
import { ProjectService } from '../project/common/project.service';

@Component({
  selector: 'my-home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  animations: [
    trigger('buttonState', [
    state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active',   style({
        transform: 'scale(1.05)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]

})

export class HomeComponent implements OnInit {

    projects: Project[] = [];
    state: string = 'inactive';

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
    // a defined function to control the animation of the button
    toggleState() {
      this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    }
}
