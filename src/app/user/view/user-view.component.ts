import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { User } from '../common/user';
import { Project } from '../../project/common/project';
import { JobTitle } from '../../job-title';
import { UserService } from '../common/user.service';
import { AuthService } from '../../auth.service';
import { SkillService } from '../../skill/common/skill.service';
import { ProjectService} from '../../project/common/project.service';
import { MaterializeAction } from 'angular2-materialize';
import { FormConstantsService } from '../../_services/form-constants.service';

declare var Materialize: any;

@Component({
  // moduleId: module.id,
  selector: 'my-view-user',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.scss']
})

export class UserViewComponent implements OnInit {

  user: User;
  projects: Project[];
  avatar: any = '';
  public jobTitlesArray: JobTitle[] = [];
  displayEdit = false;
  displayDelete = false;
  globalActions = new EventEmitter<string | MaterializeAction>();
  modalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private skillService: SkillService,
    private projectService: ProjectService,
    public constantsService: FormConstantsService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['userId'];
    this.getUser(id);
    this.displayButtons(id);
    this.userService.getAllJobTitles()
      .subscribe(
      res => {
        this.jobTitlesArray = res;
      }, error => console.log(error)
      );
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      res => {
        this.user = res;
        this.getProjects(id);
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
        Materialize.toast('The user is deleted', 4000);
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error => {
        console.error(error, 'An error occurred');
        Materialize.toast('Error deleting the user', 4000);
      }
      );
  }

  getProjects(id: number) {
    this.projectService.getProjectByUser(id, 'C').subscribe(
      res => {
        this.projects = res.json();
        this.projects.forEach((project) => {
          if (project.description && project.description.length > 100) {
            project.description = project.description.slice(0, 100) + '...';
          }
           this.skillService.getSkillsByProject(project.id).subscribe(
                result => {
                     project.skills = result;
                      });
        });
      },
      error => console.log(error)
    );
  }

  openModal() {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
  }

  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }
}
