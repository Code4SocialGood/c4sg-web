import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../common/user';
import { UserService } from '../common/user.service';
import * as $ from 'jquery';
import { PagerService } from '../../_services/pager.service';

@Component({
  // moduleId: module.id,
  selector: 'userlist',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css']
})

export class UserListComponent implements OnInit, AfterViewInit {
  // the selected user
  selectedUser: User;

  // array of all items to be paged
  users: any[];

  // pager Object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(private userService: UserService, private router: Router, private pagerService: PagerService) {

  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    // jquery script below opens up the modal dialog for delete confirmation
    $(document).ready(() => {
      $('.modal').modal();
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      res => {
        this.users = JSON.parse(JSON.parse(JSON.stringify(res))._body);
        // initialize to page 1
        this.setPage(1);
      },
      error => console.log(error)
    );
  }

  setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.users.length, page);

        // get current page of items
        this.pagedItems = this.users.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

    // after deletion, the steps below updates the view and excludes the deleted user
    this.users = this.users.filter(u => u !== user);
    this.pagedItems = this.pagedItems.filter(u => u !== user);
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
