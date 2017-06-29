import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../project/common/project';

@Component({
  selector: 'my-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input () project: Project;

  defaultImage = '../../assets/default_image.png';

  constructor() { }

  ngOnInit() {
  }

}
