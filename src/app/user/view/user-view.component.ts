import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { User } from '../common/user';
import { UserService } from '../common/user.service';
import { ImageDisplayService } from '../../_services/image-display.service';

@Component({
  // moduleId: module.id,
  selector: 'currentUser',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.css']
})

export class UserViewComponent implements OnInit {

  user: User;
  avatar: any = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private imageDisplay: ImageDisplayService) {
  }

    ngOnInit(): void {
      let id = this.route.snapshot.params['userId'];
      console.log('passed user id is : ' + id);
      this.getUser(id);
      this.getAvatar(id);
    }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      res => {
        this.user = res;
        console.log(this.user);
      },
      error => console.log(error)
    );
  }
  
  getAvatar(id: number){
    this.imageDisplay.displayImage(id,
      this.userService.retrieveAvatar.bind(this.userService))
      .subscribe(res => this.avatar = res.url)
  }

}
