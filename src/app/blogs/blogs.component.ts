import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../_services/validation.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'my-blog',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})

export class BlogsComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }
}