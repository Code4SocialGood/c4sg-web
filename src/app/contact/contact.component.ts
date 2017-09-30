import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../_services/validation.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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


  constructor(public fb: FormBuilder,
    private validationService: ValidationService) {
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      'name': ['', []],
      'email': ['', []],
      'comment': ['', []]
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

  onSubmit(updatedData: any, event): void {
    event.preventDefault();
    event.stopPropagation();
    const formData = this.contactForm.value;
  }

}
