describe('Node List', () => {
  beforeEach(() => {
    browser.get('http://localhost:8001/');
    element(by.css('#menu-nodes')).click();
  });

  it('should display the node list view', () => {
    expect(browser.getCurrentUrl()).toMatch(/\/#\/nodes/);
  });

  it('displays a list of nodes', () => {
    expect(element.all(by.css('tr')).count()).toBeGreaterThan(0);
  });

  it('displays a warning when it cannot find any nodes', () => {
    const form = element(by.css('#node-query-field'));
    form.sendKeys('foo=bar and foo!=bar');
    form.submit();
    expect(element(by.css('div.alert.alert-warning')).getText()).toEqual('No nodes found');
  });
});
