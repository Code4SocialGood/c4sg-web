import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Hero } from '../user/common/hero';
import { ProjectService } from '../project/common/project.service';

@Component({
  selector: 'my-appreciations',
  templateUrl: './appreciations.component.html',
  styleUrls: ['./appreciations.component.scss']
})
export class AppreciationsComponent implements OnInit {

  heroes: Hero[];
  rowsArray:  number[];

  constructor(	private projectService: ProjectService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.projectService.getHeroes()
        .subscribe(
          res =>	{
          this.heroes = res;
          this.rowsArray = Array.from(Array(Math.ceil(this.heroes.length / 3)).keys());
          },
          error =>	console.log(error)
        );
  }

  goBack(): void {
    this.location.back();
  }
}
