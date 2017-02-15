import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';

@Injectable()
export class VolunteerService {

  private volunteerUrl = "http://localhost:8080/api/users";
  constructor (private http:Http){
  }
  getUsers(): Observable<Response> {
    const url = this.volunteerUrl;
    return this.http.get(url);
  }
}
