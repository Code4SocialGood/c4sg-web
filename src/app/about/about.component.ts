import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/common/user.service';
import { Subscription } from 'rxjs/Rx';
import { User } from '../user/common/user';

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  usersSubscription: Subscription;
  developers: User[];

  constructor(
    private uService: UserService
  ) { }

  ngOnInit(): void {
    this.getDevelopers();
  }

  private getDevelopers(): void {
    this.usersSubscription = this.uService.getAllUsers()
    .subscribe(
      res => {
        this.developers = res;
        console.log(this.developers);
      },
      error => console.error(error)
    );
  }
}
