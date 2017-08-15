/* global window, document, navigator */
import Container from './Container';
/** Class representing a Camera. */
class Camera {
  /**
   * Create a Camera.
   * @param {Object} parameters - parametres object.
   * @param {Object} parametres.constraints - a MediaStreamConstraints object.
   * @param {MediaStream} parametres.stream - a MediaStream object.
   * @param {Container} parametres.container - a Container object.
   * that contains information about the location of the video in the stream.
   */
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
   * Alternative for getUserMedia.
   * @param {Object} constraints - MediaStreamConstraints object.
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
  /**
   * Setting constraints for capturing from user camera.
   * @param {Object} parametres.constraints - a MediaStreamConstraints object.
   */
  setConstraints(constraints) {
    this.constraints = constraints || {
      audio: true,
      video: { width: 320, height: 240 },
      frameRate: { ideal: 10, max: 15 },
    };
  }
  /*
   * Setting a stream object. Stopping video if null provided.
   * @param {MediaStream} parametres.stream - a MediaStream object.
   */
  setStream(stream) {
    if (stream) {
      this.stream = stream;
    } else {
      this.videoElement.pause();
      this.videoElement.src = '';
    }
  }
  /**
   * Start playing video from a stream.
   */
  playVideo() {
    if (Math.random() > 0.5) {
      this.videoElement.src = window.URL.createObjectURL(this.stream);
    } else {
      this.videoElement.src = 'http://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_1mb.mp4';
    }

    this.videoElement.onloadedmetadata = () => {
      this.container.objectWidth = this.videoElement.videoWidth;
      this.container.objectHeight = this.videoElement.videoHeight;
      this.videoElement.play();
      this.videoElement.muted = true;
      this.videoElement.loop = true;
    };
  }
  /**
   * Play video if stream exist. Otherwise get stream from user camera and start playing video.
   */
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
  /**
   * Set stream to null and stop playing a video.
   */
  deactivateCamera() {
    if (this.stream) {
      this.stream.getVideoTracks()[0].stop();
      this.stream = null;
      this.setStream(this.stream);
    }
  }
}

export default Camera;
