import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Project } from './project';
import { environment } from '../../../environments/environment';

const projectUrl = `${environment.backend_url}/api/projects`;

@Injectable()
export class ProjectService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  getProjects(): Observable<Project[]> {
    return this.http
               .get(projectUrl)
               .map(res => res.json())
               .catch(this.handleError);
  }

  getProject(id: number): Observable<Project> {
    const index = id + 1;
    const url = projectUrl + '/' + index;

    return this.http.get(url)
               .map(res => res.json())
               .catch(this.handleError);
  }

  getProjectByUser(id: number): Observable<Response> {
    const url = projectUrl + '/search/byUser/' + id;
    return this.http.get(url);
  }

  getProjectByOrg(id: number): Observable<Response> {
    const url = projectUrl + '/search/byOrganization/' + id;
    return this.http.get(url);
  }

  // TODO replace with search by keyword
  getProjectsByKeyword(keyWord: string): Observable<Project[]> {
    const url = projectUrl + '/search' + keyWord;

    return this.http.get(url)
               .map(res => res.json())
               .catch(this.handleError);
  }

  add(project: Project): Observable<Project[]> {
    const url = projectUrl;
    return this.http
               .post(url, project, {headers: this.headers})
               .map((res: Response) => res.json())
               .catch(this.handleError);
  }

  delete(id: number) {
    const url = projectUrl + id;
    return this.http
               .delete(url, {headers: this.headers})
               .catch(this.handleError);
  }

  update(project: Project) {
    const url = projectUrl + project.id;
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
