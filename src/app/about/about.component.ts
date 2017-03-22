import { Component, OnInit } from '@angular/core';
import { DeveloperService } from './common/developer.service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  usersSubscription: Subscription;
  developers: any[];

  constructor(
    private developerService: DeveloperService,
  ) { }

  ngOnInit(): void {
    this.getDevelopers();
  }

  private getDevelopers(): void {
    this.usersSubscription = this.developerService.getDevelopers().subscribe(
      res => {
        this.developers = res.json();
      },
      error => console.error(error)
    );
  }
}
