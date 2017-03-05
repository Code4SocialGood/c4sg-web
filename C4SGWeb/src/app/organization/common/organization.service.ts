import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const organizationUrl = `${environment.backend_url}/api/organization`;

@Injectable()
export class OrganizationService {

  constructor(private http: Http) {
  }

  getOrganizations() {
      return this.http.get(
	  `${organizationUrl}/all`
      );
  }

  getOrganization(id: number): Observable<Response> {
    const index = id - 1;
      return this.http.get(
	  `${organizationUrl}/search/byId/${index}`
      );
  }

  // TODO replace with search by keyword
  getOrganizationsByKeyword(keyWord: string): Observable<Response> {
      return this.http.get(
	  `${organizationUrl}/search/byKeyword/${keyWord}`
      );
  }
}
