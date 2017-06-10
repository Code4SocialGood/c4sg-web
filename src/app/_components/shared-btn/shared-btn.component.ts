import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'my-shared-btn',
  templateUrl: './shared-btn.component.html',
  styleUrls: ['./shared-btn.component.scss']
})
export class SharedBtnComponent implements OnInit {
  @Input('displayShare') displayShare: boolean;

  constructor() { }

  ngOnInit() {
  }
}
