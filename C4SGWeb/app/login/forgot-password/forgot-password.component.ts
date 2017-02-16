import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'my-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: [ './forgot-password.component.css' ]
})

export class ForgotPasswordComponent {
    constructor(public fb: FormBuilder) {}
    public fPasswordForm = this.fb.group({
        username: ['', Validators.required]
    });

    dofPassword(event) {
        console.log(event);
        console.log(this.fPasswordForm.value);
    }
}
