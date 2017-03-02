import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Project } from '../common/project';

@Injectable()
export class ProjectSearchService {
    constructor(private http: Http) {}
    search(term: string): Observable<Project[]> {
        return this.http
            .get(`app/project/?name=${term}`)
            .map((r: Response) => r.json().data as Project[]);
    }
}
