/* global requestAnimationFrame, window, document */
/* eslint-disable class-methods-use-this */
import Canvas from './Canvas';
import Camera from './Camera';
import Container from './Container';

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

    this.container = new Container({});
    this.container.addNewObject(Math.random().toString(36).substring(7));
  }

  activateCamera() {
    this.camera.activateCamera(
      this.successCamStreamCallback,
      this.rejectCamStreamCallback,
    );
  }

  deactivateCamera() {
    this.camera.deactivateCamera(this.successCamStreamCallback);
  }

  toggleCamera() {
    this.camera.toggleCamera(
      this.successCamStreamCallback,
      this.rejectCamStreamCallback,
    );
  }

  successCamStreamCallback(stream) {
    if (stream) {
      this.camera.stream = stream;
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

  startCapturingFromVideo({
    sx = 0,
    sy = 0,
    sWidth = this.canvasElement.width,
    sHeight = this.canvasElement.height,
    dx = 0,
    dy = 0,
    dWidth = this.canvasElement.width,
    dHeight = this.canvasElement.height,
  }) {
    this.capturingParams = { sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight };
    this.canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  }

  animationCycle() {
    requestAnimationFrame(() => this.startCapturingFromVideo(this.capturingParams));
    this.canvasElementContext
    .drawImage(
      this.videoElement,
      this.capturingParams.sx,
      this.capturingParams.sy,
      this.capturingParams.sWidth,
      this.capturingParams.sHeight,
      this.capturingParams.dx,
      this.capturingParams.dy,
      this.capturingParams.dWidth,
      this.capturingParams.dHeight,
    );
  }
}

export default CanvasCamera;
