import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

const skillUrl = `${environment.backend_url}/api/skills`;

@Injectable()
export class SkillService {

  constructor(private http: HttpClient) {
  }

  getSkills(): Observable<any> {
    return this.http
      .get(skillUrl)
      .catch(this.handleError);
  }

  getSkillsByProject(id: number): Observable<any> {
    const url = skillUrl + '/project?id=' + id;
    return this.http.get(url)
      .catch(this.handleError);
  }

  getSkillsForUser(id: number): Observable<any> {
    const url = skillUrl + '/user?id=' + id;
    return this.http.get(url)
      .catch(this.handleError);
  }

  updateProjectSkills(projectSkillsArray, id) {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    params = params.append('skillsList', projectSkillsArray.join(','));
    const url = skillUrl + '/project/skills';
    return this.http
      .put(url, null, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        params: params,
        observe: 'response',
        responseType: 'text'
      })
      .map((res: HttpResponse<string>) => {
        if (res.status !== 200) {
          console.error('An error occurred');
          return Promise.reject('An error occurred');
        }
      })
      .catch(this.handleError);
  }

  updateUserSkills(userSkillsArray, id) {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    params = params.append('skillsList', userSkillsArray.join(','));
    const url = skillUrl + '/user/skills';
    return this.http
      .put(url, null, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          .append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        params: params,
        observe: 'response',
        responseType: 'text'
      })
      .map((res: HttpResponse<string>) => {
        if (res.status !== 200) {
          console.error('An error occurred');
          return Promise.reject('An error occurred');
        }
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
