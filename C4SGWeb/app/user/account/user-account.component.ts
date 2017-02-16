import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  // moduleId: module.id,
  selector: 'my-account',
  templateUrl: 'user-account.component.html',
  styleUrls: ['user-account.component.css']
})

export class UserAccountComponent {

  public myAccount = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  constructor() { }

  updateAccount(event) {
    const accountData = this.myAccount.value;
    console.log(event);
    console.log(accountData);
  }

}
