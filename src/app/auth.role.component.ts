import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';
import { myConfig } from './auth.config';

// declare const $: Function;
declare var $: any;
/*
  This component is used to prompt an individual who signs up thru a social account
  to choose the user role to sign up for (either as a volunteer or non-profit).
  This is not used from an email/pwd sign-up.
*/
@Component({
// moduleId: module.id,  // For webpack, remove this
  selector: 'my-app',
  template: ` 
  <div class="container">
    <div id="modal1" class="modal" style="display:none">
      <div class="modal-content">
        <h5>Select the type of user you are signing up for</h5>
        <hr>
        <br>
        <table>
          <thead></thead>
          <tbody>
            <tr class="input-field valign-wrapper" *ngFor="let entry of entries; let idx = index">   
              <td class="valign-wrapper">
                  <label>{{ entry.description }}</label>&nbsp;&nbsp;&nbsp;
                  <input type="radio" 
                    name="role"
                    [value]="entry.value" 
                    style="position: relative; left: 17rem; margin-top: -.5rem; opacity: 100;" 
                    (change)="onSelectionChange(entry)"
                  />                  
              </td>
            </tr>       
          </tbody>
        </table>   
        <hr>
        <h6>If you registered via email/password, you will need to log back in after role selection.</h6>       
	    </div> 
      <div class="modal-footer">
        <button id="btn1" [disabled]="true" (click) = "setRole()" class="btn modal-action modal-close 
        waves-effect waves-green btn-flat">Continue</button>
      </div>
    </div>
  </div>
  `
})


export class AuthRoleSelectionComponent implements OnInit, AfterViewInit {
    stateVal: string;
    role;
    entries = [];
    selectedEntry: { [key: string]: any } = {
      value: null,
      description: null
    };

    constructor(private location: Location, private router: Router, public auth0: AuthService, private route: ActivatedRoute) { }

    ngOnInit(): void {
      // Retrieve the state passed by Auth0 to avoid csrf issue upon callback
      this.stateVal = this.route.snapshot.queryParams['state'];
      // console.log("stateValue passed = " + this.stateVal);
      // Initialize the role options
      this.entries = [
        {
          description: 'Volunteer User (Contribute to Projects)',
          value: 'VOLUNTEER'
        },
        {
          description: 'Organization User (Post Projects)',
          value: 'ORGANIZATION'
        },
        // { // Remove admin user from UI
        //   description: 'Admin User',
        //   value: 'ADMIN'
        // }
      ];
    }

    ngAfterViewInit(): void {
      // Jquery script below opens up the modal dialog for role selection
      $(document).ready(() => {
        $('.modal').modal({
            dismissible: false
          });

           // Force user to select
        $('.modal').modal('open'); // Opens up dialog upon redirection from Auth0
        }
      );
    }

    onSelectionChange(entry) {
        this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
        $('#btn1').removeAttr('disabled'); // Enable Continue button
    }

    // Return to Auth0 to continue rules processing after getting the user role
    setRole() {
      this.role = JSON.parse(JSON.stringify(this.selectedEntry))['value'];
      // console.log("stateVal from setrole: " + this.stateVal);
      const return_url = 'https://' + environment.auth_domain + '/continue?state=' + this.stateVal + '&user_role=' + this.role;
      // console.log('return url: '' + return_url);
      const qstring = 'state=' + this.stateVal + '&user_role=' + this.role;
      // Redirect to callback to continue with rules processing
      window.location.href = return_url;
    }
}
