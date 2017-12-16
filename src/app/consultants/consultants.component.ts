import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../_services/validation.service';
import { FormConstantsService } from '../_services/form-constants.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmailService, Email } from '../_services/email.service';

@Component({
  selector: 'my-consultants',
  templateUrl: './consultants.component.html',
  styleUrls: ['./consultants.component.scss']
})
export class ConsultantsComponent implements OnInit {

  public descMaxLength: number = this.validationService.descMaxLength;
  public descMaxLengthEntered = false;
  public descValueLength: number;
  public descFieldFocused = false;

  public consultantForm: FormGroup;
  private subjects: Map<string, boolean>;
  private sent: boolean;

  constructor(private fb: FormBuilder,
              private validationService: ValidationService,
              private formConstantsService: FormConstantsService,
              private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.subjects = new Map([
      ['Oracle', false],
      ['Java', false],
      ['Project management', false],
      ['SQL', false]
    ]);
    this.initForm();
  }

  private initForm(): void {
    this.consultantForm = this.fb.group({
      'email': ['', []],
      'description': ['', []],
    });

  }

  onCountCharDescription() {
    this.descValueLength = this.consultantForm.value.description.length;
    if (this.consultantForm.controls.description.invalid) {
      this.descMaxLengthEntered = true;
    } else {
      this.descMaxLengthEntered = false;
    }
  }

  onFocusDescription() {
    this.descFieldFocused = true;
    this.onCountCharDescription();
  }

  onBlurDescription() {
    if (!this.consultantForm.controls.description.invalid) {
      this.descFieldFocused = false;
    }
  }

  onSubmit(): void {
    const form = this.consultantForm.value;
    const email = new Email({
      to: this.formConstantsService.infoEmail,
      from: form.email,
      replyTo: form.email,
      subject: 'Request for consultants',
      body: `<p>Subject areas: ${this.selectedSubjectAreas}</p>
             <p><pre>${form.description}</pre></p>`
    });

    this.emailService.send(email).subscribe(sent => this.sent = sent);
  }

  public select(event, subject) {
    const current = this.subjects.get(subject);
    this.subjects.set(subject, !current);
  }

  get isSent() {
    return this.sent;
  }

  get subjectAreas(): Array<string> {
    return Array.from(this.subjects.keys());
  }

  get selectedSubjectAreas(): string {
    return Array.from(this.subjects)
      .filter(entry => entry[1] )
      .map(entry => entry[0])
      .join(', ');
  }

  isSubjectSelected(name: string): boolean {
    return this.subjects.get(name);
  }
}
