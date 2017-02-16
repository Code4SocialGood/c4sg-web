import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'my-signin',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ]
})
export class LoginComponent {
    constructor(public fb: FormBuilder) {}
    public loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    doLogin(event) {
        console.log(event);
        console.log(this.loginForm.value);
    }
}
