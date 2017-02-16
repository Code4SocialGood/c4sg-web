import  { Component } from '@angular/core';
import { FormBuilder, Validators, FormsModule } from '@angular/forms';

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
    user: ['', Validators.required]
  });

  doSignUp(event) {
    console.log(event);
    console.log(this.signUpForm.value);
  }

  updateUser(value): void {
    this.signUpForm.value.user = value;
  }
}
