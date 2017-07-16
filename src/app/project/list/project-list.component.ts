import { AfterViewChecked, Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormConstantsService } from '../../_services/form-constants.service';
import { Project } from '../common/project';
import { ProjectService } from '../common/project.service';
import { AuthService } from '../../auth.service';
import { OrganizationService } from '../../organization/common/organization.service';
import { SkillService } from '../../skill/common/skill.service';
import { User } from '../../user/common/user';
import { DataService } from '../../_services/data.service';

declare const Materialize: any;

@Component({
  selector: 'my-projects',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.scss']
})

export class ProjectListComponent implements AfterViewChecked, OnInit, OnDestroy {

  roles: any[];

  skills: any[];
  skillsShowed = [];
  skillsArray = new FormArray([]);
  jobTitlesShowed = [];
  jobTitleFormArray = new FormArray([]);
  jobTitles: any[];

  filterForm = new FormGroup({
    keyword: new FormControl(''),
    // jobTitle: new FormControl(false),
    jobTitles: this.jobTitleFormArray,
    skills: this.skillsArray
  });

  p = 1; // Holds page number
  projects: Project[];
  bookmarkedProjects: Project[];
  acceptedProjects: Project[];
  declinedProjects: Project[];
  appliedProjects: Project[];
  activeProjects: Project[];
  closedProjects: Project[];
  temp: any[];
  users: User[];
  selectedProject: Project;
  totalItems = 0;
  projectsCache: any[];
  projectsSubscription: Subscription;
  userId: number;
  orgId: number;
  projId: number;
  from: string;
  isVolunteer = false;
  isNonprofit = false;

  constructor(private projectService: ProjectService,
    private organizationService: OrganizationService,
    private dataService: DataService,
    public constantsService: FormConstantsService,
    private router: Router,
    public auth: AuthService,
    private route: ActivatedRoute,
    private skillService: SkillService) {
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
          this.p = 1;
          this.filterForm.controls.keyword.setValue('');
          // this.filterForm.controls.jobTitle.setValue(false);
          this.filterForm.controls.skills = this.skillsArray;
          this.filterForm.controls.jobTitles = this.jobTitleFormArray;
        }
        this.getProjects(this.p);
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
      this.getProjects(this.p);
    });
  }

  getProjects(page: number): void {
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
        this.filterForm.value.keyword, jobTitlesParam, skillsParam, 'A', null, page, 10)
        .subscribe(
        res => {
          this.projects = res.data;
          this.totalItems = res.totalItems;
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
      this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'B').subscribe(
        res => this.bookmarkedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
        error => console.log(error));
      this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'A').subscribe(
        res => this.appliedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
        error => console.log(error));
      this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'C').subscribe(
        res => this.acceptedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
        error => console.log(error));
      this.projectsSubscription = this.projectService.getProjectByUser(this.userId, 'D').subscribe(
        res => this.declinedProjects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
        error => console.log(error));

    } else if ((this.from === 'myProjects') && (this.auth.isOrganization())) { // Nonprofit user: My Projects
      this.isNonprofit = true;
      this.organizationService.getUserOrganization(this.userId).subscribe(
        response => {
          this.orgId = response.reduce((acc) => acc).id;
          // Returns project of any status: 'A' and' 'C'
          this.projectsSubscription = this.projectService.getProjectByOrg(this.orgId, null).subscribe(
            res => {
              this.projects = res.json();
              this.totalItems = this.projects.length;
              this.projects.forEach((e: Project) => {
                this.skillService.getSkillsByProject(e.id).subscribe(
                  result => {
                    e.skills = result;
                  });
              });
              this.activeProjects = this.projects.filter((project) => project.status === 'A');
              this.closedProjects = this.projects.filter((project) => project.status === 'C');
            },
            error => console.log(error)
          );
        },
        error => console.log(error)
      );
    }
    ;
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

  /* getJobTitles(): void {
     this.projectService.getAllJobTitles().subscribe(res => {
         this.roles = res.map(role => {
           return {name: role.jobTitle, checked: false, id: role.id};
         });
       },
       error => console.error(error)
     );
   }*/

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
    let addedSkills;
    if (this.skillsShowed.length < this.skills.length) {
      if (!this.skillsShowed.length) {
        addedSkills = this.skills.slice(0, 10);
      } else {
        addedSkills = this.skills
          .filter(i => !this.skillsShowed.includes(i));
        addedSkills = addedSkills.filter((i, index) => index < 10);
      }
      for (const addedSkill of addedSkills) {
        this.skillsShowed.push(addedSkill);
        this.skillsArray.push(new FormControl(false));
      }
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
      if (projectsIDs.appliedProjectsIDs !== null && projectsIDs.appliedProjectsIDs.includes(projectID)) {
        return 'applied';
      } else if (projectsIDs.bookmarkedProjectsIDs !== null && projectsIDs.bookmarkedProjectsIDs.includes(projectID)) {
        return 'bookmarked';
      } else if (projectsIDs.acceptedProjectsIDs !== null && projectsIDs.acceptedProjectsIDs.includes(projectID)) {
        return 'accepted';
      } else if (projectsIDs.declinedProjectsIDs !== null && projectsIDs.declinedProjectsIDs.includes(projectID)) {
        return 'declined';
      }
    }
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }

}
