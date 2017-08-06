import {Component, Input, OnInit} from '@angular/core';
import { User } from '../../user/common/user';
import { FormConstantsService } from '../../_services/form-constants.service';

@Component({
  selector: 'my-user-avatar-small',
  templateUrl: './user-avatar-small.component.html',
  styleUrls: ['../user-avatar/user-avatar.component.scss']
})
export class UserAvatarSmallComponent implements OnInit {
  @Input () user: User;

  constructor(public constantsService: FormConstantsService) { }

  ngOnInit() {
  }
}
