import { AfterViewChecked, Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { AuthService } from '../../auth.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { SkillService } from '../../skill/common/skill.service';
import { User } from '../../user/common/user';

import { MyPaginationControlsComponent } from '../../_components/my-pagination-controls/my-pagination-controls.component';
import { PaginationInstance } from 'ngx-pagination';

declare const Materialize: any;

@Component({
  selector: 'my-projects',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.scss']
})

export class ProjectListComponent implements AfterViewChecked, OnInit, OnDestroy {

  paginationConfig: PaginationInstance;

  skills: any[];
  skillsShowed = [];
  skillsArray = new FormArray([]);
  jobTitlesShowed = [];
  jobTitleFormArray = new FormArray([]);
  jobTitles: any[];

  filterForm = new FormGroup({
    keyword: new FormControl(''),
    jobTitles: this.jobTitleFormArray,
    skills: this.skillsArray
  });

  projects: Project[];
  selectedProject: Project;
  projectsCache: any[];
  projectsSubscription: Subscription;
  userId: number;
  from: string;
  isVolunteer = false;
  isNonprofit = false;

  constructor(private projectService: ProjectService,
    private organizationService: OrganizationService,
    private router: Router,
    public auth: AuthService,
    private route: ActivatedRoute,
    private skillService: SkillService) {
    this.paginationConfig = {
      id: 'projectsPages',
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
  }

  ngAfterViewChecked(): void {
    // Work around for bug in Materialize library, form labels overlap prefilled inputs
    // See https://github.com/InfomediaLtd/angular2-materialize/issues/106
    if (Materialize && Materialize.updateTextFields) {
      Materialize.updateTextFields();
    }
  }

  ngOnInit(): void {
    this.userId = +this.auth.getCurrentUserId();
    localStorage.setItem('prevPage', '');
    this.route.params.subscribe(
      params => {
        this.skillsArray.controls.forEach(skillControl => {
          return skillControl.setValue(false);
        });
        this.jobTitleFormArray.controls.forEach(jobTitleControl => {
          return jobTitleControl.setValue(false);
        });
        this.from = params['from'];
        if (this.from === 'reload') {
          this.paginationConfig.currentPage = 1;
          this.filterForm.controls.keyword.setValue('');
          // this.filterForm.controls.jobTitle.setValue(false);
          this.filterForm.controls.skills = this.skillsArray;
          this.filterForm.controls.jobTitles = this.jobTitleFormArray;
          localStorage.setItem('prevPage', 'ProjectList');
        }
        if (this.from === 'projects') {
          localStorage.setItem('prevPage', 'ProjectList');
        }
        if (this.from === 'myProjects') {
          localStorage.setItem('prevPage', '');
        }
        this.getProjects(this.paginationConfig.currentPage);
      });

    this.route.queryParams.subscribe(params => {
      if (params.keyword) {
        this.filterForm.controls.keyword.setValue(params.keyword);
      }
    });

    this.getSkills();
    this.getJobTitles();
    // Watch for changes to the form and update the list
    this.filterForm.valueChanges.debounceTime(500).subscribe((value) => {
      this.getProjects(this.paginationConfig.currentPage);
    });
  }

  getProjects(newPage: number): void {
    this.paginationConfig.currentPage = newPage;
    // Issue#300 - resetting form before reloading page to display all items
    // this.filterForm.reset();
    window.scrollTo(0, 0);
    if (this.from === 'projects') { // Projects Menu Item
      const skills = this.filterForm.value.skills;
      // const jobTitle = this.filterForm.value.jobTitle;
      const jobTitles = this.filterForm.value.jobTitles;
      const skillsParam = [];
      const jobTitlesParam = [];
      if (skills) {
        for (let i = 0; i < skills.length; i++) {
          if (skills[i]) {
            skillsParam.push(this.skills[i].id.toString());
          }
        }
      }
      if (jobTitles) {
        for (let i = 0; i < jobTitles.length; i++) {
          if (jobTitles[i]) {
            jobTitlesParam.push(this.jobTitles[i].id.toString());
          }
        }
      }
      this.filterForm.value.keyword = this.filterForm.value.keyword.trim();
      this.projectsSubscription = this.projectService.searchProjects(
        // this.filterForm.value.keyword, jobTitle, skillsParam, 'A', null, page, 10)
        this.filterForm.value.keyword, jobTitlesParam, skillsParam, 'A', null, newPage, 10)
        .subscribe(
        res => {
          this.projects = res.data;
          this.paginationConfig.totalItems = res.totalItems;
          this.projectsCache = this.projects.slice(0);
          res.data.forEach((e: Project) => {
            this.skillService.getSkillsByProject(e.id).subscribe(
              result => {
                e.skills = result;
              });
          });
        },
        error => console.log(error)
        );

    } else if ((this.from === 'myProjects') && (this.auth.isVolunteer())) { // Volunteer user: My Projects
      this.isVolunteer = true;
    } else if ((this.from === 'myProjects') && (this.auth.isOrganization())) { // Nonprofit user: My Projects
      this.isNonprofit = true;
    }
  }

  getSkills(): void {
    this.skillService.getSkills().subscribe(res => {
      this.skills = res.map(skill => {
        return { name: skill.skillName, checked: false, id: skill.id };
      });
      this.showSkills();
    },
      error => console.error(error)
    );
  }

  getJobTitles(): void {
    this.projectService.getAllJobTitles().subscribe(res => {
      this.jobTitles = res.map(jobtitle => {
        return { id: jobtitle.id, checked: false, jobtitle: jobtitle.jobTitle };
      });
      this.showJobTitles();
    },
      error => console.error(error)
    );
  }

  showSkills(): void {
    const addedSkills = this.skills;
    for (const addedSkill of addedSkills) {
      this.skillsShowed.push(addedSkill);
      this.skillsArray.push(new FormControl(false));
    }
  }

  showJobTitles(): void {
    let addedJobTitles;
    if (this.jobTitlesShowed.length < this.jobTitles.length) {
      if (!this.jobTitlesShowed.length) {
        addedJobTitles = this.jobTitles.slice(0, 10);
      } else {
        addedJobTitles = this.jobTitles
          .filter(i => !this.jobTitlesShowed.includes(i));
        addedJobTitles = addedJobTitles.filter((i, index) => index < 10);
      }
      for (const addedJobTitle of addedJobTitles) {
        this.jobTitlesShowed.push(addedJobTitle);
        this.jobTitleFormArray.push(new FormControl(false));
      }
    }
  }

  onSelect(project: Project): void {
    this.selectedProject = project;
    this.router.navigate(['/project/view', project.id]);
  }

  defineUserProjectStatus(projectID) {
    if (this.auth.isVolunteer()) {
      const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();
      if (projectsIDs != null) {
        if (projectsIDs.acceptedProjectsIDs !== null
          && projectsIDs.acceptedProjectsIDs.split(',').includes(projectID.toString())) {
          return 'accepted';
        } else if (projectsIDs.declinedProjectsIDs !== null
          && projectsIDs.declinedProjectsIDs.split(',').includes(projectID.toString())) {
          return 'declined';
        } else if (projectsIDs.appliedProjectsIDs !== null
          && projectsIDs.appliedProjectsIDs.split(',').includes(projectID.toString())) {
          return 'applied';
        } else if (projectsIDs.bookmarkedProjectsIDs !== null
          && projectsIDs.bookmarkedProjectsIDs.split(',').includes(projectID.toString())) {
          return 'bookmarked';
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }
}
