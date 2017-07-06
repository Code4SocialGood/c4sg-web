import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams, Jsonp } from '@angular/http';
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
    countries?: string[],
    open?: boolean,
    status?: string,
    category?: string[],
    page?: number,
    size?: number
  ): Observable<any> {
    const params = new URLSearchParams();

    if (keyword) {
      params.set('keyWord', keyword);
    }

    if (countries) {
      for (let i = 0; i < countries.length; i++) {
        params.append('countries', countries[i]);
      }
    }

    if (open) {
      params.set('open', open.toString());
    }

    if (status) {
      params.append('status', status);
    }

    if (category) {
      for (let i = 0; i < category.length; i++) {
        params.append('category', category[i]);
      }
    }

    if (page) {
      params.append('page', String(page - 1));
    }

    if (size) {
      params.append('size', String(size));
    }

    return this.http
      .get(`${organizationUrl}/search`, {search: params})
      .map( res => ({data: res.json().content, totalItems: res.json().totalElements}))
      .catch(this.handleError);
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

  /*
    Http call to save the logo image
  */
  saveLogoImg(id: number, imgUrl: string) {
    const requestOptions = new RequestOptions();
    requestOptions.search = new URLSearchParams(`imgUrl=${imgUrl}`);
    return this.http
      .put(`${organizationUrl}/${id}/logo`, '', requestOptions);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
