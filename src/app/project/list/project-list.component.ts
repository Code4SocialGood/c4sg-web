import {AfterViewChecked, Component, OnInit, OnDestroy} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {Project} from '../common/project';
import {ProjectService} from '../common/project.service';
import {AuthService} from '../../auth.service';
import {OrganizationService} from '../../organization/common/organization.service';
import {SkillService} from '../../skill/common/skill.service';
import {User} from '../../user/common/user';
import {ImageDisplayService} from '../../_services/image-display.service';
import {DataService} from '../../_services/data.service';

declare const Materialize: any;

@Component({
  selector: 'my-projects',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.scss']
})

export class ProjectListComponent implements AfterViewChecked, OnInit, OnDestroy {

  skillsArray = new FormArray([]);
  filterForm = new FormGroup({
    keyword: new FormControl(''),
    skills: this.skillsArray
  });
  p = 0;
  projects: Project[];
  users: User[];
  selectedProject: Project;
  pagedItems: any[]; // paged items
  pager: any = {}; // pager Object
  projectsSubscription: Subscription;
  userId: number;
  orgId: number;
  from: string;
  userProjectStatus = 'A';
  skills: any[];

  constructor(private projectService: ProjectService,
              private organizationService: OrganizationService,
              private dataService: DataService,
              private router: Router,
              private auth: AuthService,
              private route: ActivatedRoute,
              private skillService: SkillService,
              private idService: ImageDisplayService) {
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
        this.from = params['from'];
        this.getProjects();
      });

    this.route.queryParams.subscribe(params => {
      if (params.keyword) {
        this.filterForm.controls.keyword.setValue(params.keyword);
      }
    });

    this.getSkills();

    // Watch for changes to the form and update the list
    this.filterForm.valueChanges.debounceTime(500).subscribe((value) => {
      if (value.keyword || value.skills.some(i => i))
        this.filterProjects();
    });
  }

  getProjects(): void {

    if (this.from === 'opportunities') {
      this.projectsSubscription = this.projectService.getActiveProjects().subscribe(
        res => this.projects = res,
        error => console.log(error));

    } else if ((this.auth.isVolunteer()) && (this.from === 'myProjects')) {
      this.projectsSubscription = this.projectService.getProjectByUser(this.userId, this.userProjectStatus).subscribe(
        res => this.projects = JSON.parse(JSON.parse(JSON.stringify(res))._body),
        error => console.log(error));
    } else if ((this.auth.isOrganization()) && (this.from === 'myProjects')) {
      this.organizationService.getUserOrganization(this.userId).subscribe(
        response => {
          this.orgId = response.reduce((acc) => acc).id;
          this.projectsSubscription = this.projectService.getProjectByOrg(this.orgId).subscribe(
            res => {
              this.projects = res.json();
            },
            error => console.log(error)
          );
        },
        error => console.log(error)
      );
      console.log('inside myprojects')
    }
  }

  filterProjects() {
    const skills = this.filterForm.value.skills;
    const skillsParam = [];

    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        if (skills[i]) {
          skillsParam.push(this.skills[i].id.toString());
        }
      }
    }

    this.projectsSubscription = this.projectService
      .searchProjects(this.filterForm.value.keyword, skillsParam, 'A')
      .subscribe(
        res => {
          this.projects = res;
          res.forEach((e: Project) => {
            this.idService.displayImage(e.id,
              this.projectService.retrieveImage.bind(this.projectService))
              .subscribe(image => {
                e.image = image.url;
              });
          });
        },
        error => console.log(error)
      );
  }

  getSkills(): void {
    this.skillService.getSkills().subscribe(res => {
        console.log(res);
        this.skills = res.map(skill => {
          this.skillsArray.push(new FormControl(false));
          return {name: skill.skillName, checked: false, id: skill.id};
        });
      },
      error => console.error(error)
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
          this.router.navigate(['/organization/list']);
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
