import CanvasCamera from './CanvasCamera';

class CanvasCutter {
  static getVideos(stream, container) {
    return container.objects.map((element) => {
      const tmpCanvasCamera = new CanvasCamera();
      tmpCanvasCamera.successCamStreamCallback(stream);
      tmpCanvasCamera.animationCycle(
        element.coordinates.x,
        element.coordinates.y,
        container.objectWidth,
        container.objectHeight,
      );

      const newCanvasCamera = new CanvasCamera();
      newCanvasCamera
        .successCamStreamCallback(tmpCanvasCamera.canvasElement.captureStream(1000 / 25));
      return newCanvasCamera;
    });
  }
}

export default CanvasCutter;
