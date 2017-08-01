/* global requestAnimationFrame, window, document */
/* eslint-disable class-methods-use-this */
import Canvas from './Canvas';
import Camera from './Camera';


class CanvasCamera extends Canvas {
  constructor(parametres) {
    super();
    this.setParametres({
      id: 'canvas-video',
      frameRate: null,
      width: null,
      height: null,
    });
    this.camera = new Camera(parametres);
    this.videoElement = document.createElement('video');

    this.successCamStreamCallback = this.successCamStreamCallback.bind(this);
    this.rejectCamStreamCallback = this.rejectCamStreamCallback.bind(this);
  }

  toggleCamera() {
    this.camera.toggleCamera(
      this.successCamStreamCallback,
      this.rejectCamStreamCallback,
    );
  }

  successCamStreamCallback(stream) {
    if (stream) {
      this.videoElement.src = window.URL.createObjectURL(stream);
      this.videoElement.onloadedmetadata = () => {
        this.videoElement.play();
      };
    } else {
      this.videoElement.pause();
      this.videoElement.src = '';
    }
  }

  rejectCamStreamCallback(err) {
    throw err;
  }

  startCapturingFromVideo() {
    this.canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  }

  animationCycle(
    sx = 0,
    sy = 0,
    sWidth = this.canvasElement.width,
    sHeight = this.canvasElement.height,
    dx = 0,
    dy = 0,
    dWidth = this.canvasElement.width,
    dHeight = this.canvasElement.height,
  ) {
    requestAnimationFrame(this.startCapturingFromVideo.bind(this));
    this.canvasElementContext
    .drawImage(this.videoElement, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
}

export default CanvasCamera;
