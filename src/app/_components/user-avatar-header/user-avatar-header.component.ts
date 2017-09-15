import {Component, Input, OnInit} from '@angular/core';
import { User } from '../../user/common/user';
import { AuthService } from '../../../app/auth.service';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-user-avatar-header',
  templateUrl: './user-avatar-header.component.html',
  styleUrls: ['../user-avatar/user-avatar.component.scss']
})
export class UserAvatarHeaderComponent implements OnInit {
  @Input () authSvc: AuthService;

  constructor(public constantsService: FormConstantsService) { }

  ngOnInit() {
  }
}
