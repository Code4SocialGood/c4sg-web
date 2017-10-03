import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { Application } from '../common/application';
import { ApplicationService } from '../common/application.service';

@Component({
    selector: 'edit-application',
    templateUrl: './application-edit.component.html',
    styleUrls: ['./application-edit.component.scss']
})

export class ApplicationEditComponent implements OnInit {

    @Input() application: Application;
    @Output() onApplicationCreated = new EventEmitter<boolean>();
    @Output() onApplicationAccepted = new EventEmitter<boolean>();
    @Output() onApplicationDeclined = new EventEmitter<boolean>();
   
    constructor(private applicationService: ApplicationService){

    }
    
    ngOnInit() {
        
    }
    
    createApplication(application: Application): void {
        
        application.status = "A";        
        application.appliedTime = new Date();
        this.applicationService.createApplication(application)
            .subscribe(res => {
                this.onApplicationCreated.emit(true);
                console.log('Application created');            
            }, (error) => {
                this.onApplicationCreated.emit(false);
                console.log('Error creating application');                
            });
        
    }
    
    acceptApplication(application: Application): void {
        application.status = "C";
        application.acceptedTime = new Date();
        this.applicationService.updateApplication(application)
            .subscribe(res => {
                this.onApplicationAccepted.emit(true);
                console.log('Application accepted');
            }, error => {
                this.onApplicationAccepted.emit(false);
                console.log('Error accepting application');
            });        
    }
    
    declineApplication(application: Application): void {
        application.status = "D";
        application.declinedTime = new Date();
        this.applicationService.updateApplication(application)
            .subscribe(res => {
                this.onApplicationDeclined.emit(true);
                console.log('Application declined');
            }, error => {
                this.onApplicationDeclined.emit(false);
                console.log('Error declining application');
            });        
    }

}