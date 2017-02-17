import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../common/user';
import { UserService } from '../common/user.service';
import * as $ from 'jquery';

@Component({
  // moduleId: module.id,
  selector: 'userlist',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css']
})

export class UserListComponent implements OnInit, AfterViewInit {

  users: Object[];
  selectedUser: User;

  constructor(private userService: UserService, private router: Router) {

  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    // jquery script below opens up the modal dialog for delete confirmation
    $(document).ready(function(){
      $('.modal').modal();
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      res => {
        this.users = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      },
      error => console.log(error)
    );
  }

  getUsersByKeyword(keyword: string) {
    keyword = keyword.trim();
    if (!keyword) { return; }

    this.userService.getUsersByKeyword(keyword).subscribe(
    res => {
        this.users = JSON.parse(JSON.parse(JSON.stringify(res))._body);
        this.router.navigate(['../list']);
      },
      error => console.log(error)
    );
  }

  // pre delete
    confirmDelete(user: User): void {
    this.selectedUser = user;
  }

  // selection callback
  onSelect(user: User): void {
    this.selectedUser = user;
    this.router.navigate(['user/view', user.id]);
  }

  // delete callback
  delete(user: User): void {
    this.userService.delete(user.id).subscribe(
      error => console.log(error)
    );

    // after deletion, the steps below updates the view and to exclude the deleted user
    this.users = this.users.filter(u => u !== user);
    if (this.selectedUser === user) {
      this.selectedUser = null;
    }
  }

  // edit callback, TODO
  edit(user: User): void {
    this.selectedUser = user;
    // this.router.navigate(['user/view', user.id]);
  }

}
