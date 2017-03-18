import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  xit('should have a title', () => {
    let subject = browser.getTitle();
    let result  = 'Code for Social Good';
    expect(subject).toEqual(result);
  });

  it('should have a nav bar', () => {
    let subject = element(by.css('nav')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  xit('should have h2 content', () => {
    let subject = element(by.css('h2')).getText();
    let result  = 'Where Tech Volunteers Meet Nonprofits';
    expect(subject).toEqual(result);
  });

  it('should have a search button', () => {
    let subject = element(by.css('button')).getText();
    let result  = 'search';
    expect(subject).toEqual(result);
  });

});
