import { C4SGWebPage } from './app.po';

describe('c4-sgweb App', () => {
  let page: C4SGWebPage;

  beforeEach(() => {
    page = new C4SGWebPage();
  });

  xit('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
