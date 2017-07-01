import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {User} from '../common/user';
import {UserService} from '../common/user.service';
import {SkillService} from '../../skill/common/skill.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'my-userlist',
  templateUrl: 'user-list.component.html',
  providers: [AuthService],
  styleUrls: ['user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy {

  roles = [{
    name: 'Developer',
    value: 'D'
  }, {
    name: 'UI/UX Designer',
    value: 'U'
  }, {
    name: 'Tester',
    value: 'Q'
  }, {
    name: 'Architect',
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

  totalItems = 0;
  p = 1;
  keyword: string;
  keywords: any;
  selectedUser: User;
  skillsFilter: string[] = [];
  usersCache: any[];
  users: User[];
  usersSubscription: Subscription;
  defaultAvatar = '../../assets/default_avatar.png';

  constructor(private userService: UserService,
    private router: Router,
    private skillService: SkillService,
    private auth: AuthService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.rolesArray.controls.forEach(roleControl => {
          return roleControl.setValue(false);
        });
        this.skillsArray.controls.forEach(skillControl => {
              return skillControl.setValue(false);
            });
        if (params['from'] === 'reload') {
            this.p = 1;
            this.filterForm.controls.keyword.setValue('');
            this.filterForm.controls.skills = this.skillsArray;
        }
      });
    this.getUsers(this.p);
    this.getSkills();
    this.getKeywords();

    // Watch for changes to the form and update the list
    this.filterForm.valueChanges.debounceTime(500).subscribe((value) => {
      this.getUsers(this.p);
    });
  }

  public getUsers(page: number): void {
    const skills = this.filterForm.value.skills;
    const skillsParam = [];
    window.scrollTo(0, 0);
    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        if (skills[i]) {
          skillsParam.push(this.skills[i].id.toString());
        }
      }
    }

    this.filterForm.value.keyword = this.filterForm.value.keyword.trim();
    this.usersSubscription = this.userService.searchUsers(
      this.filterForm.value.keyword, skillsParam, 'A', 'V', 'Y', page, 10)
      .subscribe(
        res => {
          // the service returns a JSON object consist of the array of pageable data
          this.users = res.data;
          this.totalItems = res.totalItems;
          this.usersCache = this.users.slice(0);
          res.data.forEach((e: User) => {
            this.skillService.getSkillsForUser(e.id).subscribe(
              result => {
                e.skills = result;
              });
          });
        },
        error => console.error(error)
      );
  }

  getSkills(): void {
    this.skillService.getSkills().subscribe(res => {
        this.skills = res.map(skill => {
          return {name: skill.skillName, checked: false, id: skill.id};
        });
        this.showSkills();
      },
      error => console.error(error)
    );
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
