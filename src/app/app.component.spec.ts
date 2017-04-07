import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppComponent } from './app.component';

describe('App', () => {
  let de: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [provideRoutes([])]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('nav'));
  });

    xit('should create component', () => expect(comp).toBeDefined() );

    xit('should have expected a <nav> tag', () => {
    fixture.detectChanges();
    const nav = de.nativeElement;
    expect(nav).toBeDefined();
  });

  xit('should have class black', () => {
    fixture.detectChanges();
    const nav = de.nativeElement;
    expect(nav.className).toBe('black');
  });

});
