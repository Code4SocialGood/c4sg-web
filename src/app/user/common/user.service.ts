import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { environment } from '../../../environments/environment';
import { Project } from '../../project/common/project';

const userUrl = `${environment.backend_url}/api/users`;
const skillsUrl = `${environment.backend_url}/api/skills`;

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private jsonp: Jsonp) { }

  // Page data always starts at offset zero (0)
  // Only active users are retrieved
  // Returns a JSON object with the data array of Users and totalItems count
  /* obsolete
  public getUsers(page: number): Observable<any> {
    const url = userUrl + '/active?page=' + (page - 1) + '&size=10' + '&sort=id,desc&sort=userName,asc';
    return this.http
               .get(url)
               .map( res => ({data: res.json().content, totalItems: res.json().totalElements}))
               .catch(this.handleError);
  } */

  public getAllUsers(): Observable<User[]> {
    const url = userUrl;
    return this.http
               .get(url)
               .map( res => { return res.json() as User[]; })
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

  searchUsers(keyword?: string, skills?: string[], status?: string,
    role?: string, publicFlag?: string, page?: number, size?: number): Observable<any> {
    const params = new URLSearchParams();

    // TODO Append page, sort here

    if (keyword) {
      params.append('keyWord', keyword);
    }

    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        params.append('skills', skills[i]);
      }
    }

    if (status) {
      params.append('status', status);
    }

    if (role) {
      params.append('role', role);
    }

    if (publicFlag) {
      params.append('publicFlag', publicFlag);
    }

    if (page) {
      params.append('page', String(page - 1));
    }

    if (size) {
      params.append('size', String(size));
    }

    return this.http
               .get(`${userUrl}/search`, {search: params})
               .map( res => ({data: res.json().content, totalItems: res.json().totalElements}))
               .catch(this.handleError);
  }

  add(user: User): Observable<User> {
    const url = userUrl;
    return this.http
               .post(url, user, {headers: this.headers})
               .map(res => res.json())
               .catch(this.handleError);
  }

  delete(id: number)  {
    const url = userUrl + '/' + id;
    return this.http
               .delete(url, {headers: this.headers})
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

  /*
    Http call to save the avatar image
  */
  saveAvatarImg(id: number, imgUrl: string) {
    const requestOptions = new RequestOptions();
    requestOptions.search = new URLSearchParams(`imgUrl=${imgUrl}`);
    return this.http
      .put(`${userUrl}/${id}/avatar`, '', requestOptions);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
