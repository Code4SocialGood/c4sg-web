import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Project } from '../project';

@Injectable()
export class SearchProjectService {
    constructor(private http: Http) {}
    search(term: string): Observable<Project[]> {
        return this.http
            .get(`app/project/?name=${term}`)
            .map((r: Response) => r.json().data as Project[]);
    }
}
