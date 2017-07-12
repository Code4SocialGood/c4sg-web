///<reference path="../../../node_modules/@types/node/index.d.ts"/>

import { Injectable } from '@angular/core';
import { Http, Response, Request, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser/';
import { ImageDisplayService, ImageDisplay } from './image-display.service';
import { environment } from '../../environments/environment';
import 'aws-sdk/dist/aws-sdk';

const allowedTypesImages = ['jpg', 'png'];
const allowedTypesDocs = ['doc', 'pdf', 'docx', 'csv', 'xls', 'xlsx'];

@Injectable()
export class ExtFileHandlerService {

  constructor (private http: Http, private optionArgs: RequestOptions) {}

  /*
    Returns a file with the given file name and type
  */
  getFile(fileName: string, type: string): any {
    return '';
  }

  /*
    Uploads a file using a pre-signed url
  */
  uploadFile(fileInput: any, id: number, filetype: string): Observable<string> {
    let credentials = {
      accessKeyId: `${localStorage.getItem('delgId')}`,
      secretAccessKey: `${localStorage.getItem('delgSecId')}`
    };

    // declare an aws service
    const AWSService = (<any> window).AWS;
    if (environment.production && !environment.auth_tenant_shared) {
      const creds: any = JSON.parse(localStorage.getItem('delgcred'));
      credentials = new AWSService.Credentials(creds.AccessKeyId,
                                creds.SecretAccessKey,
                                creds.SessionToken);
    }
    // assign the file to upload
    const file = fileInput.target.files[0];
    // assign the key name
    const keyName = id.toString() + fileInput.target.files[0].name;
    // determine which bucket based on file type
    const bucketName = (filetype === 'doc' ? environment.AWS_DOCS_BUCKET : environment.AWS_IMAGE_BUCKET);
    // create an s3 service
    const s3 = new AWSService.S3({signatureVersion: 'v4',
      credentials: credentials,
      region: environment.AWS_REGION});
    // define params
    const params = {ACL: 'public-read', Bucket: bucketName, Key: keyName, Expires: 180};
    if (filetype === 'doc') {
      delete params['ACL']; // remove public read if file is not an image
    }
    // get pre-signed url based on parms
    const url = s3.getSignedUrl('putObject', params);
    // create request options for url, body and method
    this.optionArgs.url = url;
    this.optionArgs.body = fileInput.target.files[0];
    this.optionArgs.method = 'PUT';

    // submit an http request
    return this.http.request(new Request(this.optionArgs))
      .map(res => res.url.substr(0, res.url.indexOf('?'))) // a put request does not have any data in the body
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
