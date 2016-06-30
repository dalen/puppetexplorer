describe('Dashboard', () => {
  beforeEach(() => {
    browser.get('http://localhost:8001/');
  });

  it('should redirect to the dashboard when opening', () => {
    expect(browser.getCurrentUrl()).toMatch(/\/#\/dashboard/);
  });

  it('panels should contain metrics', () => {
    expect(element.all(by.css('div.panel-body')).getText()).toMatch(/^[\d,\.]+\s*%?$/);
  });

  it('redirect to node list when entering a query', () => {
    const form = element(by.css('#node-query-field'));
    form.sendKeys('kernel=Linux');
    form.submit();
    expect(browser.getCurrentUrl()).toMatch(/\/#\/nodes/);
  });
});
