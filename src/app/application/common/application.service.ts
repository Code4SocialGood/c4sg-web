import { Injectable } from '@angular/core';
import { Application } from './application';
import { Applicant } from './applicant';
import { ApplicationProject } from './applicationProject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';

const applicationUrl = `${environment.backend_url}/api/projects/applications`;
const applicantUrl = `${environment.backend_url}/api/projects`;

@Injectable()
export class ApplicationService {

    constructor(private authHttp: AuthHttp, private http: Http) {

    }

    getApplication(id: number): void {
        // not implemented in back end
    }

    getApplicationsByProject(projectId: number): void {
        // not implemented in back end
    }

    getApplicationsByUser(userId: number, status: string): void {

       // not implemented in back end

    }

    public getApplicants(projectId: number): Observable<Applicant[]> {
        const url = `${applicantUrl}/${projectId}/applicants`;
        return this.http
                   .get(url)
                   .map(res => res.json())
                   .catch(this.handleError);
      }

    public getApplicationsByOrgAndApplicant(
            nonProfitUserId: number, applicantId: number, status: string
            ): Observable<ApplicationProject[]> {

        const url = `${applicantUrl}/applicants/${applicantId}/users/${nonProfitUserId}?status=${status}`;
        return this.http
                   .get(url)
                   .map(res => res.json())
                   .catch(this.handleError);
    }

    createApplication(application: Application): Observable<Application> {

        return this.authHttp
            .post(applicationUrl, application)
            .map(res => res.json())
            .catch(this.handleError);

    }

    updateApplication(application: Application): Observable<Application> {

        return this.authHttp
            .put(applicationUrl, application)
            .map(res => res.json())
            .catch(this.handleError);

    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    saveHero(projectId: number, userId: number)  {
        return this.authHttp
            .post(`${applicantUrl}/${projectId}/users/${userId}/badge`, {})
            .catch(this.handleError);
    }

}
