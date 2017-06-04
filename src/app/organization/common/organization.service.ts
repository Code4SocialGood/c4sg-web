import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';
import { Organization } from './organization';

const organizationUrl = `${environment.backend_url}/api/organizations`;

@Injectable()
export class OrganizationService {
  private organizationLinkedSource = new Subject<string>();
  public organizationLinkedSource$ = this.organizationLinkedSource.asObservable();

  constructor(private http: Http, private jsonp: Jsonp) { }

  getOrganizations(): Observable<Organization[]> {
    return this.http
               .get(organizationUrl)
               .map(res => res.json());
  }

  getOrganization(id: number): Observable<Organization> {
    return this.http
               .get(`${organizationUrl}/${id}`)
               .map(res => res.json());
  }

  getUserOrganization(id: number): Observable<Organization[]> {
    return this.http
               .get(`${organizationUrl}/user/${id}`)
               .map(res => res.json());
  }

  searchOrganizations(
    keyword?: string,
    hasProjects?: boolean,
    categories?: string[]
  ): Observable<Organization[]> {
    const params = new URLSearchParams();

    if (keyword) {
      params.set('keyWord', keyword);
    }

    if (hasProjects) {
      params.set('open', hasProjects.toString());
    }

    if (categories) {
      for (let i = 0; i < categories.length; i++) {
        params.append('categories', categories[i]);
      }
    }

    return this.http
               .get(`${organizationUrl}/search`, {search: params})
               .map(res => res.json());
  }

  createOrganization(organization: Organization): Observable<{organization: Organization}> {
      return this.http.post(
      `${organizationUrl}`,
      organization
      ).map(res => res.json());
  }

  linkUserOrganization(userId: String, organizationId: number) {
    const observable = this.http.post(
      `${organizationUrl}/${organizationId}/users/${userId}`,
      {}
    );

    observable.subscribe(res => {
      this.organizationLinkedSource.next(organizationId.toString());
    });

    return observable;
  }

  updateOrganization(organization: Organization): Observable<Response> {
      return this.http.put(
      `${organizationUrl}/${organization.id}`,
      organization
      );
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
