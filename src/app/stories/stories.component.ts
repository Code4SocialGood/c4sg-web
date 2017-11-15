import { Component, OnInit } from '@angular/core';
import { StoryType } from './common/StoryType';
import { Story } from './common/Story';
import {AuthService} from '../auth.service';

@Component({
  selector: 'my-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {

  volunteerStories: Story[] = [];
  organizationsStories: Story[] = [];

  constructor(public authSvc: AuthService
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
  //  for (let i = 0; i < 3; i++) {
  //    stories.push(
  //      new Story(i, 'Coming soon ...' + '',
  //        'Comming soon ...',
  //         type, '../../assets/image.jpeg'));
  //  }

    /** DUMMY DATA */
    if (type === StoryType.VOLUNTEER) {
      stories.push(new Story(0,
      // tslint:disable-next-line:max-line-length
      'I was only 10 years old when I first got totally addicted to the idea of programming a video game myself. I started with small steps, from things such as Game Maker, to actual coding languages, and discovered a whole world full of amazing things I had never seen before. Now that 6 years have passed, I have kind of shifted my  ...',
      '1', StoryType.VOLUNTEER, '../../assets/default_avatar.png'));

      stories.push(new Story(1, 'Coming soon ...', '2', StoryType.VOLUNTEER, '../../assets/default_avatar.png'));

      stories.push(new Story(2, 'Coming soon ...', '3', StoryType.VOLUNTEER, '../../assets/default_avatar.png'));

    } else {
      stories.push(new Story(0,
      // tslint:disable-next-line:max-line-length
      'When new volunteers join a project of mine (or where I am volunteer coordinator) I like to ask them what their goals are for the project, for example: 1. developing their tech skills 2. learning new tech skills 3. learning to work collaboratively (using git for example) 4. meeting friends in their own field/area 5. doing things together with ...',
      '1', StoryType.ORGANIZATION, 'https://s3-us-west-2.amazonaws.com/c4sg.images/662full-size-logo.png'));

      stories.push(new Story(1,
      // tslint:disable-next-line:max-line-length
      'A couple of years ago i read the book "Producing Open Source Software", one of the ideas in the book is to have different responsibilities for volunteers, so for example someone may want to be the documentation manager, another person can be the issue list manager. One nice thing with this approach is that people ...',
      '2', StoryType.ORGANIZATION, 'https://s3-us-west-2.amazonaws.com/c4sg.images/662full-size-logo.png'));

      stories.push(new Story(2, 'Coming soon ...', '3', StoryType.ORGANIZATION, '../../assets/default_image.png'));
    }

    return stories;
  }

}
