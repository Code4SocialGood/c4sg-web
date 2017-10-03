import { Component, Input, OnInit} from '@angular/core';
import { Application } from '../common/application';
import { ApplicationService } from '../common/application.service';

@Component({
    selector: 'edit-application',
    templateUrl: './application-edit.component.html',
    styleUrls: ['./application-edit.component.scss']
})

export class ApplicationEditComponent implements OnInit {

    @Input() application: Application;

    constructor(private applicationService: ApplicationService){

    }
    
    ngOnInit() {
        
    }
    
    createApplication(application: Application): void {
        
        this.applicationService.createApplication(application)
            .subscribe(res => {
            
            }, (error) => {
                console.log('Error creating application');
            });
        
    }

}