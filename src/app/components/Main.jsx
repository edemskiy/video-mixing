/* eslint-disable */
/* global window, document*/
import React from 'react';
import _ from 'lodash';
import Container from '../controls/Container';
import Camera from '../controls/Camera';
import VideoMixer from '../controls/VideoMixer';

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
    this.videoMixerMain = new VideoMixer();
    this.videoMixerTest = new VideoMixer({ objectSize: { width: 200, height: 150 } });
    this.canvasDiv.appendChild(this.videoMixerMain.canvasElement);
    this.canvasDiv.appendChild(this.videoMixerTest.canvasElement);
  }

  addVideo() {
    const camera = new Camera({
      audio: true,
      video: { width: 320, height: 240 },
      frameRate: { ideal: 10, max: 15 },
    });
    this.videoMixerMain.addVideoElement(camera);
  }
  
  mainVideo() {
    const camera = new Camera({
      audio: true,
      video: true,
      frameRate: { ideal: 10, max: 15 },
    });
    this.videoMixerMain.addVideoElement(camera, 0);
  }
  render() {
    return (
      <div>
        <h1> video container test </h1>
        <button onClick={() => this.mainVideo()} >mainVideo button</button>
        <button onClick={() => this.addVideo()} >ADD video</button>
        <div className="canvases" ref={(c) => { this.canvasDiv = c; }} />
        <div ref={(c) => { this.videoDiv = c; }} id="container" />
      </div>
    );
  }
}

export default Main;
