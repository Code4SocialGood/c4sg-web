import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  //moduleId: module.id,
  selector: 'my-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {

  public myProfile = new FormGroup({
    linkedin: new FormControl('', Validators.required),
    github: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    resume: new FormControl('', Validators.required),
    skills: new FormControl('', Validators.required)
  });

  constructor() { }

}
