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

  roles = [{
    name: 'Developer',
    value: 'D'
  }, {
    name: 'UI/UX Designer',
    value: 'U'
  }, {
    name: 'QA Engineer',
    value: 'Q'
  }, {
    name: 'Software Architect',
    value: 'A'
  }, {
    name: 'Build & Release Engineer',
    value: 'E'
  }, {
    name: 'Business Analyst',
    value: 'B'
  }, {
    name: 'Project Manager',
    value: 'P'
  }, {
    name: 'Sales & Marketing',
    value: 'S'
  }];


  rolesArray = new FormArray([
    new FormControl(false),
    new FormControl(false),
    new FormControl(false),
    new FormControl(false),
    new FormControl(false),
    new FormControl(false),
    new FormControl(false),
    new FormControl(false)
  ]);

  skills: any[];
  skillsShowed = [];
  skillsArray = new FormArray([]);
  filterForm = new FormGroup({
    keyword: new FormControl(''),
    roles: this.rolesArray,
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
        this.rolesArray.controls.forEach(roleControl => {
          return roleControl.setValue(false);
        });
        this.skillsArray.controls.forEach(skillControl => {
          return skillControl.setValue(false);
        });
        this.from = params['from'];
        if (this.from === 'reload') {
          this.p = 1;
          this.filterForm.controls.keyword.setValue('');
          this.filterForm.controls.roles = this.rolesArray;
          this.filterForm.controls.skills = this.skillsArray;
        }
        this.getProjects(this.p);
      });

    this.route.queryParams.subscribe(params => {
      if (params.keyword) {
        this.filterForm.controls.keyword.setValue(params.keyword);
      }
    });

    this.getSkills();

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
      const skillsParam = [];

      if (skills) {
        for (let i = 0; i < skills.length; i++) {
          if (skills[i]) {
            skillsParam.push(this.skills[i].id.toString());
          }
        }
      }
      this.filterForm.value.keyword = this.filterForm.value.keyword.trim();
      this.projectsSubscription = this.projectService.searchProjects(
        this.filterForm.value.keyword, skillsParam, 'A', null, page, 10)
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
        this.getProjects(this.p);
        this.router.navigate(['/organization/list']);
      },
      error => console.log(error)
      );
  }

  defineUserProjectStatus(projectID) {
    if (this.auth.isVolunteer()) {
      const projectsIDs = this.projectService.getUserProjectStatusFromLocalStorage();
      if (projectsIDs.appliedProjectsIDs != null && projectsIDs.appliedProjectsIDs.includes(projectID)) {
        return 'applied';
      } else if (projectsIDs.bookmarkedProjectsIDs != null && projectsIDs.bookmarkedProjectsIDs.includes(projectID)) {
        return 'bookmarked';
      } else if (projectsIDs.acceptedProjectsIDs !== null && projectsIDs.acceptedProjectsIDs.includes(projectID)) {
        return 'accepted';
      } else if (projectsIDs.declinedProjectsIDs !== null && projectsIDs.declinedProjectsIDs.includes(projectID)) {
        return 'declined';
      }
    }
  }

  delete(project: Project): void {
    this.projectService
      .delete(project.id)
      .subscribe(
      response => { // An error occurred SyntaxError: Unexpected end of JSON input
        this.getProjects(this.p);
        this.router.navigate(['/organization/list']);
      },
      error => console.log(error)
      );
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }

}
