import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from '../../../environments/environment';

const userUrl = `${environment.backend_url}/api/user`;

@Injectable()
export class UserService {

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor (private http: Http) { }

    // only active users are retrieved
    getUsers() {
        const url = userUrl + '/all/active';
        return this.http.get(url);
    }

    getUser(id: number): Observable<Response> {
        const index = id;
        const url = userUrl + '/search/byId/' + index;
        return this.http.get(url);
    }

    // TODO replace with search by keyword
    getUsersByKeyword(keyWord: string): Observable<Response> {
        const url = userUrl + '/search/byKeyword/' + keyWord;
        return this.http
            .get(url);
    }

    add(user: User): Observable<User[]> {
        const url = userUrl + '/add';
        return this.http
            .post(url, user, {headers: this.headers})
            .map((res: Response) => res.json())
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

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
