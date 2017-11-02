import {MaterializeDirective, MaterializeAction} from 'angular2-materialize';
import {Component, EventEmitter} from '@angular/core';

@Component({
    selector: 'my-collapsible',
    templateUrl: './help.component.html',
    styleUrls: [ 'help.component.scss' ]
})
export class HelpComponent {

    actions1 = new EventEmitter<string|MaterializeAction>();


    params = [
      {
        onOpen: (el) => {
          console.log('Collapsible open', el);
        },
        onClose: (el) => {
          console.log('Collapsible close', el);
        }
      }
    ];

    /*values = ["First", "Second", "Third"];*/

   /* openFirst() {
      this.actions1.emit({action:"collapsible",params:['open',0]});
    }

    closeFirst() {
      this.actions1.emit({action:"collapsible",params:['close',0]});
    }*/
}
