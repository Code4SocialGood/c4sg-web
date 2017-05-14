import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { UserService } from '../common/user.service';
import { User } from '../common/user';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import { FormConstantsService } from '../../_services/form-constants.service';
import { SkillService } from '../../skill/common/skill.service';

@Component({
  // moduleId: module.id,
  selector: 'my-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.scss'],
  providers: []
})

export class UserProfileComponent implements OnInit {

  private user: User;
  public countries: any[];
  public skills: any[];
  public globalActions = new EventEmitter<string|MaterializeAction>();
  public skillsOption: any[];
  skillsArray = new FormArray([]);
  filterForm = new FormGroup({
    keyword: new FormControl(''),
    skills: this.skillsArray
  });
  public myProfile = new FormGroup({ });

  constructor(private route: ActivatedRoute, private userService: UserService, private fc: FormConstantsService,
              private skillService: SkillService) { }

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
                        user.state,
                        user.country,
                        -1,
                        -1,
                        user.title,
                        user.introduction,
                        user.linkedinUrl,
                        user.personalUrl,
                        user.facebookUrl,
                        user.twitterUrl,
                        user.status,
                        user.publicProfileFlag,
                        user.chatFlag,
                        user.forumFlag,
                        user.createdTime,
                        user.updatedTime);
        },
            error => console.log(error)
              );

    this.getFormConstants();
    this.skillService.getSkills()
      .subscribe(res => {
          console.log(res);
          this.skills  = res.map(skill => {
            this.skillsArray.push(new FormControl(false));
            return {name: skill.skillName, checked: false, id: skill.id}; });
        },
        error => console.error(error)
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
        this.myProfile.value.state,
        this.myProfile.value.country,
        -1,
        -1,
        this.user.title,
        this.user.introduction,
        this.user.linkedinUrl,
        this.user.personalUrl,
        this.user.facebookUrl,
        this.user.twitterUrl,
        this.user.publicProfileFlag,
        this.user.chatFlag,
        this.user.forumFlag,
        this.user.status,
        this.user.createdTime,
        this.user.updatedTime);

    this.userService
        .update(user)
        .subscribe(
          response => this.globalActions.emit('toast'),
          error => console.error('Do not submit, form has errors')
        );
  }

  private getFormConstants(): void {

    this.countries = this.fc.getCountries();
  }

}
