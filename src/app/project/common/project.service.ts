import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { JobTitle } from '../../_components/job-title/job-title';
import { Project } from './project';
import { Hero } from '../../user/common/hero';
import { environment } from '../../../environments/environment';

const projectUrl = `${environment.backend_url}/api/projects`;


@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) {
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
    let params = new HttpParams();

    if (keyword) {
      params = params.append('keyWord', keyword);
    }

    // if (jobTitle) {
    // params.append('jobTitle', String(jobTitle));
    // }

    if (jobTitles) {
      for (let i = 0; i < jobTitles.length; i++) {
        params = params.append('jobTitles', String(jobTitles[i]));
      }
    }

    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        params = params.append('skills', skills[i]);
      }
    }

    if (status) {
      params = params.append('status', status);
    }

    if (remote) {
      params = params.append('remote', remote);
    }

    if (page) {
      params = params.append('page', String(page - 1));
    }

    if (size) {
      params = params.append('size', String(size));
    }

    return this.http
      .get(`${projectUrl}/search`, { params: params })
      .catch(this.handleError);
  }

  getProject(id: number): Observable<Project> {

    const url = projectUrl + '/' + id;

    return this.http.get(url)
      .catch(this.handleError);
  }

  getAllProjects(): Observable<Project[]> {
    const url = projectUrl;
    return this.http.get(url)
      .catch(this.handleError);
  }

  getProjectByOrg(id: number, projectStatus: string): Observable<Project[]> {
    if (projectStatus) {
      return this.http.get(`${projectUrl}/organization?organizationId=${id}&projectStatus=${projectStatus}`)
        .catch(this.handleError);
    } else {
      return this.http.get(`${projectUrl}/organization?organizationId=${id}`)
        .catch(this.handleError);
    }
  }

  // This method gets the project by application status and also gets the bookmarked projects
  // But it only returns project object. Application details are not returned
  getProjectByUser(id: number, status: string): Observable<Project[]> {
    return this.http.get(`${projectUrl}/user?userId=${id}&status=${status}`)
      .catch(this.handleError);
  }

  public getAllJobTitles(): Observable<JobTitle[]> {
    const url = projectUrl + '/jobTitles';
    return this.http
      .get(url)
      .catch(this.handleError);
  }

  add(project: Project): Observable<{ project: Project }> {
    return this.http.post(
      `${projectUrl}`,
      project,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
      }
    ).catch(this.handleError);
  }

  delete(id: number) {
    const url = projectUrl + '/' + id;
    return this.http
      .delete(url, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        observe: 'response',
        responseType: 'text'
      })
      .catch(this.handleError);
  }

  update(project: Project) {

    return this.http.put(
      `${projectUrl}/${project.id}`,
      project,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
          observe: 'response',
        responseType: 'text'
      }
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

  createBookmark(projectId: number, userId: string) {

    const url = `${projectUrl}/${projectId}/users/${userId}/bookmarks`;

    return this.http
      .post(url, '', {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        observe: 'response'
      })
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
    const params = new HttpParams().append('imgUrl', `${imgUrl}`);
    return this.http
      .put(`${projectUrl}/${id}/image`, '', {
        params: params,
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        observe: 'response',
        responseType: 'text'
      });
  }

  public getHeroes(): Observable<Hero[]> {
    const url = projectUrl + '/heroes';
    return this.http
      .get(url)
      .catch(this.handleError);
  }
}
