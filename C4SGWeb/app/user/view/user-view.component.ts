import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { User } from '../common/user';
import { UserService } from '../common/user.service';

@Component({
  // moduleId: module.id,
  selector: 'currentUser',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.css']
})

export class UserViewComponent implements OnInit {

  user: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
  }

    ngOnInit(): void {
      let id = this.route.snapshot.params['id'];
      console.log('passed user id is : ' + id);
      this.getUser(id);
    }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      res => {
        this.user = JSON.parse(JSON.parse(JSON.stringify(res))._body);
        console.log(this.user);
      },
      error => console.log(error)
    );
  }

}
