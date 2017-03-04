import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
// moduleId: module.id,  // For webpack, remove this
  selector: 'my-app',
  templateUrl: './app.component.html'
})

export class AppComponent {

    constructor(private router: Router) { }

  // control nav style by changing the class name
  isAtHome() {
    if (this.router.url === '/' || this.router.url === '/#!') {
      return 'at-home';
    } else {
      return 'off-home';
    }
  }
}
