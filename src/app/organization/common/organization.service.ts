import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';
import { Organization } from './organization';

const organizationUrl = `${environment.backend_url}/api/organizations`;

@Injectable()
export class OrganizationService {
  private organizationLinkedSource = new Subject<string>();
  public organizationLinkedSource$ = this.organizationLinkedSource.asObservable();

  constructor(private http: HttpClient) {
  }

  getOrganizations(): Observable<Organization[]> {
    return this.http
      .get(organizationUrl)
      .catch(this.handleError);
  }

  getOrganization(id: number): Observable<Organization> {
    return this.http
      .get(`${organizationUrl}/${id}`)
      .catch(this.handleError);
  }

  getUserOrganization(id: number): Observable<Organization[]> {
    return this.http
      .get(`${organizationUrl}/user/${id}`)
      .catch(this.handleError);
  }

  approve(organizationId: number, status: string) {
    return this.http
      .put(`${organizationUrl}/${organizationId}/approve`, '',
        {
          responseType: 'text',
          params: new HttpParams().append('status', `${status}`)
        });
  }

  searchOrganizations(keyword?: string,
    countries?: string[],
    open?: boolean,
    status?: string,
    category?: string[],
    page?: number,
    size?: number): Observable<any> {
    let params = new HttpParams();

    if (keyword) {
      params = params.append('keyWord', keyword);
    }

    if (countries) {
      for (let i = 0; i < countries.length; i++) {
        params = params.append('countries', countries[i]);
      }
    }

    if (open) {
      params = params.append('open', open.toString());
    }

    if (status) {
      params = params.append('status', status);
    }

    if (category) {
      for (let i = 0; i < category.length; i++) {
        params = params.append('category', category[i]);
      }
    }

    if (page) {
      params = params.append('page', String(page - 1));
    }

    if (size) {
      params = params.append('size', String(size));
    }

    return this.http
      .get(`${organizationUrl}/search`, { params: params })
      .catch(this.handleError);
  }

  createOrganization(organization: Organization): Observable<Organization> {
    return this.http.post(
      `${organizationUrl}`,
      organization,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
      }
    ).catch(this.handleError);
  }

  linkUserOrganization(userId: String, organizationId: number) {
    const observable = this.http.post(
      `${organizationUrl}/${organizationId}/users/${userId}`, '',
      {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }),
        responseType: 'text'
      }
    ).catch(this.handleError);

    observable.subscribe(() => {
      this.organizationLinkedSource.next(organizationId.toString());
    });

    return observable;
  }

  updateOrganization(organization: Organization) {
    return this.http.put(
      `${organizationUrl}/${organization.id}`,
      organization,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        observe: 'response',
        responseType: 'text'
      }
    ).catch(this.handleError);
  }

  delete(id: number) {
    return this.http.delete(`${organizationUrl}/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
      observe: 'response',
      responseType: 'text'
    }).catch(this.handleError);
  }

  /*
    Http call to save the logo image
  */
  saveLogoImg(id: number, imgUrl: string) {
    return this.http
      .put(`${organizationUrl}/${id}/logo`, '', {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        params: new HttpParams().append('imgUrl', `${imgUrl}`),
        observe: 'response',
        responseType: 'text'
      });
  }

  getTotalCountries(): Observable<any> {
    return this.http
      .get(`${organizationUrl}/countries/total`)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
