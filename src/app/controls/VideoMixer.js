/* global requestAnimationFrame, document */
import _ from 'lodash';
import Container from './Container';
/** Class representing a Container. */
class VideoMixer {
  /**
   * Create a VideoMixer.
   * @param {Object} containerParams - containerParams of the container
   * @param {string} containerParams.name - The name of the container.
   * @param {boolean} containerParams.isHorizontal - Represents orientation of container.
   * @param {number} containerParams.maxObjectsInLine - Maximum number of elements in a row(column).
   * @param {Object} containerParams.objectSize - size of the single element in container.
   * @param {number} containerParams.objectSize.width - width of the single element in container.
   * @param {number} containerParams.objectSize.height - height of the single element in container.
   * @param {Object} containerParams.basePosition - coordinates of top left corner of the container.
   * @param {number} containerParams.basePosition.x -
   * x coordinate of top left corner of the container.
   * @param {number} containerParams.basePosition.y -
   * y coordinate of top left corner of the container.
   * @param {number} containerParams.paddingTop - top indent of the container element
   * @param {number} containerParams.paddingBottom - bottom indent of the container element
   * @param {number} containerParams.paddingLeft - left indent of the container element
   * @param {number} containerParams.paddingRight - right indent of the container element
   */
  constructor(containerParams) {
    this.canvasElement = document.createElement('canvas');
    this.canvasElementContext = this.canvasElement.getContext('2d');
    this.setParametres({ id: 'canvas-mixer', frameRate: null, width: 1, height: 1 });
    this.containers = [];
    this.isCapturing = false;

    this.containers.push(new Container(containerParams || {
      maxObjectsInLine: 3,
      objectSize: { width: 133, height: 100 },
      basePosition: { x: 500, y: 0 },
      isHorizontal: true,
      paddingTop: 10,
      paddingBottom: 20,
      paddingLeft: 10,
      paddingRight: 10,
    }));

    this.videoElements = {};
    this.canvasElement.onmousemove = this.pointerMove.bind(this);
    this.canvasElement.onmousedown = this.pointerDown.bind(this);
    this.canvasElement.onmouseup = this.pointerUp.bind(this);
  }

  getObjectIdByCoord(x, y) {
    for (let i = 0; i < _.size(this.containers[0].objects); i += 1) {
      const object = this.containers[0].objects[i];
      const condition = (
        x > object.coordinates.x &&
        x < object.coordinates.x + this.containers[0].objectWidth &&
        y > object.coordinates.y &&
        y < object.coordinates.y + this.containers[0].objectHeight
      );
      if (condition) return i;
    }
    return null;
  }

  pointerDown(e) {
    const id = this.getObjectIdByCoord(e.offsetX, e.offsetY);
    this.stopCapturing();
    this.containers[0].objects.push(this.containers[0].objects.splice(id, 1)[0]);
    this.movingVideo = _.last(this.containers[0].objects);
    this.startCapturingFromVideo();
  }

  pointerMove(e) {
    if (this.movingVideo) {
      this.movingVideo.coordinates.x = e.offsetX - (this.containers[0].objectWidth / 2);
      this.movingVideo.coordinates.y = e.offsetY - (this.containers[0].objectHeight / 2);
    }
  }

  pointerUp() {
    this.movingVideo = null;
  }
  /**
   * Set parametres for canvas element.
   * @param {Object} parametres - parametres object.
   * @param {string} parametres.id - id of canvas element.
   * @param {number} parametres.frameRate - Frequency of canvas update in frames per second.
   * @param {number} parametres.width - initial width of canvas.
   * @param {number} parametres.height - initial height of canvas.
   */
  setParametres({ id, frameRate, width, height }) {
    this.canvasElement.id = id || '';
    this.canvasElementContext.width = width || 320;
    this.canvasElementContext.height = height || 240;
    this.canvasElement.width = width || 320;
    this.canvasElement.height = height || 240;
    this.frameRate = frameRate || 25;
  }
  /**
   * Add a Camera object to mixer.
   * @param {Camera} - a Camera object
   */
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
  /**
   * Delete Camera object from mixer by name.
   * @param {string} name - the name of the object to be deleted.
   */
  deleteVideoElement(name) {
    if (!_.size(this.videoElements)) return;
    // this.videoElements[name].deactivateCamera();
    this.videoElements = _.pickBy(this.videoElements, (value, key) => key !== name);
    this.containers[0].deleteObject(name);

    if (!_.size(this.videoElements) && this.canvasFPSTimerID && this.isCapturing) {
      this.isCapturing = false;
      this.stopCapturing();
    }
    this.recalculateCanvasSize();
  }
  /**
   * Reacalculate size of canvas element with current parametres
   */
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
  /**
   * Start cycle of capturing video from all cameras to canvas element.
   */
  startCapturingFromVideo() {
    this.canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  }
  /**
   * Stop capturing video from all cameras to canvas element.
   */
  stopCapturing() {
    clearTimeout(this.canvasFPSTimerID);
    // this.clearCanvas();
  }
  /**
   * Clear canvas element by sets all pixels of canvas to transparent black.
   */
  clearCanvas() {
    if (this.canvasElementContext) {
      // purification of the work area Canvas
      this.canvasElementContext
      .clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
  }
  /**
   * Capture stream from canvas element.
   * @returns {MediaStream} - a MediaStream object.
   */
  getStream() {
    return this.isCapturing
      ? this.canvasElement.captureStream(1000 / this.frameRate)
      : null;
  }
  /**
   * Capturing video from all cameras to canvas element.
   */
  animationCycle() {
    requestAnimationFrame(this.startCapturingFromVideo.bind(this));
    this.clearCanvas();
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

export default VideoMixer;
