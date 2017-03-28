import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { PagerService } from '../../_services/pager.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'my-projects',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  projects: Project[];
  selectedProject: Project;
  pagedItems: any[]; // paged items
  pager: any = {}; // pager Object
  projectsSubscription: Subscription;
  userId: number;


  constructor(
     private projectService: ProjectService,
     private pagerService: PagerService,
     private router: Router,
     private auth: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.auth.getCurrentUserId();
    this.userId = +id;
    this.getProjects();
    //this.setPage(1);

  }

   private getProjects(): void {

     this.projectsSubscription = this.projectService
                                     .getProjects()
                                     .subscribe(
                                       res => {
                                         this.projects = res;
                                         this.setPage(1); // initialize to page 1
                                       },
                                       error => console.log(error)
                                     );

    /* TODO For logged in user, if they click Opportunities, they should see full list of project
       If they click My Projects, they should see filtered list of projecct for themselves.

    if(!this.auth.authenticated()){
         this.projectsSubscription = this.projectService.getProjects().subscribe(
              res => {
                this.projects = JSON.parse(JSON.parse(JSON.stringify(res))._body);
                this.setPage(1); // initialize to page 1
              },
              error => console.log(error));
        }

    else if (this.auth.isVolunteer()){
      this.projectsSubscription = this.projectService.getProjectByUser(this.userId).subscribe(
           res => {
             this.projects = JSON.parse(JSON.parse(JSON.stringify(res))._body);
             this.setPage(1); // initialize to page 1
           },
           error => console.log(error));
    }
    else if (this.auth.isOrganization()){
      this.projectsSubscription = this.projectService.getProjectByOrg(2).subscribe(
           res => {
             this.projects = JSON.parse(JSON.parse(JSON.stringify(res))._body);
             this.setPage(1); // initialize to page 1
           },
           error => console.log(error))
    }
    */
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.projects.length, page);

    // get current page of items
    this.pagedItems = this.projects.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getProjectsByKeyword(keyword: string) {
    keyword = keyword.trim();
    if (!keyword) {
      return;
    }
    this.projectService
        .getProjectsByKeyword(keyword)
        .subscribe(
          res => this.projects = res,
          error => console.log(error)
        );
  }

  onSelect(project: Project): void {
    this.selectedProject = project;
    this.router.navigate(['/project/view', project.id]);
  }

  // TODO Don't provide the identity colume value
  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    const project = new Project(8, name, 1, 'description', 'logo.png', 'city', 'USA', '55311', 'Teens Give');

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

  ngOnDestroy() {
    if (this.projectsSubscription) { this.projectsSubscription.unsubscribe(); }
  }

}
