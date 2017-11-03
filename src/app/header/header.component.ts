import { Component, DoCheck, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { OrganizationService } from '../organization/common/organization.service';
import { Organization } from '../organization/common/organization';
import { Project } from '../project/common/project';
import { ProjectService} from '../project/common/project.service';
import { Subscription} from 'rxjs/Rx';
import {MaterializeDirective} from 'angular2-materialize';

@Component({
// moduleId: module.id,  // For webpack, remove this
  selector: 'my-c4sg-header',
  templateUrl: './header.component.html',
  styleUrls: [ 'header.component.scss' ]
})

export class HeaderComponent implements  OnInit, OnDestroy {

  currentUserId: string;
  organizationId: string;
  projectId: string;
  atHome = false;
  projectsSubscription: Subscription;

  constructor(private router: Router,
              public authSvc: AuthService,
              private organizationService: OrganizationService,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    // Subscribe to updates to the organization
    this.organizationService.organizationLinkedSource$.subscribe(res => {
      this.setOrganizationId(res);
    });
  }

  loadProjects(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/project/list', 'reload'], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/project/list/projects']));
  }

  loadVolunteers(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/user/list', { from: 'reload' }], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/user/list']));
  }

  loadOrganizations(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/organization/list', 'reload'], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/organization/list/organizations']));
  }

  private setOrganizationId(organizationId: string): void {
    this.organizationId = organizationId;
    localStorage.setItem('userOrganizationId', organizationId);
  }

  // control nav style by changing the class name
  isAtHome() {
    if (this.router.url === '/' || this.router.url === '/#!') {
      return 'at-home';
    }
    return 'off-home';
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }
}
