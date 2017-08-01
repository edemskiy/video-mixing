/* eslint-disable */
/* global describe, it, beforeEach, afterEach */
import chai from 'chai';
import _ from 'lodash';
import atomus from 'atomus';
import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import Camera from '../controls/Camera';

const assert = chai.assert;
const expect = chai.expect;

const htmlStr = '<body><h1>Atomus</h1></body>';
// const atom = atomus();

const successCamStreamCb = (stream) => {
    it('stream is object', () => {
      expect(stream).to.be.an('object');
    });
    it('stream is active', () => {
      assert.equal(stream.active, true);
    });
  }

  const rejectCamStreamCb = (err) => {
    throw err;
  }

describe('cameraTest', () => {
  let chromeOpts = new chrome.Options();
  let constraints = {
        audio: false,
        video: { width: 320, height: 240 },
        frameRate: { ideal: 10, max: 15 },
      };

  chromeOpts.addArguments([  
    '--user-data-dir=<absolute path to the data/profile folder here>',
    '--disable-user-media-security',
    '--use-fake-ui-for-media-stream', 
    '--use-fake-device-for-media-stream', 
    '--disable-web-security', 
    '--reduce-security-for-testing']
  );

  it('check nothing', () => {
    const browser = new webdriver.Builder().setChromeOptions(chromeOpts).forBrowser('chrome').build();  
    // const browser = new webdriver.Builder().forBrowser('chrome').build();
    browser.get('http://127.0.0.1/');
    browser.executeScript(`navigator.mediaDevices.getUserMedia(${JSON.stringify(constraints)}).then((stream) => {
          console.log(stream.active);
        })`);
    // navigator.mediaDevices.getUserMedia = browser.executeScript('return navigator.webkitgetUserMedia');
    // console.log(navigator.mediaDevices.getUserMedia);


    // navigator.mediaDevices.getUserMedia = browser.executeScript('return navigator.mediaDevices.getUserMedia');
    // console.log(navigator.mediaDevices.getUserMedia);
    // const camera = new Camera();
    // browser.quit();
    // camera.toggleCamera(successCamStreamCb, rejectCamStreamCb);
    
  });
});
