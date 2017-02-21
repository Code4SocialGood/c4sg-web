import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})

export class AppComponent{

	constructor(router: Router){
		this.router = router;
	}
	//control nav style by changing the class name
	isAtHome() {
		if(this.router.url ==='/'){
			return 'at-home'
		}else{
			return 'off-home';
		}
	}
}
