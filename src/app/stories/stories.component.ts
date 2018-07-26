import { Component, OnInit } from '@angular/core';
import { StoryType } from './common/StoryType';
import { Story } from './common/Story';
import {AuthService} from '../auth.service';

import {StoryService} from './common/story.service';

@Component({
  selector: 'my-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {

  volunteerStories: Story[] = [];
  organizationsStories: Story[] = [];

  constructor(public authSvc: AuthService, private storyService: StoryService
  ) { }

  ngOnInit(): void {
    this.getFirstVolunteerStories();
    this.getFirstOrganizationsStories();
  }

  /**
   * Get volunteer stories
   */
  private getFirstVolunteerStories(): void {
     this.storyService.getStories(StoryType.VOLUNTEER)
    .subscribe(volunteerStories => this.volunteerStories = volunteerStories);
  }

  /**
   * Get organizations stories
   */
  private getFirstOrganizationsStories(): void {
    this.storyService.getStories(StoryType.ORGANIZATION)
   .subscribe(organizationsStories => this.organizationsStories = organizationsStories);
  }

}
