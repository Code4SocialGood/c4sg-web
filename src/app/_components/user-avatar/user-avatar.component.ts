import {Component, Input, OnInit} from '@angular/core';
import { User } from '../../user/common/user';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  @Input () user: User;

  constructor(public constantsService: FormConstantsService) { }

  ngOnInit() {
  }
}
