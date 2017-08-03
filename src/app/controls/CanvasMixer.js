/* global requestAnimationFrame */
/* eslint-disable no-console */
import _ from 'lodash';
import Canvas from './Canvas';
import Container from './Container';

class CanvasMixer extends Canvas {
  constructor(containerParams) {
    super();
    this.setParametres({ id: 'canvas-mixer', frameRate: null, width: 1, height: 1 });
    this.containers = [];
    this.isCapturing = false;

    this.containers.push(new Container(containerParams || {
      maxObjectsInLine: 3,
      objectSize: { width: 320, height: 240 },
      basePosition: { x: 0, y: 0 },
      isHorizontal: true,
      paddingTop: 10,
      paddingBottom: 20,
      paddingLeft: 10,
      paddingRight: 10,
    }));

    this.videoElements = {};
  }

  addVideoElement(element) {
    const oldVideoElementsLength = _.size(this.videoElements);
    element.container.objects.forEach((containerObject) => {
      this.videoElements = _.assign(this.videoElements, {
        [containerObject.name]: element,
      });
      this.containers[0].addNewObject(containerObject.name);
    });

    element.activateCamera();

    if (_.size(this.videoElements) > 0 && oldVideoElementsLength === 0) {
      this.startCapturingFromVideo();
      this.isCapturing = true;
    }
    this.recalculateCanvasSize();
  }

  deleteVideoElement(name) {
    if (!_.size(this.videoElements)) return;
    this.videoElements[name].deactivateCamera();
    this.videoElements = _.pickBy(this.videoElements, (value, key) => key !== name);
    this.containers[0].deleteObject(name);

    if (!_.size(this.videoElements) && this.canvasFPSTimerID && this.isCapturing) {
      this.isCapturing = false;
      this.stopCapturing();
    }
    this.recalculateCanvasSize();
  }

  recalculateCanvasSize() {
    let width = 0;
    let height = 0;
    let containerWidth = 0;
    let containerHeight = 0;
    let allContainersEmpty = true;

    this.containers.forEach((container) => {
      containerWidth = container.width + container.positionX;
      containerHeight = container.height + container.positionY;
      if (width < containerWidth) {
        width = containerWidth;
        this.canvasElement.width = width;
        this.canvasElementContext.width = width;
      }

      if (height < containerHeight) {
        height = containerHeight;
        this.canvasElement.height = height;
        this.canvasElementContext.height = height;
      }
      if (!container.isEmpty()) {
        allContainersEmpty = false;
      }
    });

    if (allContainersEmpty) {
      this.canvasElement.width = 1;
      this.canvasElementContext.width = 1;
      this.canvasElement.height = 1;
      this.canvasElementContext.height = 1;
    }
  }

  startCapturingFromVideo() {
    this.canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  }

  getStream() {
    return this.isCapturing
      ? this.canvasElement.captureStream(1000 / this.frameRate)
      : null;
  }

  animationCycle() {
    requestAnimationFrame(this.startCapturingFromVideo.bind(this));
    this.containers.forEach((container) => {
      container.objects.forEach((element) => {
        const tmp = this.videoElements[element.name].container.objects
          .filter(item => item.name === element.name)[0];
        this.canvasElementContext.drawImage(
          this.videoElements[element.name].videoElement,
          tmp.coordinates.x,
          tmp.coordinates.y,
          this.videoElements[element.name].container.objectWidth,
          this.videoElements[element.name].container.objectHeight,
          element.coordinates.x,
          element.coordinates.y,
          container.objectWidth,
          container.objectHeight,
        );
      });
    });
  }
}

export default CanvasMixer;
