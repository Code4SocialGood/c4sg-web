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
  styleUrls: [ 'home.1.component.scss' ]  
})

export class HomeComponent implements OnInit {

  constructor(private projectService: ProjectService,
              private router: Router,
              private dataService: DataService,
              public authSvc: AuthService) {
  }

  // onload animation timer
  ngOnInit(): void {
    
  }
 }
