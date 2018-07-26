import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../_services/validation.service';
import { FormConstantsService } from '../_services/form-constants.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmailService, Email } from '../_services/email.service';

@Component({
  selector: 'my-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public commentMaxLength: number = this.validationService.descMaxLength;
  public commentMaxLengthEntered = false;
  public commentValueLength: number;
  public commentFieldFocused = false;
  public nameMaxLength: number = this.validationService.nameMaxLength;
  public nameMaxLengthEntered = false;
  public nameValueLength: number;
  public nameFieldFocused = false;
  public emailMaxLength: number = this.validationService.nameMaxLength;
  public emailMaxLengthEntered = false;
  public emailValueLength: number;
  public emailFieldFocused = false;
  public contactForm: FormGroup;
  private sent: boolean;

  constructor(private fb: FormBuilder,
              private validationService: ValidationService,
              private formConstantsService: FormConstantsService,
              private emailService: EmailService) {}

  ngOnInit(): void {
    this.sent = false;
    this.contactForm = this.fb.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required]],
      'comment': ['', [Validators.required]]
    });
  }

  // Name methods
  onCountCharName() {
    this.nameValueLength = this.contactForm.value.name.length;
    if (this.contactForm.controls.name.invalid) {
      this.nameMaxLengthEntered = true;
    } else {
      this.nameMaxLengthEntered = false;
    }
  }
  onFocusName() {
    this.nameFieldFocused = true;
    this.onCountCharName();
  }
  onBlurName() {
    if (!this.contactForm.controls.name.invalid) {
      this.nameFieldFocused = false;
    }
  }
  // Email methods
  onCountCharEmail() {
    this.emailValueLength = this.contactForm.value.email.length;
    if (this.contactForm.controls.email.invalid) {
      this.emailMaxLengthEntered = true;
    } else {
      this.emailMaxLengthEntered = false;
    }
  }
  onFocusEmail() {
    this.emailFieldFocused = true;
    this.onCountCharEmail();
  }
  onBlurEmail() {
    if (!this.contactForm.controls.email.invalid) {
      this.emailFieldFocused = false;
    }
  }
  // Comment methods
  onCountCharComment() {
    this.commentValueLength = this.contactForm.value.comment.length;
    if (this.contactForm.controls.comment.invalid) {
      this.commentMaxLengthEntered = true;
    } else {
      this.commentMaxLengthEntered = false;
    }
  }
  onFocusComment() {
    this.commentFieldFocused = true;
    this.onCountCharComment();
  }
  onBlurComment() {
    if (!this.contactForm.controls.comment.invalid) {
      this.commentFieldFocused = false;
    }
  }

  onSubmit(): void {
    if ( this.contactForm.valid ) {
      const form = this.contactForm.value;
      const email = new Email({
        to: this.formConstantsService.infoEmail,
        from: form.email,
        replyTo: form.email,
        subject: 'Request for Contact Us',
        body: `<p>${form.name} said:</p>
               <p><pre>${form.comment}</pre></p>`
      });

      this.emailService.send(email).subscribe(sent => this.sent = sent);
    }
  }

  get isSent() {
    return this.sent;
  }

}
