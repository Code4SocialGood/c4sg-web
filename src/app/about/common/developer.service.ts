import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';

const developersUrl = `${environment.backend_url}/api/users`;

@Injectable()
export class DeveloperService {

  constructor (private http: Http) { }

  getDevelopers() {
    return this.http.get(developersUrl);
  }
}
