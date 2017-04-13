import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'project-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit {
  public skills = ['HTML', 'CSS', 'JavaScript'];

  constructor() { }

  ngOnInit() {
  }

  skillsInit = {
    data: [{
      tag: 'Apple',
    }, {
      tag: 'Microsoft',
    }, {
      tag: 'Google',
    }],
  };

  chipsPlaceholder = {
    placeholder: '+Tag',
    secondaryPlaceholder: 'Enter a tag',
  };

  add(chip) {
    console.log("Chip added: " + chip.tag);
  }

  delete(chip) {
    console.log("Chip deleted: " + chip.tag);
  }

  select(chip) {
    console.log("Chip selected: " + chip.tag);
  }

}
