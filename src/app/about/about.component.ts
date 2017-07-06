import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/common/user.service';
import { Subscription } from 'rxjs/Rx';
import { User } from '../user/common/user';
require('./agmMarkerProto.js');


@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  usersSubscription: Subscription;
  developers: User[];
  // google maps zoom level
  zoom = 2;
  // initial center position for the map
  lat = 0;
  lng = 0;
  constructor(
    private uService: UserService
  ) { }

  ngOnInit(): void {
    this.getDevelopers();
  }

  handleMarkerMouseOver(event): void {
    event.target.infoWindow.forEach(function(infoWindow){
      return infoWindow.open();
    })
  }
  handleMarkerMouseOut(event): void {
    event.target.infoWindow.forEach(function(infoWindow){
      return infoWindow.close();
    })
  }

  private getDevelopers(): void {
    this.usersSubscription = this.uService.getAllUsers()
    .subscribe(
      res => {
        this.developers = res;
      },
      error => console.error(error)
    );
  }
}
