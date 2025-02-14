const path = require('path');
const assert = require('power-assert');

const _ = require('../lib/helper');
const Playwright = require('../lib/macaca-playwright');

const headless = !!process.env.CI;

describe('unit testing', function() {
  let res;
  this.timeout(5 * 60E3);
  const customUserAgent = 'custom userAgent';

  describe('methods testing with chromium', function() {

    const driver = new Playwright();

    before(async () => {
      const videoDir = path.resolve(__dirname, '..', 'videos');
      await driver.startDevice({
        headless,
        userAgent: customUserAgent,
        recordVideo: {
          dir: videoDir,
        },
      });
    });

    it('Playwright device should be ok', () => {
      assert(driver);
    });

    it('get should be ok', async () => {
      await driver.get('file://' + path.resolve(__dirname, 'webpages/1.html'));
      await driver.maximize();
      const html = await driver.getSource();
      assert(html.includes('<html>'));
      const uesrAgent = await driver.execute('return navigator.userAgent');
      assert.equal(uesrAgent, customUserAgent);
    });

    it('get title', async () => {
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    it('set window size', async () => {
      await driver.setWindowSize(null, 600, 600);
    });

    it('screenshot', async () => {
      const base64 = await driver.getScreenshot();
      assert(base64.match(/^[0-9a-z\/+=]+$/i));
    });

    it('element screenshot', async () => {
      await driver.page.setContent('<div><button id="input">Click me</button></div>');
      await driver.findElement('XPath', '//*[@id="input"]');
      const base64 = await driver.takeElementScreenshot();
      assert(base64.match(/^[0-9a-z\/+=]+$/i));
    });

    it('set input value', async () => {
      const input = await driver.findElement('id', 'input');
      await driver.setValue(input.ELEMENT, 'aaa');
      await driver.clearText(input.ELEMENT);
      await driver.setValue(input.ELEMENT, 'macaca');
      const style = await driver.getComputedCss(input.ELEMENT, 'display');
      assert.equal(style, 'inline-block');
      await _.sleep(500);
    });

    it('element attr', async () => {
      const button = await driver.findElement('id', 'button-1');
      const buttonIsDiaplayed = await driver.isDisplayed(button.ELEMENT);
      assert.equal(buttonIsDiaplayed, true);

      const bgColor = await driver.getComputedCss(button.ELEMENT, 'background-color');
      assert.equal(bgColor, 'rgb(255, 255, 255)');
    });

    it('click button', async () => {
      const button = await driver.findElement('id', 'button-1');
      await driver.click(button.ELEMENT);
      await _.sleep(300);
      const box = await driver.findElement('id', 'target');
      const boxText = await driver.getText(box.ELEMENT);
      assert.equal(boxText, 'macaca');
    });

    it('click link', async () => {
      const link = await driver.findElement('id', 'link-1');
      await driver.click(link.ELEMENT);
      await _.sleep(1000);
      const title = await driver.title();
      assert.equal(title, 'Document 2');
    });

    it('history back', async () => {
      await driver.back();
      await _.sleep(1000);
      await driver.refresh();
      await _.sleep(1000);
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    it('open in new window', async () => {
      const link = await driver.findElement('id', 'link-2');
      await driver.click(link.ELEMENT);
      await driver.maximize();
      await _.sleep(1000);
    });

    it('window handlers', async () => {
      const windows = await driver.getWindows();
      assert.equal(windows.length, 1);
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    it('getAllCookies', async () => {
      await driver.get('https://www.baidu.com');
      res = await driver.getAllCookies();
      assert(Array.isArray(res));
    });

    describe('context', () => {
      it('should be ok', async () => {
        await driver.get('https://www.baidu.com');
        res = await driver.getContexts();
        assert.equal(res.length, 1);
        await driver.setContext('foo');
        res = await driver.getContexts();
        assert.equal(res.length, 2);
        assert.equal(driver.currentContextIndex, 1);
        await driver.setContext('bar');
        assert.equal(res.length, 3);
        assert.equal(driver.currentContextIndex, 2);
        await driver.setContext('foo');
        assert.equal(res.length, 3);
        assert.equal(driver.currentContextIndex, 1);
        await driver.get('https://www.baidu.com');
      });
    });

    after(async () => {
      await driver.stopDevice();
    });
  });

  describe.skip('methods testing with firefox', function() {

    const driver = new Playwright();

    before(async () => {
      const videoDir = path.resolve(__dirname, '..', 'videos');
      await driver.startDevice({
        headless: true,
        userAgent: customUserAgent,
        recordVideo: {
          dir: videoDir,
        },
        browserName: 'firefox',
      });
    });

    it('Playwright device should be ok', () => {
      assert(driver);
    });

    it('get should be ok', async () => {
      await driver.get('file://' + path.resolve(__dirname, 'webpages/1.html'));
      await driver.maximize();
      const html = await driver.getSource();
      assert(html.includes('<html>'));
      const uesrAgent = await driver.execute('return navigator.userAgent');
      assert.equal(uesrAgent, customUserAgent);
    });

    it('get title', async () => {
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    it('set window size', async () => {
      await driver.setWindowSize(null, 600, 600);
    });

    it('screenshot', async () => {
      const base64 = await driver.getScreenshot();
      assert(base64.match(/^[0-9a-z\/+=]+$/i));
    });

    it('set input value', async () => {
      const input = await driver.findElement('id', 'input');
      await driver.setValue(input.ELEMENT, 'aaa');
      await driver.clearText(input.ELEMENT);
      await driver.setValue(input.ELEMENT, 'macaca');
      const style = await driver.getComputedCss(input.ELEMENT, 'display');
      assert.equal(style, 'inline-block');
      await _.sleep(500);
    });

    it('element attr', async () => {
      const button = await driver.findElement('id', 'button-1');
      const buttonIsDiaplayed = await driver.isDisplayed(button.ELEMENT);
      assert.equal(buttonIsDiaplayed, true);

      const bgColor = await driver.getComputedCss(button.ELEMENT, 'background-color');
      assert.equal(bgColor, 'rgb(255, 255, 255)');
    });

    it('click button', async () => {
      const button = await driver.findElement('id', 'button-1');
      await driver.click(button.ELEMENT);
      await _.sleep(300);
      const box = await driver.findElement('id', 'target');
      const boxText = await driver.getText(box.ELEMENT);
      assert.equal(boxText, 'macaca');
    });

    it('click link', async () => {
      const link = await driver.findElement('id', 'link-1');
      await driver.click(link.ELEMENT);
      await _.sleep(1000);
      const title = await driver.title();
      assert.equal(title, 'Document 2');
    });

    it('history back', async () => {
      await driver.back();
      await _.sleep(1000);
      await driver.refresh();
      await _.sleep(1000);
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    it('open in new window', async () => {
      const link = await driver.findElement('id', 'link-2');
      await driver.click(link.ELEMENT);
      await driver.maximize();
      await _.sleep(1000);
    });

    it('window handlers', async () => {
      const windows = await driver.getWindows();
      assert.equal(windows.length, 1);
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    after(async () => {
      await driver.stopDevice();
    });
  });

  describe('methods testing with webkit', function() {

    const driver = new Playwright();

    before(async () => {
      const videoDir = path.resolve(__dirname, '..', 'videos');
      await driver.startDevice({
        headless: true,
        userAgent: customUserAgent,
        recordVideo: {
          dir: videoDir,
        },
        browserName: 'webkit',
      });
    });

    it('Playwright device should be ok', () => {
      assert(driver);
    });

    it('get should be ok', async () => {
      await driver.get('file://' + path.resolve(__dirname, 'webpages/1.html'));
      await driver.maximize();
      const html = await driver.getSource();
      assert(html.includes('<html>'));
      const uesrAgent = await driver.execute('return navigator.userAgent');
      assert.equal(uesrAgent, customUserAgent);
    });

    it('get title', async () => {
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    it('set window size', async () => {
      await driver.setWindowSize(null, 600, 600);
    });

    it('screenshot', async () => {
      const base64 = await driver.getScreenshot();
      assert(base64.match(/^[0-9a-z\/+=]+$/i));
    });

    it('set input value', async () => {
      const input = await driver.findElement('id', 'input');
      await driver.setValue(input.ELEMENT, 'aaa');
      await driver.clearText(input.ELEMENT);
      await driver.setValue(input.ELEMENT, 'macaca');
      const style = await driver.getComputedCss(input.ELEMENT, 'display');
      assert.equal(style, 'inline-block');
      await _.sleep(500);
    });

    it('element attr', async () => {
      const button = await driver.findElement('id', 'button-1');
      const buttonIsDiaplayed = await driver.isDisplayed(button.ELEMENT);
      assert.equal(buttonIsDiaplayed, true);

      const bgColor = await driver.getComputedCss(button.ELEMENT, 'background-color');
      assert.equal(bgColor, 'rgb(255, 255, 255)');
    });

    it('click button', async () => {
      const button = await driver.findElement('id', 'button-1');
      await driver.click(button.ELEMENT);
      await _.sleep(300);
      const box = await driver.findElement('id', 'target');
      const boxText = await driver.getText(box.ELEMENT);
      assert.equal(boxText, 'macaca');
    });

    it('click link', async () => {
      const link = await driver.findElement('id', 'link-1');
      await driver.click(link.ELEMENT);
      await _.sleep(1000);
      const title = await driver.title();
      assert.equal(title, 'Document 2');
    });

    it('history back', async () => {
      await driver.back();
      await _.sleep(1000);
      await driver.refresh();
      await _.sleep(1000);
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    it('open in new window', async () => {
      const link = await driver.findElement('id', 'link-2');
      await driver.click(link.ELEMENT);
      await driver.maximize();
      await _.sleep(1000);
    });

    it('window handlers', async () => {
      const windows = await driver.getWindows();
      assert.equal(windows.length, 1);
      const title = await driver.title();
      assert.equal(title, 'Document 1');
    });

    after(async () => {
      await driver.stopDevice();
    });
  });
});
