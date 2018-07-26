import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Story } from './Story';
import { StoryType } from './StoryType';

// temporary mocked backend
import { STORIES } from './mock-stories';

@Injectable()
export class StoryService {

  constructor() { }

  getStories(type: StoryType ): Observable<Story[]> {
    if (!type) {
      return of(STORIES);
    } else {
      return of(STORIES.filter( story => story.type === type ));
    }
  }

  getStory(id: number): Observable<Story> {
    return of(STORIES[id]);
  }
}
