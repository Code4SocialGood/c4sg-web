import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { environment } from '../../../environments/environment';
import { Project } from '../../project/common/project';

const userUrl = `${environment.backend_url}/api/users`;

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private jsonp: Jsonp) { }

  // Page data always starts at offset 0 
  // Only active users are retrieved
  // Returns a JSON object with the data array of Users and totalItems count
  getUsers(page: number): Observable<any> {
    const url = userUrl + '/active?page=' + (page - 1) + '&size=10' + '&sort=id,desc&sort=userName,asc';
    return this.http
               .get(url)
               .map( res => ({data: res.json().content, totalItems: res.json().totalElements}))
               .catch(this.handleError);
  }

  getUser(id: number): Observable<User> {
    const index = id;
    const url = userUrl + '/' + index;

    return this.http
               .get(url, {headers: this.headers})
               .map(res => res.json())
               .catch(this.handleError);
  }

  getUserByEmail(name: string): Observable<User> {
    const url = userUrl + '/email/' + [name] + '/';
    return this.http.get(url)
               .map(res =>  {
                  // Check below is for the scenario when nothing was sent back
                  // The '_body' has a an empty string
                  if (res.text() === '') {
                      return undefined;
                  } else {
                    return res.json();
                  }}
               )
               .catch(this.handleError);
  }

  getUsersByKeyword(userName: string, firstName: string, lastName: string): Observable<User[]> {
    const params = new URLSearchParams();
    params.set('userName', userName);
    params.set('firstName', firstName);
    params.set('lastName', lastName);
    params.set('callback', 'JSONP_CALLBACK');
    const url = userUrl + '/search';

    return this.jsonp
               .get(url, {search: params})
               .map(res => res.json())
               .catch(this.handleError);
  }

  add(user: User): Observable<User> {
    const url = userUrl;
    return this.http
               .post(url, user, {headers: this.headers})
               .map(res => res.json())
               .catch(this.handleError);
  }

  delete(id: number): Observable<Response> {
    const url = userUrl + '/' + id;
    return this.http
               .delete(url, {headers: this.headers})
               .map((res: Response) => res.json())
               .catch(this.handleError);
  }

  update(user: User) {
    const url = userUrl;
    return this.http
               .put(url, user, {headers: this.headers})
               .map((res: Response) => res.json())
               .catch(this.handleError);
  }

  retrieveAvatar(id: number) {
    return this.http
               .get(`${userUrl}/${id}/avatar`);
  }

  saveAvatar(id: number, formData: FormData) {
    return this.http
               .post(`${userUrl}/${id}/avatar`, formData);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
