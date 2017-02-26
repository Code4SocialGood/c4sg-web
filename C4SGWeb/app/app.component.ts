import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
// moduleId: module.id,  // For webpack, remove this
  selector: 'my-app',
  templateUrl: './app.component.html'
})

export class AppComponent {

  constructor(private router: Router) {
    this.router = router;
  }
  // control nav style by changing the class name
  isAtHome() {
    if (this.router.url === '/' || this.router.url === '/#!') {
    } else {
      return 'off-home';
    }
  }
}
