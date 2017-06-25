import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  xit('should have a title', () => {
    const subject = browser.getTitle();
    const result  = 'Code for Social Good';
    expect(subject).toEqual(result);
  });

  it('should have a nav bar', () => {
    const subject = element(by.css('nav')).isPresent();
    const result  = true;
    expect(subject).toEqual(result);
  });

  xit('should have h2 content', () => {
    const subject = element(by.css('h2')).getText();
    const result  = 'Where Tech Volunteers Meet Nonprofits';
    expect(subject).toEqual(result);
  });

  it('should have a search button', () => {
    const subject = element(by.css('button')).getText();
    const result  = 'search';
    expect(subject).toEqual(result);
  });

});
