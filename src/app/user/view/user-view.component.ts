import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { User } from '../common/user';
import { UserService } from '../common/user.service';
import { AuthService } from '../../auth.service';
import { SkillService } from '../../skill/common/skill.service';
import { ImageDisplayService } from '../../_services/image-display.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  // moduleId: module.id,
  selector: 'my-view-user',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.scss']
})

export class UserViewComponent implements OnInit {

  user: User;
  avatar: any = '';
  displayEdit = false;
  displayDelete = false;
  globalActions = new EventEmitter<string|MaterializeAction>();
  deleteGlobalActions = new EventEmitter<string|MaterializeAction>();
  modalActions = new EventEmitter<string|MaterializeAction>();
  defaultAvatarUser = '../../assets/avatar.png';

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private skillService: SkillService,
    private router: Router,
    private route: ActivatedRoute,
    private imageDisplay: ImageDisplayService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['userId'];
    this.getUser(id);
    this.getAvatar(id);
    this.displayButtons(id);
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      res => {
        this.user = res;
        this.skillService.getSkillsForUser(id).subscribe(
          result => {
            this.user.skills = result;
          },
          error => console.log(error)
        );
      },
      error => console.log(error)
    );
  }

  getAvatar(id: number) {
    this.imageDisplay.displayImage(id,
      this.userService.retrieveAvatar.bind(this.userService))
      .subscribe(res => this.avatar = res.url);
  }

  displayButtons(id: number): void {

    if (this.authService.authenticated()) {
      if (this.authService.isAdmin()) {
          this.displayEdit = true;
          this.displayDelete = true;
      }
    }
  }

  edit(organization): void {
    this.router.navigate(['/user/edit', this.user.id]);
  }

  delete(): void {
    this.userService
      .delete(this.user.id)
      .subscribe(
        response => {
          this.router.navigate(['user/list']);
          this.deleteGlobalActions.emit({action: 'toast', params: ['User deleted successfully', 4000]});
          // TODO log user out
        },
        error => {
            console.log(error);
            this.deleteGlobalActions.emit({action: 'toast', params: ['Error while deleting a user', 4000]});
        }
      );
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
}
