import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { User } from '../common/user';
import { UserService } from '../common/user.service';
import { SkillService } from '../../skill/common/skill.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'my-userlist',
  templateUrl: 'user-list.component.html',
  providers: [AuthService],
  styleUrls: ['user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy {
  skillsArray = new FormArray([]);
  filterForm = new FormGroup({
    keyword: new FormControl(''),
    skills: this.skillsArray
  });
  totalItems = 0;
  p = 0;
  keyword: string;
  keywords: any;
  pagedItems: any[]; // paged items
  pager: any = {}; // pager Object
  selectedUser: User;
  skills: any[];
  skillsFilter: string[] = [];
  usersCache: any[];
  users: User[];
  usersSubscription: Subscription;

  constructor(private userService: UserService,
    private router: Router,
    private skillService: SkillService,
    private auth: AuthService) {

  }

  ngOnInit(): void {
    this.getUsers(this.p);
    this.getSkills();
    this.getKeywords();

    // Watch for changes to the form and update the list
    this.filterForm.valueChanges.debounceTime(500).subscribe((value) => {
      this.getUsers(this.p);
    });
  }

  // takes in array of strings and returns array of objects
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

  private getSkills(): void {
    this.skillService.getSkills().subscribe(res => {
      console.log(res);
      this.skills = res.map(skill => {
        this.skillsArray.push(new FormControl(false));
        return { name: skill.skillName, checked: false, id: skill.id };
      });
    },
      error => console.error(error)
    );
  }

  public getUsers(page: number): void {
    const skills = this.filterForm.value.skills;
    const skillsParam = [];

    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        if (skills[i]) {
          skillsParam.push(this.skills[i].id.toString());
        }
      }
    }

    if (this.filterForm.value.keyword != null && skillsParam.length > 0) {
    this.usersSubscription = this.userService.searchUsers(
      page,
      this.filterForm.value.keyword,
      skillsParam
    ).subscribe(
      res => {
        // the called service returns a JSON object
        // consist of the array of pageable data
        // and the total number of data rows
        this.users = res;
        this.totalItems = res.length;
      },
      error => console.error(error)
      );
  }else {
  this.usersSubscription = this.userService.getAllUsers().subscribe(
    res => {
        // the called service returns a JSON object
        // consist of the array of pageable data
        // and the total number of data rows
        this.users = res;
        this.totalItems = res.length;
      },
      error => console.error(error)
      );
  }
  }

  // selection callback
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
