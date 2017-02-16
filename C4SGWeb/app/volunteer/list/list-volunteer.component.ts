import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Volunteer } from '../volunteer';
import { VolunteerService } from '../volunteer.service';

@Component({
  selector: 'my-volunteers',
  templateUrl: './list-volunteer.component.html',
  styleUrls: ['./list-volunteer.component.css']
})

export class ListVolunteerComponent implements OnInit {

  volunteers: Object[];
  selectedVolunteer: Volunteer;

  constructor(private volunteerService: VolunteerService, private router: Router) {
  }

  ngOnInit(): void {
     this.getVolunteers();
  }

  getVolunteers() {
    this.volunteerService.getVolunteers().subscribe(
      res => {
        this.volunteers = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      },
      error => console.log(error)
    );
  }

  getVolunteersByKeyword(keyword: string) {
    keyword = keyword.trim();
    if (!keyword) {
      return;
    }
    /*  Property 'getUsersByKeyword' does not exist on type 'VolunteerService'
    this.volunteerService.getUsersByKeyword(keyword).subscribe(
      res => {
        this.volunteers = JSON.parse(JSON.parse(JSON.stringify(res))._body);
        this.router.navigate(['/volunteers']);
      },
      error => console.log(error)
    );*/
  }

  onSelect(volunteer: Volunteer): void {
    this.selectedVolunteer = volunteer;
    this.router.navigate(['/view-volunteer', volunteer.id]);
  }
}
