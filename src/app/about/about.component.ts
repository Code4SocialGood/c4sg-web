import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/common/user.service';
import { Subscription } from 'rxjs/Rx';
import { User } from '../user/common/user';
require('./agmMarkerProto.js');


@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  usersSubscription: Subscription;
  developers: User[];
  // google maps zoom level
  zoom = 2;
  // initial center position for the map
  lat = 0;
  lng = 0;
  activeInfoWindow = null;

  constructor(
    private uService: UserService
  ) { }

  ngOnInit(): void {
    this.getDevelopers();
  }

  handleMarkerMouseOver(event): void {
    if (this.activeInfoWindow) {
      this.activeInfoWindow.forEach(function(infoWindow){
        return infoWindow.close();
      });
    }

    const window = event.target.infoWindow;
    this.activeInfoWindow = window;
    window.forEach(function(infoWindow){
      return infoWindow.open();
    });
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
