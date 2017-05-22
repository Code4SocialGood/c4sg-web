import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {Project} from './project';
import {environment} from '../../../environments/environment';

const projectUrl = `${environment.backend_url}/api/projects`;


@Injectable()
export class ProjectService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getProjects(): Observable<Project[]> {
    return this.http
      .get(projectUrl)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getActiveProjects(): Observable<Project[]> {

    const url = projectUrl + '/search';

    return this.http.get(url)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getProject(id: number): Observable<Project> {

    const url = projectUrl + '/' + id;

    return this.http.get(url)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getProjectByOrg(id: number): Observable<Response> {
    return this.http.get(`${projectUrl}/organizations/${id}`);
  }

  getProjectByUser(id: number, userProjectStatus: string): Observable<Response> {
    return this.http.get(`${projectUrl}/user?userId=${id}&userProjectStatus=${userProjectStatus}`);
  }

  searchProjects(keyword?: string, skills?: string[], status?: string, remote?: string): Observable<Project[]> {
    const params = new URLSearchParams();

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

    if (remote) {
      params.append('remote', remote);
    }

    return this.http
      .get(`${projectUrl}/search`, {search: params})
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
    const url = projectUrl + '/' + id;
    return this.http
      .delete(url, {headers: this.headers})
      .catch(this.handleError);
  }

  update(project: Project) {
    const url = projectUrl + '/' + project.id;
    return this.http
      .put(url, project, {headers: this.headers})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }


  bookmark(projectId: number, userId: string) {
    const url = projectUrl + '/bookmark/projects/' + projectId + '/users/' + userId;
    return this.http
      .post(url, {headers: this.headers})
      .catch(this.handleError);
  }

  retrieveImage(id: number) {
    const url = projectUrl + '/' + id + '/image';
    return this.http
      .get(url);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
