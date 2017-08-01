/* global navigator */

/** Class representing a Camera. */
class Camera {
  /**
   * Create a Camera.
   * @param {Object} constraints - MediaStreamConstraints object
   */
  constructor(constraints) {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = Camera.promisifiedOldGUM;
    }

    this.stream = null;
    this.setParameters(constraints);
  }
  /**
   * Set the constraints
   * @param {Object} constraints - MediaStreamConstraints object
   */
  setParameters(constraints) {
    this.constraints = constraints || {
      audio: false,
      video: { width: 320, height: 240 },
      frameRate: { ideal: 10, max: 15 },
    };
  }
  /**
   * Alternative for getUserMedia
   * @param {Object} constraints - MediaStreamConstraints object
   */
  static promisifiedOldGUM(constraints) {
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
  /**
   * Checks if camera is active.
   * @returns {boolean} Returns true if camera has a stream object, else false.
   */
  isActive() {
    return !!this.stream;
  }
  /**
   * Callback for handling MediaStream.
   *
   * @callback successStreamCallback
   * @param {MediaStream} stream - a MediaStream object.
   */

   /**
   * Callback for handling getUserMedia error.
   *
   * @callback rejectStreamCallback
   * @param {Error} err - an Error object.
   */

  /**
   * Set a MediaStream object if camera isn't active. Otherwise clear a stream
   * @param {successStreamCallback} successStreamCallback - A callback to run
   * @param {rejectStreamCallback} rejectStreamCallback - A callback to run
   */
  toggleCamera(successStreamCallback, rejectStreamCallback) {
    if (!this.stream) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then((stream) => {
          this.stream = stream;
          successStreamCallback(stream);
        })
        .catch((err) => {
          rejectStreamCallback(err);
        });
    } else {
      this.stream.getVideoTracks()[0].stop();
      this.stream = null;
      successStreamCallback(null);
    }
  }
}

export default Camera;
