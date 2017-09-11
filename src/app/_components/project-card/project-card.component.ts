import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../project/common/project';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input () project: Project;
  @Input () userProjectStatus: string;
  @Input () from: string;

  constructor(public constantsService: FormConstantsService) { }

  ngOnInit() {
  }
}
