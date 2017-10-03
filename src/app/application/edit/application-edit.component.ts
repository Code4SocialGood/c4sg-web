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
   
    constructor(private applicationService: ApplicationService){

    }
    
    ngOnInit() {
        
    }
    
    createApplication(application: Application): void {
        
        application.status = "A";
        let currentDate: Date = new Date();
        application.appliedTime = currentDate;
        this.applicationService.createApplication(application)
            .subscribe(res => {
                this.onApplicationCreated.emit(true);
                console.log('Application created');            
            }, (error) => {
                this.onApplicationCreated.emit(false);
                console.log('Error creating application');                
            });
        
    }

}