/* global document */
class Canvas {
  constructor() {
    // creation of canvas
    this.canvasElement = document.createElement('canvas');
    this.canvasElementContext = this.canvasElement.getContext('2d');

    // creation the id of animation cycle
    this.canvasFPSTimerID = undefined;
  }

  setParametres({ id, frameRate, width, height }) {
    this.canvasElement.id = id || '';
    this.canvasElementContext.width = width || 320;
    this.canvasElementContext.height = height || 240;
    this.canvasElement.width = width || 320;
    this.canvasElement.height = height || 240;
    this.frameRate = frameRate || 25;
  }

  stopCapturing() {
    clearTimeout(this.canvasFPSTimerID);
    this.clearCanvas();
  }

  clearCanvas() {
    if (this.canvasElementContext) {
      // purification of the work area Canvas
      this.canvasElementContext
      .clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
  }
}


export default Canvas;
