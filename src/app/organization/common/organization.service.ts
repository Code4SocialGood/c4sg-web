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
    return this.http.get(`${organizationUrl}/${id}`)
               .map(res => res.json());
  }

  getOrganizationsByKeyword(keyWord: string): Observable<Organization[]> {
    const param = new URLSearchParams();
    param.set('keyWord', keyWord);
    const url = organizationUrl + '/search';

    return this.jsonp
               .get(organizationUrl, {search: param})
               .map(res => res.json());
  }

  getUserOrganization(id: number): Observable<Response> {
      return this.http.get(
      `${organizationUrl}/user/${id}`
      );
    }

  createOrganization(organization: any): Observable<Response> {
    return this.http.post(`${organizationUrl}`, organization);
  }

  delete(id: number): Observable<Response> {
    return this.http.delete(`${organizationUrl}/${id}`);
  }

  saveLogo(id: number, formData: FormData): Observable<Response> {
    return this.http
               .post(`${organizationUrl}/${id}/logo`,
                 formData);
  }

  retrieveLogo(id: number): Observable<Response> {
    return this.http.get(
      `${organizationUrl}/${id}/logo`
    );
  }
}
