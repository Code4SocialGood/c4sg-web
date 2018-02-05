import { TestBed, inject } from '@angular/core/testing';

import { StoryService } from './story.service';

describe('StoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoryService]
    });
  });

  it('should be created', inject([StoryService], (service: StoryService) => {
    expect(service).toBeTruthy();
  }));
});
