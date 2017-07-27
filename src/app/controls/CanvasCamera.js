/* global requestAnimationFrame */
// import {Parameters, DOMElements, Stream} from  '../../constants/videoCamera';
import Canvas from './Canvas';


class CanvasCamera extends Canvas {
  constructor(camera) {
    super();
    this.setParametrs({
      id: 'canvas-video',
      frameRate: null,
      width: null,
      height: null,
    });
    this.camera = camera;
    this.videoElement = this.camera.videoElement;
  }

  // componentDidUpdate(prevProps, prevState){
  //   if(this.props.stream)this.startCapturingFromVideo();
  //   else if (!this.props.stream && this.canvasFPSTimerID) this.stopCapturing();
  // }

  startCapturingFromVideo() {
    this.canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  }

  animationCycle() {
    requestAnimationFrame(this.startCapturingFromVideo.bind(this));
    this.canvasElementContext
    .drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
  }
}

export default CanvasCamera;
