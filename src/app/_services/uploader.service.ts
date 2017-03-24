import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser/';

@Injectable()
export class UploaderService {
  constructor(private sanitizer: DomSanitizer) {
  }

  private toURI(base64: string): SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64, '+ base64);
  }

  private toImageData(uri: string): string {
    return uri.split('.')[1]
  }

  private sanitize(uri: string): SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(uri)
  }

  uploadImage(fileInput: any, id: number, save: (a:number, b:FormData) => Observable<Response>, setImage: (a: SafeUrl) => void) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader()
      reader.onload = (e : any): void => {
        const base64Image = e.target.result        
        const formData = new FormData()
        formData.append('file', fileInput.target.files[0], fileInput.target.files[0].name)
        save(id, formData)
          .subscribe(
            res => { 
              console.log('Saved image successfully')
              setImage(this.sanitize(base64Image))
            },
            err => console.error('An error occurred', err))
      }
      reader.readAsDataURL(fileInput.target.files[0])
    }

  }

  displayImage(id: number, load: (a:number) => Observable<Response>, setImage: (a: SafeUrl )=> void,  cb?: (a?: Response) => void) {
    return load(id).subscribe(
      res => {
        console.log('Loaded image successfully')
        setImage(this.toURI(res.text()))
        if (cb!==null&&cb!==undefined) cb(res)
      },
      err => console.error('An error occurred', err))
  }
}