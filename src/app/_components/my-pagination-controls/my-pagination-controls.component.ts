import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { PaginationInstance } from 'ngx-pagination';

@Component({
    selector: 'my-pagination-controls',
    templateUrl: './my-pagination-controls.component.html',
    styleUrls: ['my-pagination-controls.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MyPaginationControlsComponent {

    // Workaround for codelyzer #189 issue
    public p: any;
    // https://github.com/mgechev/codelyzer/issues/189

    @Input() id: string;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();


    public autoHide: boolean;

    public maxSize: number;

    public previousLabel: string;
    public nextLabel: string;

    public screenReaderPaginationLabel: string;
    public screenReaderPageLabel: string;
    public screenReaderCurrentLabel: string;

    public directionLinks: boolean;

    constructor() {
        this.pageChange = new EventEmitter<number>();

        this.autoHide = false;

        this.maxSize = 7;

        this.previousLabel = 'Previous';
        this.nextLabel = 'Next';

        this.screenReaderPaginationLabel = 'Pagination';
        this.screenReaderPageLabel = 'page';
        this.screenReaderCurrentLabel = 'You\'re on page';

        this.directionLinks = true;
    }
}
