import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { User } from '../common/user';
import { UserService } from '../common/user.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'my-userlist',
  templateUrl: 'user-list.component.html',
  providers: [AuthService],
  styleUrls: ['user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy {
  totalItems = 0;
  p = 0;
  keywords: any;
  pagedItems: any[]; // paged items
  pager: any = {}; // pager Object
  selectedUser: User;
  skills: any[];
  skillsFilter: string[] = [];
  titles: any[];
  titlesFilter: string[] = [];
  usersCache: any[];
  users: User[];
  usersSubscription: Subscription;

  constructor(private userService: UserService,
              private router: Router,
              private auth: AuthService) {

  }

  ngOnInit(): void {
    this.getUsers(1);
    this.getSkills();
    this.getTitles();
    this.getKeywords();
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
    // TODO: wire this up with userService when getSkills is available
    // this.skills = this.createCheckBoxObj(['skill 1', 'skill 2', 'skill 3', 'skill 4']);
    this.userService.getSkills().subscribe(res => {
      console.log(res);
      this.skills  = res.map(skill => {
        return {name: skill.skillName, checked: false}; });
    },
      error => console.error(error)
    );
  }

  private getTitles(): void {
    // TODO: wire this up with userService when getTitles is available
    this.titles = this.createCheckBoxObj(['title 1', 'title 2', 'title 3', 'title 4']);
  }


  public getUsers(page: number): void {
    this.usersSubscription = this.userService.getUsers(page)
                                 .subscribe(
                                   res => {
                                     // the called service returns a JSON object
                                     // consist of the array of pageable data
                                     // and the total number of data rows
                                     this.users = res.data;
                                     this.totalItems = res.totalItems;
                                     this.usersCache = this.users.slice(0);
                                   },
                                   error => console.error(error)
                                 );
  }

  // filter this.users based on search option checkboxes
  private filterUsers(): void {
    // TODO
    // user this.skillsFilter and this.titlesFilter to select from this.users
    // for example,
    this.users.filter(selectUser);

    function selectUser(user): boolean {
      let searching = true;
      let idx = 0;

      // select everything
      if (this.titlesFilter.length === 0 && this.skillsFilter.length === 0) {
        return true;
      }

      // title match
      if (this.titlesFilter.indexOf(user.title) !== -1) {
        return true;
      }

      // skills match (assumes skills array)
      while (searching) {
        const found = this.user.skills.indexOf(this.skillsFilter[idx]) !== -1;
        if (found) {
          searching = false;
          return true;
        }

        idx += 1;
      }
    }
  }

  getUsersByKeyword(userName: string, firstName: string, lastname: string): void {
    if (userName || firstName || lastname) {
      // TODO: Verify this works when REST API finished
      this.userService
          .getUsersByKeyword(userName, firstName, lastname)
          .subscribe(
            res => this.users = res,
            error => console.error(error)
          );
    }
  }

  // takes in array index and category array (title / skill)
  onCheck(id: number, category: string): void {
    this[category][id].checked = !this[category][id].checked;

    if (this.titlesFilter.length > 0 || this.skillsFilter.length > 0) { // if
      this.filterUsers();
    } else {
      this.resetUsers();
    }
  }

  // selection callback
  onSelect(user: User): void {
    this.selectedUser = user;
    this.router.navigate(['user/view', user.id]);
  }

  resetUsers(): void {
    this.users = this.usersCache.slice(0);
  }

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
