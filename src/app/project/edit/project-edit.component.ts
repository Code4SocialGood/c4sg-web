import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser/';
import { ActivatedRoute } from '@angular/router';

import { ProjectService } from '../common/project.service';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-edit-project',
  templateUrl: 'project-edit.component.html',
  styleUrls: ['project-edit.component.css']
})

export class ProjectEditComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    private projectService: ProjectService,
    private fc: FormConstantsService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

  }

}
