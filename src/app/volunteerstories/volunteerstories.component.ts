import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../_services/validation.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'my-volunteerstories',
  templateUrl: './volunteerstories.component.html',
  styleUrls: ['./volunteerstories.component.scss']
})

export class VolunteerstoriesComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }
}