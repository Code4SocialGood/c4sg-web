import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../common/user.service';
import { User } from '../common/user';
import {Router, ActivatedRoute} from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  // moduleId: module.id,
  selector: 'my-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css'],
  providers: []
})

export class UserProfileComponent implements OnInit{

  private user : User;
  public globalActions =  new EventEmitter<string|MaterializeAction>();
  public skillsOption = [{value: '1', name:'CSS'},
                        {value: '2', name:'option2'},
                        {value: '3', name:'python'}] ;
  public myProfile = new FormGroup({
  });

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
  //  this.route.params.subscribe(
    //            params => {
                    //const id = +params['id'];
                    this.userService.getUser(2).subscribe(
                      res =>  {

                      const user = res.json();
                      console.log(user);


                      this.myProfile.setValue({

                          firstName: user.firstName,
                          lastName: user.lastName,
                          state: user.state,
                          zip: user.zip,
                          country: user.country,
                          introduction: user.introduction,
                          linkedin: user.linked_inurl,
                          github: user.github,
                          website: user.personal_web_site,
                          resume: user.resume,
                          skills: [user.skill1,user.skill2,user.skill3,user.skill4,user.skill5]
                        });


                        this.user = new User(
                          user.id,
                          user.email,
                          user.phone,
                          user.state,
                          user.country,
                          user.zip,
                          user.status,
                          user.role,
                          user.github,
                          user.displayFlag,
                          user.longitude,
                          user.latitude,
                          user.userName,
                          user.firstName,
                          user.lastName,
                          user.linked_inurl,
                          user.introduction,
                          user.personal_web_site,
                          user.resume,
                          [user.skill1,user.skill2,user.skill3,user.skill4,user.skill5]);
                  },
                      error => console.log(error)
                        );
}

  updateProfile(event) {

    const user = new User(
      this.user.id,
      this.user.email,
      this.user.phone,
      this.myProfile.value.state,
      this.myProfile.value.country,
      this.myProfile.value.zip,
      this.user.status,
      this.user.role,
      this.myProfile.value.github,
      this.user.displayFlag,
      this.user.longitude,
      this.user.latitude,
      this.user.userName,
      this.myProfile.value.firstName,
      this.myProfile.value.lastName,
      this.myProfile.value.linkedin,
      this.myProfile.value.introduction,
      this.myProfile.value.website,
      this.myProfile.value.resume,
      this.myProfile.value.skills);

    this.userService.update(user).subscribe(
    response => this.globalActions.emit('toast'),
    error => console.error('Do not submit, form has errors')
  );
}

}
