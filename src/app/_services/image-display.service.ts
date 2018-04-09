import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser/';

export class ImageDisplay {
    url: SafeUrl;
}

@Injectable()
export class ImageDisplayService {
  constructor(private sanitizer: DomSanitizer) {
  }

  private toURI(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + base64);
  }

  private handleError(err: any) {
    console.error(err, 'An error occurred');
  }

  displayImage(id: number,  load: (a: number) => Observable<HttpResponse<string>>): Observable<ImageDisplay> {
    const imageDisplay = new ImageDisplay();
    imageDisplay.url = '';
    const stream = <BehaviorSubject<ImageDisplay>>new BehaviorSubject(imageDisplay);

    load(id).subscribe(res => {
      imageDisplay.url = this.toURI(res.body);
      stream.next(imageDisplay);
    }, this.handleError);

    return stream.asObservable();
  }
}
