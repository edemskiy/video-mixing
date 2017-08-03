/* global window, document */
// import CanvasCamera from './CanvasCamera';

class AdditionalVideoObject {
  constructor(stream, container) {
    this.stream = stream;
    this.container = container;
    this.videoElement = document.createElement('video');
  }
  activateCamera() {
    this.videoElement.src = window.URL.createObjectURL(this.stream);
    this.videoElement.onloadedmetadata = () => {
      this.videoElement.play();
    };
  }
}

export default AdditionalVideoObject;
