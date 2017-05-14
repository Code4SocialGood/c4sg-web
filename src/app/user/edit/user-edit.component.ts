import { Component, ChangeDetectorRef, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../common/user.service';
import { User } from '../common/user';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import { ImageUploaderService } from '../../_services/image-uploader.service';
import { ImageDisplayService } from '../../_services/image-display.service';
import { equalValidator } from '../common/user.equal.validator';

@Component({
  // moduleId: module.id,
  selector: 'my-profile',
  templateUrl: 'user-edit.component.html',
  styleUrls: ['user-edit.component.scss'],
  providers: []
})

export class UserEditComponent implements OnInit {

  public user: User;
  public selectedUser: User;

  public globalActions = new EventEmitter<string|MaterializeAction>();
  public skillsOption = [{value: '1', name: 'CSS'},
    {value: '2', name: 'option2'},
    {value: '3', name: 'python'}];
  public avatar: any = '';
  public states = [{value: 'testState', display: 'testState'}];
  public countries = [{value: 'testCountry', display: 'testCountry'}];
  modalActions = new EventEmitter<string|MaterializeAction>();

  public mySettings = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl({value: '', disabled: true}, Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    introduction: new FormControl('', Validators.required),
    linkedinUrl: new FormControl('', Validators.required),
    personalUrl: new FormControl('', Validators.required),
    facebookUrl: new FormControl('', Validators.required),
    twitterUrl: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required)
  });

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private route: ActivatedRoute,
               private userService: UserService,
               private imageUploader: ImageUploaderService,
               private imageDisplay: ImageDisplayService) { }

  ngOnInit() {
    //  this.route.params.subscribe(
    //            params => {
    // const id = +params['id'];

    const id = this.route.snapshot.params['userId'];
    this.imageDisplay.displayImage(id,
        this.userService.retrieveAvatar.bind(this.userService))
        .subscribe(res => this.avatar = res.url);

    this.userService.getUser(2)
        .subscribe(
          res => {
            const user = res;

            this.mySettings.setValue({
              userName: user.userName,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              state: user.state,
              country: user.country,
              title: user.title,
              introduction: user.introduction,
              linkedinUrl: user.linkedinUrl,
              personalUrl: user.personalUrl,
              facebookUrl: user.facebookUrl,
              twitterUrl: user.twitterUrl,
              phone: user.phone
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
                      user.phone,
                      user.avatarUrl,
                      user.publicProfileFlag,
                      user.chatFlag,
                      user.forumFlag,
                      user.status,
                      user.createdTime,
                      user.updatedTime);
            },
            error => console.log(error)
          );
  }

  updateSettings(event) {
    event.preventDefault();
    const data = this.mySettings.value;
    console.log(event);
    console.log(data);
    if (this.mySettings.errors === null) {
      const user = new User(
        this.user.id,
        this.mySettings.value.email,
        this.user.role,
        this.mySettings.value.userName,
        this.mySettings.value.firstName,
        this.mySettings.value.lastName,
        this.mySettings.value.state,
        this.mySettings.value.country,
        -1,
        -1,
        this.mySettings.value.title,
        this.mySettings.value.introduction,
        this.mySettings.value.linkedinUrl,
        this.mySettings.value.personalUrl,
        this.mySettings.value.facebookUrl,
        this.mySettings.value.twitterUrl,
        this.mySettings.value.phone,
        this.mySettings.value.avatarUrl,
        this.mySettings.value.publicProfileFlag,
        this.mySettings.value.chatFlag,
        this.mySettings.value.forumFlag,
        this.mySettings.value.status,
        this.mySettings.value.createdTime,
        this.mySettings.value.updatedTime);

        this.userService
          .update(user)
          .subscribe(() => {
            this.globalActions.emit('toast');
      });
    } else {
      console.error('Do not submit, form has errors'); // for demo purposes only
    }
  }

  onUploadAvatar(fileInput: any): void {
    this.imageUploader.uploadImage(fileInput,
       this.user.id,
       this.userService.saveAvatar.bind(this.userService))
       .subscribe(res => {
         this.avatar = res.url;
         console.log('Avatar successfully uploaded!');
       },
        err => { console.error(err, 'An error occurred'); } );
  }

  openModal(user) {
    this.modalActions.emit({action: 'modal', params: ['open']});
    this.selectedUser = user;
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  deleteUser(user: User): void {
    console.log(user.id);
    this.userService.delete(user.id)
        .subscribe(
          error => console.log(error)
        );
  }

  /*
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
      return ['./assets/default_image.png'];
    }
  }
  */

    /*
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
  } */

}
