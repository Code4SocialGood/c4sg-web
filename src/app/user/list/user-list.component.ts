import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormConstantsService } from '../../_services/form-constants.service';
import { User } from '../common/user';
import { Project } from '../../project/common/project';
import { JobTitle } from '../../job-title';
import { UserService } from '../common/user.service';
import { ProjectService} from '../../project/common/project.service';
import { SkillService } from '../../skill/common/skill.service';
import { AuthService } from '../../auth.service';

import { MyPaginationControlsComponent } from '../../_components/my-pagination-controls/my-pagination-controls.component';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'my-userlist',
  templateUrl: 'user-list.component.html',
  providers: [AuthService],
  styleUrls: ['user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy {

  paginationConfig: PaginationInstance;

  skills: any[];
  skillsShowed = [];
  skillsArray = new FormArray([]);
  jobTitlesShowed = [];
  jobTitleFormArray = new FormArray([]);
  jobTitles: any[];
  countriesShowed = [];
  countriesArray = new FormArray([]);
  countries: any[];
  projects: any[];

  filterForm = new FormGroup({
    keyword: new FormControl(''),
    jobTitles: this.jobTitleFormArray,
    skills: this.skillsArray,
    countries: this.countriesArray
  });

  keyword: string;
  keywords: any;
  selectedUser: User;
  skillsFilter: string[] = [];
  // jobTitleFilter: string[] = [];
  usersCache: any[];
  users: User[];
  usersSubscription: Subscription;
  constructor(private userService: UserService,
    private router: Router,
    private projectService: ProjectService,
    private skillService: SkillService,
    public constantsService: FormConstantsService,
    public auth: AuthService,
    private route: ActivatedRoute) {
    this.paginationConfig = {
      id: 'usersPages',
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
  }

  slice(str: string): string {
    const maxLength = 200;
    const trimmedString = str.substr(0, maxLength);

    // re-trim if we are in the middle of a word
    return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {

        this.skillsArray.controls.forEach(skillControl => {
          return skillControl.setValue(false);
        });

        this.jobTitleFormArray.controls.forEach(jobTitleControl => {
          return jobTitleControl.setValue(false);
        });

        this.countriesArray.controls.forEach(countryControl => {
          return countryControl.setValue(false);
        });
        if (params['from'] === 'reload') {
          localStorage.setItem('prevPage', 'UserList');
          this.paginationConfig.currentPage = 1;
          this.filterForm.controls.keyword.setValue('');
          this.filterForm.controls.skills = this.skillsArray;
          this.filterForm.controls.jobTitles = this.jobTitleFormArray;
          this.filterForm.controls.countries = this.countriesArray;
        }
      });
    this.getUsers(this.paginationConfig.currentPage);
    this.getSkills();
    this.getKeywords();
    this.getJobTitles();
    this.countries = this.constantsService.getCountries();
    this.getCountries();
    // Watch for changes to the form and update the list
    this.filterForm.valueChanges.debounceTime(500).subscribe((value) => {
      localStorage.setItem('prevPage', 'UserList');
      this.getUsers(this.paginationConfig.currentPage);
    });
  }

  public getUsers(newPage: number): void {
    this.paginationConfig.currentPage = newPage;
    const skills = this.filterForm.value.skills;
    const jobTitles = this.filterForm.value.jobTitles;
    const countries = this.filterForm.value.countries;
    const skillsParam = [];
    const jobTitlesParam = [];
    const countriesParam = [];
    window.scrollTo(0, 0);
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
    if (countries) {
      for (let i = 0; i < countries.length; i++) {
        if (countries[i]) {
          countriesParam.push(this.countries[i].code);
        }
      }
    }
    this.filterForm.value.keyword = this.filterForm.value.keyword.trim();
    this.usersSubscription = this.userService.searchUsers(
      this.filterForm.value.keyword, jobTitlesParam, skillsParam, countriesParam, 'A', 'V', 'Y', newPage, 10)
      .subscribe(
      res => {
        // the service returns a JSON object consist of the array of pageable data
        this.users = res.data;
        this.paginationConfig.totalItems = res.totalItems;
        this.usersCache = this.users.slice(0);
        res.data.forEach((e: User) => {
          this.skillService.getSkillsForUser(e.id).subscribe(
            result => {
              e.skills = result;
            });
          this.projectService.getProjectByUser(e.id, 'C').subscribe(
            result => {
              e.projects = result.json();
            }
          );
        });
      },
      error => console.error(error)
      );
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
    this.userService.getAllJobTitles().subscribe(res => {
      this.jobTitles = res.map(jobtitle => {
        return { id: jobtitle.id, checked: false, jobtitle: jobtitle.jobTitle };
      });
      this.showJobTitles();

    },
      error => console.error(error)
    );
  }
  getCountries(): void {
    this.showCountries();
  }
  getKeywords(): void {
    // TODO: Need REST API & userService to provide a list of getKeywords
    // to work with autocomplete in the search box (so user doesn't have to guess)
    // this is the format angular2-materialize expects
    this.keywords = [
      {
        'data': {
          'keyword1': null,
          'keyword2': null,
          'javascript': null,
          'angular': null,
        }
      }
    ];
  }

  private createCheckBoxObj(arr) {
    return arr.map(
      val => {
        return {
          name: val,
          checked: false
        };
      }
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
  showCountries(): void {
    const addedCountries = this.countries;
    for (const addedCountry of addedCountries) {
      this.countriesShowed.push(addedCountry);
      this.countriesArray.push(new FormControl(false));
    }
  }

  onSelect(user: User): void {
    this.selectedUser = user;
    this.router.navigate(['user/view', user.id]);
  }

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
