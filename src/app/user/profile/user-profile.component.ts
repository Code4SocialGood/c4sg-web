import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { FormConstantsService } from '../../_services/form-constants.service';
import { environment } from '../../../environments/environment';
import {Http} from '@angular/http';


const skillUrl = `${environment.backend_url}/api/skills`;

@Component({
  // moduleId: module.id,
  selector: 'app-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  public countries: any[];
  public skills: any[];

    public myProfile = new FormGroup({

    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipcode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    linkedin: new FormControl('', Validators.required),
    github: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    resume: new FormControl('', Validators.required),
    skills: new FormControl('', Validators.required)


  });

  public ngOnInit(): void {
    this.getFormConstants();
    this.getSkills().subscribe(
      (res) => {

        this.skills = res.json();

      }, (err) => {
        console.error('An error occurred', err);
      },
      () => {
        console.log('Skills displayed');
      }); // for demo purposes only

  }

  constructor(private fc: FormConstantsService, private http: Http) {
  }

  private getFormConstants(): void {

    this.countries = this.fc.getCountries();
  }

  getSkills() {
    return this.http.get(
      `${skillUrl}/all`
    );
  }


    updateProfile(event) {
    const profile = this.myProfile.value;
    console.log(event);
    console.log(profile);

  }

}
