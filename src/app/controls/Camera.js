/* global navigator, document, window */

class Camera {
  constructor(video) {
    // for old browsers
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = this.promisifiedOldGUM;
    }

    this.stream = null;
    // this.videoElement = document.createElement('video');
    this.videoElement = video;
    const parametrs = { id: null, constraints: null };
    this.setParametrs(parametrs);
  }

  setParametrs({ id, constraints }) {
    this.videoElement.id = id || 'camera-video';
    this.constraints = constraints || {
      audio: false,
      video: { width: 320, height: 240 },
      frameRate: { ideal: 10, max: 15 },
    };
  }

  promisifiedOldGUM(constraints, successCallback) {
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

  toggleCamera() {
    if (!this.stream) {
      return navigator.mediaDevices.getUserMedia(this.constraints)
        .then((stream) => {
          const videoTracks = stream.getVideoTracks();
          console.log(`Using video device: ${videoTracks[0].label}`);
          this.stream = stream;
          this.stream.ended = () => console.log('Stream ended');
          this.videoElement.src = window.URL.createObjectURL(stream);
          this.videoElement.onloadedmetadata = () => {
            this.videoElement.play();
          };
        }, (err) => { throw err; })
        .catch((err) => {
          console.log(err);
        });
    }
    this.stream.getVideoTracks()[0].stop();
    this.videoElement.pause();
    this.videoElement.src = '';
    this.stream = null;
    return null;
  }
}

export default Camera;
