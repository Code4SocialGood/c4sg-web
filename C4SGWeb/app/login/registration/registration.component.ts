import  { Component } from '@angular/core';
import { FormBuilder, Validators, } from '@angular/forms';

@Component({
  selector: 'my-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent {
  constructor(public fb: FormBuilder) {}

  public signUpForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    rpassword: ['', Validators.required],
    user: ['volunteer']
  });

  doSignUp(event) {
    console.log(event);
    console.log(this.signUpForm.value);
  }
}
