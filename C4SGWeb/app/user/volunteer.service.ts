import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class VolunteerService {

  private volunteerUrl = 'http://localhost:8080/api/users';

  constructor(private http: Http) {
  }

  getVolunteers() {
    const url = this.volunteerUrl;
    return this.http.get(url);
  }

  getVolunteer(id: number): Observable<Response> {
    const index = id - 1;
    const url = this.volunteerUrl + '/search/byId/' + index;
    return this.http.get(url);
  }
}
