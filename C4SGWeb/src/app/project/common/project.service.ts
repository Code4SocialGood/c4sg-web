import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import { Project } from './project';

@Injectable()
export class ProjectService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private projectUrl = 'http://localhost:8080/api/projects';

  constructor(private http: Http) {
  }

  getProjects() {
    const url = this.projectUrl + '/all';
    return this.http.get(url);
  }

  getProject(id: number): Observable<Response> {
    const index = id + 1;
    const url = this.projectUrl + '/search/byId/' + index;
    return this.http.get(url);
  }

  // TODO replace with search by keyword
  getProjectsByKeyword(keyWord: string): Observable<Response> {
    const url = this.projectUrl + '/search/byKeyword/' + keyWord;
    return this.http
      .get(url);
  }

  add(project: Project): Observable<Project[]> {
    const url = this.projectUrl + '/add';
    return this.http
      .post(url, project, {headers: this.headers})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  delete(id: number) {
    const url = this.projectUrl + '/delete/' + id;
    return this.http
      .delete(url, {headers: this.headers})
      .catch(this.handleError);
  }

  update(project: Project) {
    const url = this.projectUrl + '/update';
    return this.http
      .put(url, project, {headers: this.headers})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
