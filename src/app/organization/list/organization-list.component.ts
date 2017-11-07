import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Organization } from '../common/organization';
import { OrganizationService } from '../common/organization.service';
import { Project } from '../../project/common/project';
import { ProjectService } from '../../project/common/project.service';
import { Subscription } from 'rxjs/Rx';
import { FormConstantsService } from '../../_services/form-constants.service';

import { MyPaginationControlsComponent } from '../../_components/my-pagination-controls/my-pagination-controls.component';
import { PaginationInstance } from 'ngx-pagination';

declare const $: Function;

@Component({
  selector: 'my-organizations',
  templateUrl: 'organization-list.component.html',
  styleUrls: ['organization-list.component.scss']
})

export class OrganizationListComponent implements OnInit, AfterViewInit {

  paginationConfig: PaginationInstance;

  categories = [{
    name: 'Nonprofit',
    value: 'N'
  }, {
    name: 'Open Source',
    value: 'O'
  }, {
    name: 'Social Enterprise',
    value: 'S'
  }];

  categoriesArray = new FormArray([
    new FormControl(false),
    new FormControl(false),
    new FormControl(false),
    new FormControl(false)
  ]);

  filterForm = new FormGroup({
    keyword: new FormControl(''),
    hasProjects: new FormControl(false),
    categories: this.categoriesArray
  });
  organizations: Object[];
  pendingOrganizations: Object[];
  declinedOrganizations: Object[];
  selectedOrganization?: Organization;
  projects: Project[];
  from: string;

  organizationsSubscription: Subscription;
  organizationsCache: any[];

  constructor(
    private organizationService: OrganizationService,
    private projectService: ProjectService,
    public constantsService: FormConstantsService,
    private route: ActivatedRoute,
    private router: Router) {
    this.paginationConfig = {
      id: 'organizationsPages',
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
  }

  ngOnInit(): void {

    this.route.params.subscribe(
      params => {
        this.categoriesArray.controls.forEach(categoryControl => {
          return categoryControl.setValue(false);
        });

        this.from = params['from']; // from can be: organizations, reload, pending
        if (this.from === 'reload') {
          this.paginationConfig.currentPage = 1;
          this.filterForm.controls.keyword.setValue('');
          this.filterForm.controls.hasProjects.setValue(false);
          this.filterForm.controls.categories = this.categoriesArray;
        }

        this.getOrganizations(this.paginationConfig.currentPage);
      });

    // Watch for changes to the form and update the list
    this.filterForm.valueChanges.debounceTime(500).subscribe((value) => {
      this.getOrganizations(this.paginationConfig.currentPage);
    });
  }

  ngAfterViewInit(): void {
    // jquery script below opens up the modal dialog for delete confirmation
    $(document)
      .ready(() => {
        $('.modal')
          .modal();
      });
  }

  getOrganizations(newPage: number): void {
    this.paginationConfig.currentPage = newPage;
    const categories = this.filterForm.value.categories;
    const categoriesParam = [];
    window.scrollTo(0, 0);
    if (categories) {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i]) {
          categoriesParam.push(this.categories[i].value);
        }
      }
    }

    if (this.from === 'organizations') { // from "Organizations" link
      this.organizationsSubscription = this.organizationService.searchOrganizations(
        this.filterForm.value.keyword, null, this.filterForm.value.hasProjects, 'A', categoriesParam, newPage, 10)
        .subscribe(res => {
          this.organizations = res.data;
          this.paginationConfig.totalItems = res.totalItems;
          this.organizationsCache = this.organizations.slice(0);
          res.data.forEach((o: Organization) => {
            this.projectService.getProjectByOrg(o.id, 'A')
              .subscribe(response => {
                this.projects = JSON.parse(JSON.parse(JSON.stringify(response))._body);
                o.projects = this.projects.length;
              },
              error => console.log(error));
          });
        },
        error => console.log(error)
        );
    } else if (this.from === 'approve') { // from "Approve Organizations" link
      this.organizationsSubscription = this.organizationService.searchOrganizations(
        null, null, null, 'P', null, null, null) // Pending organizations
        .subscribe(res => {
          this.pendingOrganizations = res.data;
        },
        error => console.log(error)
        );

      this.organizationsSubscription = this.organizationService.searchOrganizations(
        null, null, null, 'C', null, null, null) // Declined organizations
        .subscribe(res => {
          this.declinedOrganizations = res.data;
        },
        error => console.log(error)
        );
    };
  }

  // pre delete
  confirmDelete(organization: Organization): void {
    this.selectedOrganization = organization;
  }

  onSelect(organization: Organization): void {
    this.selectedOrganization = organization;
    // this.router.navigate(['/organization/view', organization.id]);
  }

  // delete callback
  delete(organization: Organization): void {
    this.organizationService.delete(organization.id)
      .subscribe(
      error => console.log(error)
      );
    // after deletion, the steps below updates the view and excludes the deleted organization
    this.organizations = this.organizations.filter(u => u !== organization);
    // this.pagedItems = this.pagedItems.filter(u => u !== organization);
    if (this.selectedOrganization === organization) {
      this.selectedOrganization = null;
    }
  }

  // edit callback, TODO
  edit(organization: Organization): void {
    this.selectedOrganization = organization;
    this.router.navigate(['/organization/edit', organization.id]);
  }
}
