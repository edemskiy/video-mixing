/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import Container from '../controls/Container';
import CanvasCamera from '../controls/CanvasCamera';
import CanvasMixer from '../controls/CanvasMixer';
import Camera from '../controls/Camera';
import AdditionalVideoObject from '../controls/AdditionalVideoObject';

class Main extends React.Component {
  componentDidMount() {
    this.container = new Container({
      maxObjectsInLine: 2,
      objectSize: { width: 320, height: 240 },
      basePosition: { x: 0, y: 0 },
      isHorizontal: true,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
    });
    this.canvasMixerMain = new CanvasMixer();    
    this.canvasMixerTest = new CanvasMixer({ objectSize: { width: 200, height: 150 } });    
    this.canvasDiv.appendChild(this.canvasMixerMain.canvasElement);
    this.canvasDiv.appendChild(this.canvasMixerTest.canvasElement);
  }

  addVideo() {
    const canvasCamera = new CanvasCamera({
        audio: false,
        video: { width: 320, height: 240 },
        frameRate: { ideal: 10, max: 15 },
    });
    this.canvasMixerMain.addVideoElement(canvasCamera);
  }

  deleteVideo() {
    if (_.size(this.canvasMixerMain.containers[0].objects)) {
      const objNum = _.random(0, _.size(this.canvasMixerMain.containers[0].objects) - 1);
      const objName = this.canvasMixerMain.containers[0].objects[objNum].name;
      this.canvasMixerMain.deleteVideoElement(objName);
    }
  }

  test() {
    const stream = this.canvasMixerMain.getStream();
    const container = this.canvasMixerMain.containers[0];
    const additionalVideoObject = new AdditionalVideoObject(stream, container);
    this.canvasMixerTest.addVideoElement(additionalVideoObject);
  }

  crop() {

  }

  render() {
    return (
      <div>
        <h1> video container test </h1>
        <button onClick={() => this.test()} >Test button</button>
        <button onClick={() => this.crop()} >crop button</button>
        <button onClick={() => this.addVideo()} >ADD video</button>
        <button onClick={() => this.deleteVideo()} >DELETE video</button>
        <div className="canvases" ref={(c) => { this.canvasDiv = c; }} />
        <div ref={(c) => { this.videoDiv = c; }} />
      </div>
    );
  }
}

export default Main;
