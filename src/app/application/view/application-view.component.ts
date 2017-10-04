import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Applicant } from '../common/applicant';
import { Application } from '../common/application';
import { ApplicationService } from '../common/application.service';

@Component({
    selector: 'application-view',
    templateUrl: './application-view.component.html',
    styleUrls: ['./application-view.component.scss']
})
export class ApplicationViewComponent implements OnInit {
    
    @Input() projectId: number;
    @Output() onApplicationAccepted = new EventEmitter<boolean>();
    @Output() onApplicationDeclined = new EventEmitter<boolean>();
    
    applicants: Applicant[];
    
    constructor(private applicationService: ApplicationService){
    
    }
    
    ngOnInit() {
    
        this.getApplicants(this.projectId);
    
    }
    
    getApplicationFromApplicant(applicant: Applicant): Application {

        let application = new Application(
                applicant.projectId,
                applicant.userId,
                applicant.applicationStatus,
                applicant.resumeFlag,   
                applicant.comment,
                applicant.appliedTime,
                applicant.acceptedTime,
                applicant.declinedTime);
            
        
         return application;
        
    }
    
    // Gets applicants for this project
      getApplicants(projectId): void {

        this.applicationService.getApplicants(projectId)
              .subscribe(
                res => {
                  this.applicants = res;
                }
              );
    }
    
    acceptApplication(applicant: Applicant): void {
    
        let application: Application = this.getApplicationFromApplicant(applicant);
        application.status = "C";
        application.resumeFlag = false; //To DO: remove this line
        application.acceptedTime = new Date();
        this.applicationService.updateApplication(application)
            .subscribe(res => {
                this.onApplicationAccepted.emit(true);
                applicant.applicationStatus = 'C';
                applicant.acceptedTime = application.acceptedTime;
                console.log('Application accepted');
            }, error => {
                this.onApplicationAccepted.emit(false);
                console.log('Error accepting application');
            });        
    }
    
    declineApplication(applicant: Applicant): void {
    
        let application: Application = this.getApplicationFromApplicant(applicant);
        application.status = "D";
        application.resumeFlag = false; //To DO: remove this line
        application.declinedTime = new Date();
        this.applicationService.updateApplication(application)
            .subscribe(res => {
                this.onApplicationDeclined.emit(true);
                applicant.applicationStatus = 'D';
                applicant.declinedTime = application.declinedTime;
                console.log('Application declined');
            }, error => {
                this.onApplicationDeclined.emit(false);
                console.log('Error declining application');
            });        
    }
}