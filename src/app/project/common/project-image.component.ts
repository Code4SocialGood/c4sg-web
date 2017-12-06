import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../project/common/project';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-project-image',
  template: `<img [ngClass]="cssClass" [src]="imageUrl">`,
  styleUrls: [ './project-image.component.scss' ]
})
export class ProjectImageComponent implements OnInit {

  @Input() project: Project;
  @Input() cssClass: string;

  constructor(public constantsService: FormConstantsService) { }

  ngOnInit() {
  }

  get imageUrl() {
    if ( this.project.imageUrl ) {
      return this.project.imageUrl;
    } else if ( this.project.organizationLogoUrl ) {
      return this.project.organizationLogoUrl;
    } else {
      return this.constantsService.defaultImage;
    }
  }
}
