import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { StoryService } from '../common/story.service';
import { StoryType } from '../common/StoryType';
import { Story } from '../common/Story';

@Component({
  selector: 'my-story-view',
  templateUrl: './story-view.component.html',
  styleUrls: ['./story-view.component.scss']
})
export class StoryViewComponent implements OnInit {

  story: Story;
  StoryType = StoryType;

  constructor(
    private storyService: StoryService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    const id = this.route.snapshot.params['storyId'];
    this.getStory(id);
  }

  getStory(id: number) {
    this.storyService.getStory(id).subscribe(
      res => {
        this.story = res;
      },
      error => console.log(error)
    );
  }

  goBack(): void {
    localStorage.setItem('prevPage', 'StoryView');
    this.location.back();
  }

}
