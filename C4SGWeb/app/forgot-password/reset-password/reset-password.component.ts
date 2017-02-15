import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'my-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: [ './reset-password.component.css' ]
})

export class ResetPasswordComponent {
    constructor(public fb: FormBuilder) {}
    public resetPasswordForm = this.fb.group({
        username: ['', Validators.required],
        temppassword: ['', Validators.required],
        newpassword: ['', Validators.required],
        confirmpassword: ['', Validators.required]
    });

    doResetPassword(event) {
        console.log(event);
        console.log(this.resetPasswordForm.value);
    }
}
