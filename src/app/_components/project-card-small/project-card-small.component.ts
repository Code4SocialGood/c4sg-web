import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../project/common/project';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-project-card-small',
  templateUrl: './project-card-small.component.html',
  styleUrls: ['./project-card-small.component.scss']
})
export class ProjectListSmallComponent implements OnInit {
  @Input () project: Project;
  @Input () userProjectStatus: string;
  @Input () from: string;

  constructor(public constantsService: FormConstantsService) { }

  ngOnInit() {
  }
}
