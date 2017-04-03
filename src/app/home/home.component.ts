import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Project }        from '../project/common/project';
import { ProjectService } from '../project/common/project.service';

@Component({
  selector: 'my-home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  animations: [
    trigger('buttonState', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active',   style({
        transform: 'scale(1.05)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
    trigger('toggleColor',[
      state('1',style({
        color: '#4285f4'
      })),
      state('2',style({
        color: '#f49222'
      })),
      state('3',style({
        color: '#711df7'
      })),
      state('4',style({
        color: '#fc2561'
      })),
      transition('1 => 2', animate('600ms ease-in')),
      transition('2 => 3', animate('600ms ease-in')),
      transition('3 => 4', animate('600ms ease-in')),
      transition('4 => 1', animate('600ms ease-in')),
    ]),
    trigger('cursorFlash',[
      state('inactive',style({
        opacity: 1,
      })),
      state('active',style({
        opacity: 0,
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]

})

export class HomeComponent implements OnInit {

    projects: Project[] = [];
    
    //search button
    state: string = 'inactive';

    //cursor and aniSlogan
    tempWord = '';
    clear = true;
    typeAniIndex = -1;
    typeAniPeriod = 100;
    aniWordGroup = ['interest !','fun~','a better world.','social good !'];
    aniWord = '';
    cursorState: string = 'inactive';
    wordColorIndex = 0;


    constructor(private projectService: ProjectService, private router: Router) {
    }

    //onload animation timer
    ngOnInit(): void {
      let wordTimer = Observable.timer(0,35*this.typeAniPeriod);
      let typeTimer = Observable.timer(0,this.typeAniPeriod);
      let cursorTimer = Observable.timer(0,400);

      wordTimer.subscribe(t=> this.tempWord = this.switchWord(t));
      typeTimer.subscribe(v=> this.aniWord = this.typeWord(v, this.tempWord));
      cursorTimer.subscribe(u=> this.cursorFlash(u));
      
    }

    getProjectsByKeyword(keyword: string) {
      keyword = keyword.trim();
      if (!keyword) { return; }

      this.projectService.getProjectsByKeyword(keyword).subscribe(
          res => {
              this.projects = res;
              this.router.navigate(['/volunteers']);
          },
          error => console.log(error)
      );
    }

    //animation controllers
    // search button
    toggleState() {
      this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    }


    // animation word
    switchWord(time) {
      let index = time%this.aniWordGroup.length;
      this.aniWord = '';
      this.typeAniIndex = -1;
      if(this.wordColorIndex < this.aniWordGroup.length){
        this.wordColorIndex++;
      }else{
        this.wordColorIndex = 1;
      }
      return this.aniWordGroup[index];
    }

    typeWord(time, word: string) {
      let wordArray = word.split('');
      this.typeAniIndex++;
      if (this.aniWord === word) {
        return this.aniWord.concat('');
      }else{
        return this.aniWord.concat(wordArray[this.typeAniIndex]);
      }
    }

    cursorFlash(time) {
      this.cursorState = (this.cursorState === 'inactive' ? 'active' : 'inactive');
    }

}
