import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Application } from '../common/application';
import { ApplicationService } from '../common/application.service';
import { ExtFileHandlerService } from '../../_services/extfilehandler.service';
import { FormConstantsService } from '../../_services/form-constants.service';
import { AuthService } from '../../auth.service';
import { User } from '../../user/common/user';
import { UserService } from '../../user/common/user.service';

declare var Materialize: any;

@Component({
  selector: 'my-edit-application',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.scss']
})

export class ApplicationEditComponent implements OnInit {

  @Input() projectId: number;
  @Input() userId: number;
  @Output() onApplicationCreated = new EventEmitter<boolean>();
  @Output() onApplicationAccepted = new EventEmitter<boolean>();
  @Output() onApplicationDeclined = new EventEmitter<boolean>();

  currentUserId: String;
  public resume: any = '';
  public user: User;
  application: Application;

  constructor(private applicationService: ApplicationService,
    private extfilehandler: ExtFileHandlerService,
    public constantsService: FormConstantsService,
    private auth: AuthService,
    private userService: UserService,
  ) {

  }

  ngOnInit() {
    this.application = new Application(this.projectId, +this.userId, '', false, '', new Date(), new Date(), new Date());
  }

  createApplication(application: Application): void {

    application.status = 'A';
    application.appliedTime = new Date();
    this.applicationService.createApplication(application)
      .subscribe(res => {
        this.onApplicationCreated.emit(true);
      }, (error) => {
        this.onApplicationCreated.emit(false);
      });

  }
  resumeChecked() {
    this.application.resumeFlag = true;
  }

  onUploadResume(fileInput: any): void {
    if (fileInput.target.files[0].size < this.constantsService.maxFileSize) {
      if (this.user === null || this.user === undefined) {
        this.currentUserId = this.auth.getCurrentUserId();
      } else {
        this.currentUserId = String(this.user.id);
      }

      // Function call to upload the file to AWS S3
      const upload$ = this.extfilehandler.uploadFile(fileInput, Number(this.currentUserId), 'doc');
      // Calls the function to save the avatar image url to the user's row
      upload$.switchMap((res) => this.userService.saveResumeFile(Number(this.currentUserId), res),
        (outerValue, innerValue, outerIndex, innerIndex) => ({ outerValue, innerValue, outerIndex, innerIndex }))
        .subscribe(res => {
          if (res.innerValue.text() !== '') {
            this.resume = res.outerValue;
            // this.user.avatarUrl = this.avatar;
            this.user.resumeURL = this.resume;
          } else {
            console.error('Saving user resume: Not expecting a response body');
          }
        }, (e) => {
          console.error('Resume not saved. Not expecting a response body');
        });
    } else {
      Materialize.toast('Maximum image size allowed is 1MB', 4000);
    }
  }

}
