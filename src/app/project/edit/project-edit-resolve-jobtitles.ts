import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from '../../user/common/user.service';
import { Project } from '../common/project';
import { JobTitle } from '../../job-title';

@Injectable()
export class ProjectEditJobTitleResolve implements Resolve<any> {
   public jobTitlesArray: JobTitle[] = [];
    constructor( private userService: UserService, private router: Router) {
    }
    resolve(route: ActivatedRouteSnapshot): Promise<JobTitle[]>  {
          return  this.userService.getAllJobTitlesBeforePageInit()
        .then(
        res => { if (res) { return res; }
        }
        );
    }
}
