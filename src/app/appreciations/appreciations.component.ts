import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Hero} from '../user/common/hero';
import {ProjectService} from '../project/common/project.service';
import {UserService} from '../user/common/user.service';

@Component({
  selector: 'my-appreciations',
  templateUrl: './appreciations.component.html',
  styleUrls: ['./appreciations.component.scss']
})
export class AppreciationsComponent implements OnInit {

  heroes: Hero[];
  rowsArray: number[];

  constructor(private projectService: ProjectService,
              private userService: UserService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.projectService.getHeroes()
      .subscribe(
        res => {
          this.heroes = res;
          this.heroes.forEach(hero => {
            this.getUser(hero.userId);
          });
          this.rowsArray = Array.from(Array(Math.ceil(this.heroes.length / 3)).keys());
        },
        error => console.log(error)
      );
  }

  /**
   * Getting the user and saving it's data to this.heroes
   * @param {number} id
   */
  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      res => {
        const user = res;
        this.heroes = this.heroes.map(function (hero) {
          if (hero.userId === user.id) {
            hero.introduction = user.introduction;
          }
          return hero;
        });
      },
      error => console.log(error)
    );
  }

  goBack(): void {
    this.location.back();
  }
}
