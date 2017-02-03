import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
    moduleId: module.id,
    selector: 'my-projects',
    templateUrl: 'nonprofit-user.component.html',
    styleUrls: ['nonprofit-user.component.css']
})

export class NonprofitUserComponent implements OnInit {

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

	public createProject = new FormGroup({
		projectName: new FormControl("", Validators.required),
		organizationName: new FormControl("", Validators.required),
		shortDescription: new FormControl("", Validators.required),
		detailedDescription: new FormControl("", Validators.required),
		remote: new FormControl({value: "", disabled: true}, Validators.required),
		physicalAddress: new FormControl({value: "", disabled: true}, Validators.required),
		address1: new FormControl("", Validators.required),
		address2: new FormControl("", Validators.required),
		city: new FormControl("", Validators.required),
		state: new FormControl({value: "", disabled: true}, Validators.required),
		country: new FormControl({value: "", disabled: true}, Validators.required),
		zip: new FormControl("", Validators.required)

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

	doCreateProject(event) {
		let projectData = this.createProject.value;
		console.log(event);
		console.log(projectData);
	}

    ngOnInit(): void {

    }

}
