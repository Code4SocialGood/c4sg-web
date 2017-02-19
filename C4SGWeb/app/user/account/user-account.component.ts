import { Component, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import {SPACE} from "@angular/material";

@Component({
  // moduleId: module.id,
  selector: 'my-account',
  templateUrl: 'user-account.component.html',
  styleUrls: ['user-account.component.css']
})

export class UserAccountComponent {

  public file_srcs: string[] ;
  public debug_size_before: string[];
  public debug_size_after: string[];
  public image_loaded: boolean;

  public myAccount = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  constructor( private changeDetectorRef: ChangeDetectorRef) { }

  updateAccount(event) {
    const accountData = this.myAccount.value;
    console.log(event);
    console.log(accountData);
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
    }
    else {
      return "/app/images/default_avatar.png";
    }

  }
}
