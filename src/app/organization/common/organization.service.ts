import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import { Organization } from './organization';

const organizationUrl = `${environment.backend_url}/api/organizations`;

@Injectable()
export class OrganizationService {

  constructor(private http: Http, private jsonp: Jsonp) { }

  getOrganizations(): Observable<Organization[]> {
    return this.http
               .get(organizationUrl)
               .map(res => res.json());
  }

  getOrganization(id: number): Observable<Organization> {
    const index = id - 1;
    const url = organizationUrl + '/' + index;

    return this.http.get(url)
               .map(res => res.json());
  }

  getOrganizationsByKeyword(keyWord: string): Observable<Organization[]> {
    let param = new URLSearchParams();
    param.set('keyWord', keyWord);
    const url = organizationUrl + '/search';

    return this.jsonp
               .get(organizationUrl, {search: param})
               .map(res => res.json());
  }

  createOrganization(organization: any): Observable<Response> {
    return this.http.post(`${organizationUrl}`, organization);
  }

  delete(id: number): Observable<Response> {
    return this.http.delete(`${organizationUrl}/${id}`);
  }

  saveLogo(organizationId: number, fileContent: string): Observable<Response> {
    return this.http
               .post(`${organizationUrl}/${organizationId}/uploadLogo`,
                 {'': fileContent});
  }

  retrieveLogo(organizationId: number): Observable<Response> {
    return this.http.get(
      `${organizationUrl}/${organizationId}/logo`
    )
  }
  
  getUserOrganization(id: number): Observable<Organization> {
      return this.http.get(
      `${organizationUrl}/user/${id}`
      ).map(res => res.json());
  }
}
