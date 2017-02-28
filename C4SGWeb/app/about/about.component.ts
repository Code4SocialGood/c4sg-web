import { Component, OnInit } from '@angular/core';
declare const google: any;

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    var destination = {lat: 41.779, lng: -88.207};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: destination
    });
    var marker = new google.maps.Marker({
      position: destination,
      map: map
    });
  }
}
