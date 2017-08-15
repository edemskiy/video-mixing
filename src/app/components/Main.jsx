/* eslint-disable */
/* global window, document*/
import React from 'react';
import _ from 'lodash';
import Container from '../controls/Container';
import Camera from '../controls/Camera';
import VideoMixer from '../controls/VideoMixer';

class Main extends React.Component {
  componentDidMount() {
    this.videoMixerMain = new VideoMixer();
    this.canvasDiv.appendChild(this.videoMixerMain.canvasElement);
  }

  addVideo() {
    let src = Math.random() > 0.5
      ? 'http://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_1mb.mp4'
      : 'http://mirrors.standaloneinstaller.com/video-sample/P6090053.mp4';
    this.videoMixerMain.addVideoElement(src);
  }

  render() {
    return (
      <div>
        <h1> video container test </h1>
        <button onClick={() => this.addVideo()} >ADD video</button>
        <div className="canvases" ref={(c) => { this.canvasDiv = c; }} />
        <div ref={(c) => { this.videoDiv = c; }} id="container" />
      </div>
    );
  }
}

export default Main;
