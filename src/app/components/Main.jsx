/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import Container from '../controls/Container';
import CanvasCamera from '../controls/CanvasCamera';
import CanvasMixer from '../controls/CanvasMixer';
import Camera from '../controls/Camera';

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
    this.canvasMixer = new CanvasMixer();    
    this.canvasDiv.appendChild(this.canvasMixer.canvasElement);
  }

  addVideo() {
    const canvasCamera = new CanvasCamera(new Camera(document.createElement('video')));
    this.canvasMixer.addVideoElement(canvasCamera);
  }

  deleteVideo() {
    if (_.size(this.canvasMixer.containers[0].objects)) {
      const objNum = _.random(0, _.size(this.canvasMixer.containers[0].objects) - 1);
      const objName = this.canvasMixer.containers[0].objects[objNum].name;
      this.canvasMixer.deleteVideoElement(objName);
    }
  }

  render() {
    return (
      <div>
        <h1> video container test </h1>
        <button onClick={() => this.addVideo()} >ADD video</button>
        <button onClick={() => this.deleteVideo()} >DELETE video</button>
        <div ref={(c) => { this.canvasDiv = c; }} />
      </div>
    );
  }
}

export default Main;
