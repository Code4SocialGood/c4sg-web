import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class OrganizationService {

  private organizationUrl = 'http://localhost:8080/api/organization';

  constructor(private http: Http) {
  }

  getOrganizations() {
    const url = this.organizationUrl + '/all';
    return this.http.get(url);
  }

  getOrganization(id: number): Observable<Response> {
    const index = id - 1;
    const url = this.organizationUrl + '/search/byId/' + index;
    return this.http.get(url);
  }

  // TODO replace with search by keyword
  getOrganizationsByKeyword(keyWord: string): Observable<Response> {
    const url = this.organizationUrl + '/search/byKeyword/' + keyWord;
    return this.http
      .get(url);
  }
}
