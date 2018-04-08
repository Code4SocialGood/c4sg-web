import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser/';
import { ImageDisplayService, ImageDisplay } from './image-display.service';

export class ImageReaderResponse {
  base64Image = '';
  formData: FormData;
}

@Injectable()
export class ImageUploaderService {
  constructor(private sanitizer: DomSanitizer) {
  }

  private toImageData(uri: string): string {
    return uri.split('.')[1];
  }

  private sanitize(uri: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(uri);
  }

  private handleError(err: any) {
      console.error(err, 'An error occurred');
  }

  readImage(fileInput: any): Observable<ImageReaderResponse> {
    const data = new ImageReaderResponse();
    const stream = new  BehaviorSubject(data);
    const reader = new FileReader();
    if (fileInput.target.files && fileInput.target.files[0]) {
      reader.onload = (e: any) => {
        data.base64Image = e.target.result;
        data.formData = new FormData();
        data.formData.append('file', fileInput.target.files[0], fileInput.target.files[0].name);
        stream.next(data);
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return stream.asObservable();
  }

  uploadImage(fileInput: any, id: number, save: (a: number, b: FormData) => Observable<Response>): Observable<ImageDisplay> {
    const imageDisplay = new ImageDisplay();
    imageDisplay.url = '';
    const stream = new BehaviorSubject(imageDisplay);

    this.readImage(fileInput).subscribe(x => {
      if (x.formData === undefined) {
        return;
      }
      save(id, x.formData).subscribe(y => {
        imageDisplay.url = this.sanitize(x.base64Image);
        stream.next(imageDisplay);
      });
    });

    return stream.asObservable();

  }
}
