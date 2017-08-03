/* global window, document, navigator */
/* eslint-disable nothing */
import Container from './Container';

class Camera {
  constructor({ constraints, stream, container }) {
    this.canvasFPSTimerID = undefined;
    this.setConstraints(constraints);
    this.videoElement = document.createElement('video');
    this.stream = stream || null;

    this.container = container || new Container({});
    if (!container) {
      this.container.addNewObject(Math.random().toString(36).substring(7));
    }

    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = Camera.promisifiedOldGUM;
    }
  }
  /**
   * Alternative for getUserMedia
   * @param {Object} constraints - MediaStreamConstraints object
   */
  static promisifiedOldGUM(constraints) {
    // First get ahold of getUserMedia, if present
    const getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise((successCallback, errorCallback) => {
      getUserMedia.call(navigator, constraints, successCallback, errorCallback);
    });
  }

  setConstraints(constraints) {
    this.constraints = constraints || {
      audio: false,
      video: { width: 320, height: 240 },
      frameRate: { ideal: 10, max: 15 },
    };
  }

  playVideo() {
    this.videoElement.src = window.URL.createObjectURL(this.stream);
    this.videoElement.onloadedmetadata = () => {
      this.videoElement.play();
    };
  }

  activateCamera() {
    if (this.stream) {
      this.playVideo();
    } else {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then((stream) => {
          this.setStream(stream);
          this.playVideo();
        })
        .catch((err) => {
          throw err;
        });
    }
  }

  deactivateCamera() {
    if (this.stream) {
      this.stream.getVideoTracks()[0].stop();
      this.stream = null;
      this.setStream(this.stream);
    }
  }

  setStream(stream) {
    if (stream) {
      this.stream = stream;
    } else {
      this.videoElement.pause();
      this.videoElement.src = '';
    }
  }
}

export default Camera;
