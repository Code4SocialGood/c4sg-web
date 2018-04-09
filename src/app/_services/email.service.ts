import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class EmailService {

  readonly sendUrl = `${environment.backend_url}/api/email/send`;

  constructor(private http: HttpClient) { }

  send(email: Email): Observable<boolean> {
    return this.http
      .post(this.sendUrl, email, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        observe: 'response',
        responseType: 'text'
      })
      .map(res => {
        return res.status === 200;
      })
      .catch((error: any) => Observable.of(false));
  }
}

export class Email {
  public to: string;
  public from: string;
  public replyTo: string;
  public subject: string;
  public body: string;

  constructor(props) {
    this.to = props.to;
    this.from = props.from;
    this.replyTo = props.replyTo;
    this.subject = props.subject;
    this.body = props.body;
  }
}
