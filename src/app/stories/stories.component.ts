import { Component, OnInit } from '@angular/core';
import { StoryType } from './common/StoryType';
import { Story } from './common/Story';

@Component({
  selector: 'my-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {

  volunteerStories: Story[] = [];
  organizationsStories: Story[] = [];

  constructor(
  ) { }

  ngOnInit(): void {
    this.getFirstVolunteerStories();
    this.getFirstOrganizationsStories();
  }

  /**
   * Get volunteer stories
   */
  private getFirstVolunteerStories(): void {
    this.volunteerStories = this.getStories(StoryType.VOLUNTEER);
  }

  /**
   * Get organizations stories
   */
  private getFirstOrganizationsStories(): void {
    this.organizationsStories = this.getStories(StoryType.ORGANIZATION);

  }

  private getStories(type: StoryType): Story[] {
    const stories = [];

    /** DUMMY DATA */
    for (let i = 0; i < 3; i++) {
      stories.push(
        new Story(i, 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut' + type,
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut',
           type, '../../assets/image.jpeg'));
    }

    return stories;
  }

}
