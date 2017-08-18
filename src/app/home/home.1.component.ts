import { Component, OnInit, Input, trigger, state, style, transition, animate, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Project } from '../project/common/project';
import { ProjectService } from '../project/common/project.service';
import { DataService } from '../_services/data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'my-home',
  templateUrl: 'home.1.component.html',
  styleUrls: [ 'home.1.component.scss' ],
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
    ])]
})

export class HomeComponent implements OnInit {

  //search button 
  state = 'inactive';
  projects: Project[] = [];

  constructor(private projectService: ProjectService,
              private router: Router,
              private dataService: DataService,
              public authSvc: AuthService) {
  }

  // onload animation timer
  ngOnInit(): void {
    
  }
  
  // animation controllers
  // search button
   toggleState() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }
  
  getProjectsByKeyword(keyword: string) {
    keyword = keyword.trim();
    //if (!keyword) { return; }
    this.router.navigate(['/project/list/projects'], {
      queryParams: {
        keyword: keyword
      }
    });
  }  
  
 
  
 }
