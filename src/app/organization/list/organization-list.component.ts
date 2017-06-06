import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Organization } from '../common/organization';
import { OrganizationService } from '../common/organization.service';
import { Project } from '../../project/common/project';
import { ProjectService } from '../../project/common/project.service';
import { ImageDisplayService } from '../../_services/image-display.service';

declare const $: Function;

@Component({
  selector: 'my-organizations',
  templateUrl: 'organization-list.component.html',
  styleUrls: ['organization-list.component.scss']
})

export class OrganizationListComponent implements OnInit, AfterViewInit {
  categories = [{
    name: 'Nonprofit'
  }, {
    name: 'Open Source'
  }, {
    name: 'Social Enterprise'
  }, {
    name: 'Team Project'
  }];

  filterForm = new FormGroup({
    keyword: new FormControl(''),
    hasProjects: new FormControl(false),
    categories: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ])
  });
  p = 0;
  organizations: Object[];
  selectedOrganization?: Organization;
  projects: Project[];
  from: string;
  defaultAvatarOrganization = '../../assets/default_image.png';
  // array of all items to be paged
  //   organizations: any[];


  constructor(
    private idService: ImageDisplayService,
    private organizationService: OrganizationService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(
      params => {
        this.from = params['from'];
        this.getOrganizations();
      });

    // Watch for changes to the form and update the list
    this.filterForm.valueChanges.debounceTime(500).subscribe((value) => {
      this.getOrganizations();
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

  getOrganizations() {

    const categories = this.filterForm.value.categories;
    const categoriesParam = [];

    if (categories) {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i]) {
          categoriesParam.push(this.categories[i].name);
        }
      }
    }

    if (this.from === 'organizations') { // from "Organizations" link
      this.organizationService.searchOrganizations(
        this.filterForm.value.keyword,
        this.filterForm.value.hasProjects,
        categoriesParam
      ).subscribe( res => {
        this.organizations = res;
        res.forEach((o: Organization) => {
          this.idService.displayImage(o.id,
          this.organizationService.retrieveLogo.bind(this.organizationService))
          .subscribe(logo => {
            // o.logo = logo.url;
          });

          this.projectService.getProjectByOrg(o.id)
            .subscribe( response => {
                this.projects = JSON.parse(JSON.parse(JSON.stringify(response))._body);
                o.projects = this.projects.length;
                     },
              error => console.log(error));
        });
      },
        error => console.log(error)
      );
    } else if (this.from === 'approve') { // from "Approve Organizations" link
      this.organizationService.searchOrganizations(
      ).subscribe( res => {
        this.organizations = res;
        res.forEach((o: Organization) => {
          this.idService.displayImage(o.id,
          this.organizationService.retrieveLogo.bind(this.organizationService))
          .subscribe(logo => {
            // o.logo = logo.url;
          });

          this.projectService.getProjectByOrg(o.id)
            .subscribe( response => {
                this.projects = JSON.parse(JSON.parse(JSON.stringify(response))._body);
                o.projects = this.projects.length;
                     },
              error => console.log(error));
        });
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
