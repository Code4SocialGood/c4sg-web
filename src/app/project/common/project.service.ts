import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams, Jsonp } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { JobTitle } from '../../job-title';
import { Project } from './project';
import { Hero } from '../../user/common/hero';
import { environment } from '../../../environments/environment';
import { AuthHttp } from 'angular2-jwt';

const projectUrl = `${environment.backend_url}/api/projects`;


@Injectable()
export class ProjectService {

  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  searchProjects(
    keyword?: string,
    // jobTitle?: number,
    jobTitles?: number[],
    skills?: string[],
    status?: string,
    remote?: string,
    page?: number,
    size?: number): Observable<any> {
    const params = new URLSearchParams();

    if (keyword) {
      params.append('keyWord', keyword);
    }

    // if (jobTitle) {
      // params.append('jobTitle', String(jobTitle));
    // }

    if (jobTitles) {
      for (let i = 0; i < jobTitles.length; i++) {
        params.append('jobTitles', String(jobTitles[i]));
      }
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

    if (page) {
      params.append('page', String(page - 1));
    }

    if (size) {
      params.append('size', String(size));
    }

    return this.http
      .get(`${projectUrl}/search`, { search: params })
      .map(res => ({ data: res.json().content, totalItems: res.json().totalElements }))
      .catch(this.handleError);
  }

  getProject(id: number): Observable<Project> {

    const url = projectUrl + '/' + id;

    return this.http.get(url)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getAllProjects(): Observable<Project[]> {
        const url = projectUrl;
        return this.http.get(url)
          .map(res => res.json())
          .catch(this.handleError);
      }

  getProjectByOrg(id: number, projectStatus: string): Observable<Response> {
    if (projectStatus) {
      return this.http.get(`${projectUrl}/organization?organizationId=${id}&projectStatus=${projectStatus}`);
    } else {
      return this.http.get(`${projectUrl}/organization?organizationId=${id}`);
    }
  }

  // This method gets the project by application status and also gets the bookmarked projects
  // But it only returns project object. Application details are not returned
  getProjectByUser(id: number, status: string): Observable<Response> {
    return this.http.get(`${projectUrl}/user?userId=${id}&status=${status}`);
  }

  public getAllJobTitles(): Observable<JobTitle[]> {
    const url = projectUrl + '/jobTitles';
    return this.http
               .get(url)
               .map( res => { return res.json() as JobTitle[]; })
               .catch(this.handleError);
  }

  add(project: Project): Observable<{ project: Project }> {
    return this.authHttp.post(
      `${projectUrl}`,
      project
    ).map(res => res.json());
  }

  delete(id: number) {
    const url = projectUrl + '/' + id;
    return this.authHttp
      .delete(url, { headers: this.headers })
      .catch(this.handleError);
  }

  update(project: Project) {

    return this.authHttp.put(
      `${projectUrl}/${project.id}`,
      project
    );
  }

  getUserProjectStatusFromLocalStorage() {
    const bookmarkedProjectsIDs = localStorage.getItem('bookmarkedProjectsIDs');
    const appliedProjectsIDs = localStorage.getItem('appliedProjectsIDs');
    const acceptedProjectsIDs = localStorage.getItem('acceptedProjectsIDs');
    const declinedProjectsIDs = localStorage.getItem('declinedProjectsIDs');
    return {
      'bookmarkedProjectsIDs': bookmarkedProjectsIDs,
      'appliedProjectsIDs': appliedProjectsIDs,
      'acceptedProjectsIDs': acceptedProjectsIDs,
      'declinedProjectsIDs': declinedProjectsIDs
    };
  }

  createBookmark(projectId: number, userId: string): Observable<Response> {

        const url = `${projectUrl}/${projectId}/users/${userId}/bookmarks`;
        return this.authHttp
            .post(url, { headers: this.headers })
            .map(res => res.json())
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  /*
    Http call to save the project image
  */
  saveProjectImg(id: number, imgUrl: string) {
    const requestOptions = new RequestOptions();
    requestOptions.search = new URLSearchParams(`imgUrl=${imgUrl}`);
    return this.authHttp
      .put(`${projectUrl}/${id}/image`, '', requestOptions);
  }

  public getHeroes(): Observable<Hero[]> {
    const url = projectUrl + '/heroes';
    return this.http
               .get(url)
               .map( res => { return res.json() as Hero[]; })
               .catch(this.handleError);
  }
}
