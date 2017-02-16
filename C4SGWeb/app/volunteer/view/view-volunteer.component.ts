import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Volunteer } from '../volunteer';
import { VolunteerService } from '../volunteer.service';

@Component({
  selector: 'view-volunteer',
  templateUrl: './view-volunteer.component.html',
  styleUrls: ['./view-volunteer.component.css']
})

export class ViewVolunteerComponent implements OnInit {

  volunteer: Volunteer;
  params: Params;

  constructor(private volunteerService: VolunteerService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit(): void {

    this.route.params.forEach((params: Params) => {

      let id = +params['id'] - 1;

      this.volunteerService.getVolunteer(id).subscribe(
        res => {
          this.volunteer = JSON.parse(JSON.parse(JSON.stringify(res))._body);
        },
        error => console.log(error)
      );
    });
  }

  goBack(): void {
    this.location.back();
  }

}
