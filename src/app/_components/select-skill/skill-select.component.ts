import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'my-select-skill',
  templateUrl: './skill-select.component.html',
  styleUrls: ['./skill-select.component.scss']
})

export class SkillSelectComponent implements OnInit {
  @Input() projectSkillsArray: string[];
  @Input() userSkillsArray: string[];
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
