import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../_services/validation.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
  public subjectAreas: any[];

  constructor(public fb: FormBuilder,
    private validationService: ValidationService,

  ) {

  }

  ngOnInit(): void {
    this.subjectAreas = ['Oracle', 'Java', 'Project management', 'SQL'];
    this.initForm();
  }
  private initForm(): void {
    this.consultantForm = this.fb.group({
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
  onSubmit(updatedData: any, event): void {
    event.preventDefault();
    event.stopPropagation();
    const formData = this.consultantForm.value;
    // For subject areas- Get all chips with class subjectSelected

  }

  public select(event, country) {
    event.preventDefault();
    event.stopPropagation();
    if (!event.target.classList.contains('subjectSelected') && !event.target.classList.contains('subjectDeselected')) {
      event.target.classList.add('subjectSelected');
    } else if (event.target.classList.contains('subjectSelected')) {
      event.target.classList.add('subjectDeselected');
      event.target.classList.remove('subjectSelected');
    } else if (event.target.classList.contains('subjectDeselected')) {
      event.target.classList.add('subjectSelected');
      event.target.classList.remove('subjectDeselected');
    }
  }
}
