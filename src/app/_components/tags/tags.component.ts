import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'my-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {

  @Input() tags: Array<string>;
  @Input() moreUrl: string;
  @Input() max: number;

  constructor() { }

  ngOnInit() {
  }

  get visibleTags() {
    if ( this.max ) {
      return this.tags.slice(0, this.max);
    } else {
      return this.tags;
    }
  }

  get remainingTagsCount() {
    if ( this.max && this.tags.length > this.max ) {
      return this.tags.length - this.max;
    } else {
      return 0;
    }
  }

}
