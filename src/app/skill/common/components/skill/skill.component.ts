import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'project-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})

export class SkillComponent implements OnInit {
  @Input() projectSkillsArray: string[];
  @Output() onDeleteSkill = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  onDelete(event, projectSkill) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    console.log(projectSkill);
    this.onDeleteSkill.emit(projectSkill);
  }
}
