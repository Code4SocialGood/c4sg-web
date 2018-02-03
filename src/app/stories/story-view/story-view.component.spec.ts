import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryViewComponent } from './story-view.component';

describe('StoryViewComponent', () => {
  let component: StoryViewComponent;
  let fixture: ComponentFixture<StoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
