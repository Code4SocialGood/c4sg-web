import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Applicant } from '../common/applicant';
import { Application } from '../common/application';
import { ApplicationProject } from '../common/applicationProject';
import { ApplicationService } from '../common/application.service';

@Component({
    selector: 'my-application-project-view',
    templateUrl: './application-project-view.component.html',
    styleUrls: ['./application-project-view.component.scss']
})
export class ApplicationProjectViewComponent implements OnInit {

    @Input() applicantId: number;
    @Input() nonProfitUserId: number;
    @Output() onApplicationAccepted = new EventEmitter<boolean>();
    @Output() onApplicationDeclined = new EventEmitter<boolean>();

    appliedProjects: ApplicationProject[];

    constructor(private applicationService: ApplicationService) {

    }

    ngOnInit() {

        this.getAppliedProjects(this.applicantId, this.nonProfitUserId);

    }

    getApplicationFromApplicationProject(applicationProject: ApplicationProject): Application {

        const application = new Application (
                applicationProject.projectId,
                applicationProject.userId,
                applicationProject.applicationStatus,
                applicationProject.resumeFlag,
                applicationProject.comment,
                applicationProject.appliedTime,
                applicationProject.acceptedTime,
                applicationProject.declinedTime);

         return application;
    }

    // Gets applicants for this project
      getAppliedProjects(applicantId: number, nonProfitUserId: number): void {

        this.applicationService.getApplicationsByOrgAndApplicant(nonProfitUserId, applicantId, 'A')
              .subscribe(
                res => {
                  this.appliedProjects = res;
                }
              );
    }

    acceptApplication(applicationProject: ApplicationProject): void {

        const application: Application = this.getApplicationFromApplicationProject(applicationProject);
        application.status = 'C';
        application.resumeFlag = false; // To DO: remove this line
        application.acceptedTime = new Date();
        this.applicationService.updateApplication(application)
            .subscribe(res => {

                applicationProject.applicationStatus = 'C';
                applicationProject.acceptedTime = application.acceptedTime;
                console.log('Application accepted');
            }, error => {

                console.log('Error accepting application');
            });
    }

    declineApplication(applicationProject: ApplicationProject): void {

        const application: Application = this.getApplicationFromApplicationProject(applicationProject);
        application.status = 'D';
        application.resumeFlag = false; // To DO: remove this line
        application.declinedTime = new Date();
        this.applicationService.updateApplication(application)
            .subscribe(res => {

                applicationProject.applicationStatus = 'D';
                applicationProject.declinedTime = application.declinedTime;
                console.log('Application declined');
            }, error => {

                console.log('Error declining application');
            });
    }
}
