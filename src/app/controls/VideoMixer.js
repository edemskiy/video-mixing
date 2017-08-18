/* global requestAnimationFrame, document, window */
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
  constructor() {
    this.canvasElement = document.createElement('canvas');
    this.canvasElementContext = this.canvasElement.getContext('2d');
    this.setParametres({ id: 'canvas-mixer', frameRate: null, width: 1, height: 1 });
    this.containers = [];
    this.isCapturing = false;

    this.containers.push(new Container({
      maxObjectsInLine: 1,
      objectSize: { width: window.innerWidth * 0.45, height: (window.innerWidth * 9 * 0.45) / 16 },
      basePosition: { x: 0, y: 0 },
      isHorizontal: true,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
    }));

    this.containers.push(new Container({
      maxObjectsInLine: 2,
      objectSize: {
        width: (((this.containers[0].objectHeight / 2) - 10) * 16) / 9,
        height: (this.containers[0].objectHeight / 2) - 10,
      },
      basePosition: {
        x: this.containers[0].objectWidth + (1.5 * (this.containers[0].paddingLeft + this.containers[0].paddingRight)),
        y: 0,
      },
      isHorizontal: true,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
    }));

    this.containers.push(new Container({
      maxObjectsInLine: 7,
      objectSize: {
        width: (window.innerWidth * 0.12),
        height: (window.innerWidth * 0.12 * 9) / 16,
      },
      basePosition: {
        x: 0,
        y: this.containers[0].objectHeight + this.containers[0].paddingTop + this.containers[0].paddingBottom,
      },
      isHorizontal: true,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
    }));

    this.videoElements = {};
    this.canvasElement.onmousemove = this.pointerMove.bind(this);
    this.canvasElement.onmousedown = this.pointerDown.bind(this);
    this.canvasElement.onmouseup = this.pointerUp.bind(this);
  }

  getObjectIdByCoord(x, y) {
    for (let i = 1; i < _.size(this.containers); i += 1) {
      for (let j = 0; j < _.size(this.containers[i].objects); j += 1) {
        const object = this.containers[i].objects[j];
        const condition = (
          x > object.coordinates.x &&
          x < object.coordinates.x + this.containers[i].objectWidth &&
          y > object.coordinates.y &&
          y < object.coordinates.y + this.containers[i].objectHeight
        );
        if (condition) {
          return {
            containerId: i,
            objId: j,
          };
        }
      }
    }
    return null;
  }

  pointerDown(e) {
    const objInfo = this.getObjectIdByCoord(e.offsetX, e.offsetY);
    if (!_.isNull(objInfo)) {
      this.stopCapturing();
      this.containers[objInfo.containerId].objects
        .push(this.containers[objInfo.containerId].objects.splice(objInfo.objId, 1)[0]);
      this.movingVideo = _.last(this.containers[objInfo.containerId].objects);
      this.movingVideoSize = {
        height: this.containers[objInfo.containerId].objectHeight,
        width: this.containers[objInfo.containerId].objectWidth,
      };
      this.initialPosition = { ...this.movingVideo.coordinates };
      this.startCapturingFromVideo();
    }
  }

  pointerMove(e) {
    if (this.movingVideo) {
      this.movingVideo.coordinates.x = e.offsetX - (this.movingVideoSize.width / 2);
      this.movingVideo.coordinates.y = e.offsetY - (this.movingVideoSize.height / 2);
    }
  }

  pointerUp() {
    if (this.movingVideo) {
      const mainContainerObjects = this.containers[0].objects;
      const mainObjWidth = this.containers[0].objectWidth;
      const mainObjHeight = this.containers[0].objectHeight;
      const condition = (
        this.movingVideo.coordinates.x > mainContainerObjects[0].coordinates.x + mainObjWidth ||
        this.movingVideo.coordinates.y > mainContainerObjects[0].coordinates.y + mainObjHeight ||
        this.movingVideo.coordinates.x + this.containers[0].objectWidth
          < mainContainerObjects[0].coordinates.x ||
        this.movingVideo.coordinates.y + this.containers[0].objectHeight
          < mainContainerObjects[0].coordinates.y
      );

      if (!condition) {
        const tmpName = this.movingVideo.name;
        this.videoElements[mainContainerObjects[0].name].muted = true;
        // this.videoElements[mainContainerObjects[0].name].pause();
        // this.videoElements[tmpName].play();
        this.videoElements[tmpName].muted = false;

        this.movingVideo.name = mainContainerObjects[0].name;
        mainContainerObjects[0].name = tmpName;
      }

      this.movingVideo.coordinates = { ...this.initialPosition };
      this.movingVideo = null;
      this.initialPosition = null;
    }
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
    this.frameRate = frameRate || 28;
  }
  /**
   * Add a video to mixer by src link.
   * @param {string} - src link to video
   */
  addVideoElement(src) {
    const oldVideoElementsLength = _.size(this.videoElements);
    const name = Math.random().toString(36).substring(7);
    const videoElement = document.createElement('video');
    videoElement.src = src;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      videoElement.muted = true;
      videoElement.loop = true;
    };
    this.videoElements = _.assign(this.videoElements, {
      [name]: videoElement,
    });

    if (oldVideoElementsLength === 0) {
      this.containers[0].addNewObject(name);
    } else if (this.containers[1].objects.length < 4) {
      this.containers[1].addNewObject(name);
    } else {
      this.containers[2].addNewObject(name);
    }

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
        // this.canvasElementContext.rect(10, 10, 500, 281);
        // this.canvasElementContext.stroke();
        this.canvasElementContext.drawImage(
          this.videoElements[element.name],
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
