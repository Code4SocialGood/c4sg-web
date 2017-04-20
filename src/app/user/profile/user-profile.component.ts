import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../common/user.service';
import { User } from '../common/user';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  // moduleId: module.id,
  selector: 'my-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css'],
  providers: []
})

export class UserProfileComponent implements OnInit {

  private user: User;
  public globalActions = new EventEmitter<string|MaterializeAction>();
  public skillsOption = [{value: '1', name: 'CSS'},
    {value: '2', name: 'option2'},
    {value: '3', name: 'python'}];
  public myProfile = new FormGroup({ });

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    //  this.route.params.subscribe(
    //            params => {
    // const id = +params['id'];
    this.userService.getUser(2)
        .subscribe(
          res => {

            const user = res;
            console.log(user);


            this.myProfile.setValue({
                firstName: user.firstName,
                lastName: user.lastName,
                state: user.state,
                zip: user.zip,
                country: user.country,
                introduction: user.introduction,
                linkedin: user.linkedinUrl,
                website: user.personalUrl
              });


              this.user = new User(
                        user.id,
                        user.email,
                        user.role,
                        user.userName,
                        user.firstName,
                        user.lastName,
                        user.phone,
                        user.city,
                        user.state,
                        user.country,
                        user.zip,
                        -1,
                        -1,
                        user.introduction,
                        user.linkedinUrl,
                        user.personalUrl,
                        user.status,
                        user.publicProfileFlag,
                        user.chatFlag,
                        user.forumFlag,
                        user.developerFlag,
                        user.createdTime,
                        user.updatedTime);
        },
            error => console.log(error)
              );
}

  updateProfile(event) {

    const user = new User(
        this.user.id,
        this.myProfile.value.email,
        this.user.role,
        this.myProfile.value.userName,
        this.myProfile.value.firstName,
        this.myProfile.value.lastName,
        this.user.phone,
        this.myProfile.value.city,
        this.myProfile.value.state,
        this.myProfile.value.country,
        this.myProfile.value.zip,
        -1,
        -1,
        this.user.introduction,
        this.user.linkedinUrl,
        this.user.personalUrl,
        this.user.publicProfileFlag,
        this.user.chatFlag,
        this.user.forumFlag,
        this.user.developerFlag,
        this.user.status,
        this.user.createdTime,
        this.user.updatedTime );

    this.userService
        .update(user)
        .subscribe(
          response => this.globalActions.emit('toast'),
          error => console.error('Do not submit, form has errors')
        );
  }

}
