import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const developersUrl = `${environment.backend_url}/api/users/developers`;

@Injectable()
export class DeveloperService {

  constructor(private http: HttpClient) { }

  getDevelopers() {
    return this.http.get(developersUrl, { responseType: 'text' });
  }
}
