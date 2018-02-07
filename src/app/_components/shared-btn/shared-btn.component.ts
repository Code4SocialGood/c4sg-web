import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Project } from '../../project/common/project';
import { SHARERS } from './SHARERS';

@Component({
  selector: 'my-shared-btn',
  providers: [SHARERS],
  templateUrl: './shared-btn.component.html',
  styleUrls: ['./shared-btn.component.scss']
})
export class SharedBtnComponent implements OnInit {
  @Input('displayShare') displayShare: boolean;
  @Input() project: Project;

  private origin: string;

  constructor(private sharers: SHARERS) {
    this.origin = this.getOrigin();
  }

  private getOrigin(): string {
    if (environment.production) {
      return location.origin;
    } else {
      return 'https://app.code4socialgood.org';
    }
  }

  private openSharePopup(href: string): void {
    console.log(this.project);
    window.open(href, '', 'scrollbars=yes,menubar=no,width=700,height=600,resizable=yes,toolbar=no,location=no,status=no');
  }

  shareOnFacebook(event: MouseEvent): void {
    event.preventDefault();
    const href: string = this.sharers.facebook + this.origin + location.pathname;
    this.openSharePopup(href);
  }

  shareOnTwitter(event: MouseEvent): void {
    event.preventDefault();
    const href: string = this.sharers.twitter + this.origin + location.pathname;
    this.openSharePopup(href);
  }

  shareByEmail(event: MouseEvent): void {
    event.preventDefault();
    const subject: string = encodeURIComponent(this.project.name);
    const body: string = encodeURIComponent(`${this.project.description}\n\n${this.origin}${location.pathname}`
    );
    location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  shareOnLinkedin(event: MouseEvent): void {
    event.preventDefault();
    const href: string = this.sharers.linkedin + this.origin + location.pathname;
    this.openSharePopup(href);
  }

  ngOnInit() {
  }
}
