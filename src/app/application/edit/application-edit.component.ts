import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { Application } from '../common/application';
import { ApplicationService } from '../common/application.service';

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

    application: Application;

    constructor(private applicationService: ApplicationService) {

    }

    ngOnInit() {
       this.application = new Application(this.projectId, +this.userId, '', false, '', new Date(), new Date(), new Date());
    }

    createApplication (application: Application): void {

        application.status = 'A';
        application.appliedTime = new Date();
        this.applicationService.createApplication (application)
            .subscribe (res => {
                this.onApplicationCreated.emit(true);
            }, (error) => {
                this.onApplicationCreated.emit(false);
            });

    }
}
