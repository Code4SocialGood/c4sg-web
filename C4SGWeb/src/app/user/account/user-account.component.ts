import { Component, ChangeDetectorRef, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../common/user.service';
import { equalValidator } from '../common/user.equal.validator';
import { User } from '../common/user';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  // moduleId: module.id,
  selector: 'my-account',
  templateUrl: 'user-account.component.html',
  styleUrls: ['user-account.component.css']
})

export class UserAccountComponent implements OnInit {

  public file_srcs: string[] ;
  public debug_size_before: string[];
  public debug_size_after: string[];
  public image_loaded: boolean;
  public states = [{value: 'testState', display: 'testState'}];
  public countries = [{value: 'testCountry', display: 'testCountry'}];
  private user: User;
  public globalActions =  new EventEmitter<string|MaterializeAction>();

  public myAccount = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required)
  });

  public myPassword = new FormGroup({
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
  }, equalValidator);

  constructor( private changeDetectorRef: ChangeDetectorRef, private userService: UserService) { }

  updateAccount(event) {
    event.preventDefault();
    const accountData = this.myAccount.value;
    console.log(event);
    console.log(accountData);
    if (this.myAccount.errors === null) {
      const user = new User(
        this.user.id,
        this.myAccount.value.email,
        this.user.phone,
        this.myAccount.value.state,
        this.myAccount.value.country,
        this.myAccount.value.zip,
        this.user.status,
        this.user.role,
        this.user.github,
        this.user.displayFlag,
        this.user.longitude,
        this.user.latitude,
        this.myAccount.value.username,
        this.myAccount.value.firstName,
        this.myAccount.value.lastName);
      this.userService.update(user).subscribe(() => {
          this.globalActions.emit('toast');
      });
    } else {
      console.error('Do not submit, form has errors'); // for demo purposes only
    }
  }

  updatePassword(event) {
    if (this.myPassword.controls['newPassword'].errors !== null
    || this.myPassword.controls['confirmPassword'].errors !== null || this.myPassword.errors !== null) {
      console.error('Do not submit, form has errors');
      return;
    }
    const passwordData = this.myPassword.value;
    console.log(this.myPassword.controls);
    console.log(event);
    console.log(passwordData);
  }

  fileChange(input) {
    this.image_loaded = false;
    this.readFiles(input.files);
  }

  readFile(file, reader, callback) {

    reader.onload = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);

  }

  readFiles(files, index = 0) {

    let reader = new FileReader();
    if (index in files) {

      this.readFile(files[index], reader, (result) => {

        let img = document.createElement('img');

        img.src = result;
        this.resize(img, 250, 250, (resized_jpeg, before, after) => {
          this.debug_size_before = before;
          this.debug_size_after = after;
          this.file_srcs = resized_jpeg;
          this.image_loaded = true;
          this.readFiles(files, index + 1);
        });
      });
    } else {

      this.changeDetectorRef.detectChanges();
    }
  }

  resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
    return img.onload = () => {

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      let canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, width, height);

      let dataUrl = canvas.toDataURL('image/jpeg');

      callback(dataUrl, img.src.length, dataUrl.length);

    };
  }

  getImage() {
    if (this.image_loaded) {
      return this.file_srcs;
    } else {
      return ['/app/images/default_avatar.png'];
    }

  }

  ngOnInit(): void {
    this.userService.getUser(2).subscribe(
      (res) => {
        const user = res.json();
        console.log(user);

        this.myAccount.setValue({
          username: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          state: user.state,
          country: user.country,
          zip: user.zip
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
          user.lastName);
      }, (err) => {
        console.error('An error occurred', err); // for demo purposes only
      }
    );

  }
}
