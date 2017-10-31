import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../_services/validation.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'my-nonprofitstories',
  templateUrl: './nonprofitstories.component.html',
  styleUrls: ['./nonprofitstories.component.scss']
})

export class NonprofitstoriesComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }
}