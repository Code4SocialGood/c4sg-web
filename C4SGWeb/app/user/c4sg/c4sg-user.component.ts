import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CreateProjectComponent } from '../../project/create/create.component';


@Component({
    moduleId: module.id,
    selector: 'my-projects',
    templateUrl: 'c4sg-user.component.html',
    styleUrls: ['c4sg-user.component.css']
})

export class C4SGUserComponent implements OnInit {

	constructor(public fb: FormBuilder) { }

	public myAccount = new FormGroup({
		username: new FormControl("", Validators.required),
		firstName: new FormControl("", Validators.required),
		lastName: new FormControl("", Validators.required),
		email: new FormControl("", Validators.required),
		newPassword: new FormControl("", Validators.required),
		city: new FormControl("", Validators.required),
		state: new FormControl("", Validators.required),
		country: new FormControl("", Validators.required),
		zip: new FormControl("", Validators.required),
		confirmPassword: new FormControl("", Validators.required)
	})
	public myOrganization = new FormGroup({
		organizationName: new FormControl("", Validators.required),
		website: new FormControl("", Validators.required),
		email: new FormControl("", Validators.required),
		phone: new FormControl("", Validators.required),
		ein: new FormControl("", Validators.required),
		category: new FormControl({value :"", disabled: true}, Validators.required),
		address1: new FormControl("", Validators.required),
		address2: new FormControl("", Validators.required),
		city: new FormControl("", Validators.required),
		state: new FormControl({value :"", disabled: true}, Validators.required),
		country: new FormControl({value :"", disabled: true}, Validators.required),
		zip: new FormControl("", Validators.required),
		shortDescription: new FormControl(""),
		detailedDescription: new FormControl("")

	})
	updateAccount(event) {
		let accountData = this.myAccount.value;
		console.log(event);
		console.log(accountData);
	}
	updateOrganization(event) {
		let organizationData = this.myOrganization.value;
		console.log(event);
		console.log(organizationData);
	}
	
    ngOnInit(): void {

    }

}
