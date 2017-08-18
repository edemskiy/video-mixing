/* global window, document */
/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import VideoMixer from '../controls/VideoMixer';
import Container from '../controls/Container';

class Main extends React.Component {
  constructor() {
    super();
    this.videoMixerMain = new VideoMixer();
    this.videoElements = {};
    this.containers = [];
    this.containers.push(new Container({
      maxObjectsInLine: 1,
      objectSize: { width: window.innerWidth * 0.48, height: (window.innerWidth * 9 * 0.48) / 16 },
      basePosition: { x: 0, y: 0 },
      isHorizontal: true,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
    }));

    this.containers.push(new Container({
      maxObjectsInLine: 2,
      objectSize: {
        width: (((this.containers[0].objectHeight / 2) - 5) * 16) / 9,
        height: (this.containers[0].objectHeight / 2) - 5,
      },
      basePosition: {
        x: this.containers[0].objectWidth + (1.5 * (this.containers[0].paddingLeft + this.containers[0].paddingRight)),
        y: 0,
      },
      isHorizontal: true,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
    }));

    this.containers.push(new Container({
      maxObjectsInLine: 8,
      objectSize: {
        width: (this.containers[0].objectWidth - 30) / 4,
        height: (((this.containers[0].objectWidth - 30) / 4) * 9) / 16,
      },
      basePosition: {
        x: 0,
        y: this.containers[0].objectHeight + this.containers[0].paddingTop + this.containers[0].paddingBottom,
      },
      isHorizontal: true,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
    }));
  }
  componentDidMount() {
    for (let i = 0; i < 0; i += 1) this.addVideo();
  }

  getContainerByObjName(name){
    const container = this.containers.filter(container => (
        Boolean(container.objects.filter(object => object.name === name).length)
      ))[0];
    const videoContainerObject = container.objects.filter(object => object.name === name)[0];

    return {container, videoContainerObject};
  }

  addVideo(src) {
    // const src = Math.random() > 0.5
    //   ? 'http://r6---sn-gvnuxaxjvh-bvwe.googlevideo.com/videoplayback?initcwndbps=262500&ipbits=0&pl=24&itag=18&ei=DZaWWdDpM4GTY5rokbAG&signature=2C4D06580181171F053E78E4F5236ABA19E37732.37BF407BD8991AA3648B2E09501B63B52F05AD0A&ms=au&mt=1503040863&source=youtube&mime=video%2Fmp4&ratebypass=yes&lmt=1450608654050406&mv=m&expire=1503062637&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Csource%2Cexpire&ip=92.38.47.226&mm=31&key=yt6&mn=sn-gvnuxaxjvh-bvwe&id=o-AKmpe25nLNFNSdSW8zy-IDtnfQ4sa29mdDotkkUTfvHM&dur=1866.489&title=4K+Video+%E2%9D%A4+Beauty+of+Nature'
    //   : 'http://r1---sn-npoeen7r.googlevideo.com/videoplayback?expire=1503057807&key=yt6&itag=18&ei=L4OWWf-sA8KmowPwtpXQDw&mn=sn-npoeen7r&ipbits=0&mm=31&mt=1503036053&lmt=1484382291587463&mv=m&source=youtube&ratebypass=yes&signature=0457117793FAC851CDBB33EDD6C8FAB97FDD509F.AFB27A81BA7A73397659FB95833CBA12DC11BE21&ms=au&mime=video%2Fmp4&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Csource%2Cexpire&dur=1051.747&initcwndbps=506250&pl=24&id=o-AM3zbavRkN4sjTtFwVMDUKnWMhlcKAkjbu2IooAXqfrR&ip=36.67.153.10&title=Iceland+in+4K+Ultra+HD';
    const oldVideoElementsLength = _.size(this.videoElements);
    const name = Math.random().toString(36).substring(7);
    const videoElement = document.createElement('video');
    videoElement.src = src;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      videoElement.loop = true;
      if(oldVideoElementsLength !== 0){
        videoElement.muted = true;
      }
    };
    this.videoElements = _.assign(this.videoElements, {
      [name]: videoElement,
    });
    this.videoContainer.appendChild(videoElement);

    if (oldVideoElementsLength === 0) {
      this.containers[0].addNewObject(name);
    } else if (this.containers[1].objects.length < 4) {
      this.containers[1].addNewObject(name);
    } else {
      this.containers[2].addNewObject(name);      
    }

    const { container, videoContainerObject } = this.getContainerByObjName(name);

    videoElement.setAttribute('width', container.objectWidth);
    videoElement.setAttribute('height', container.objectHeight);
    videoElement.style.top = `${videoContainerObject.coordinates.y}px`;
    videoElement.style.left = `${videoContainerObject.coordinates.x}px`;

    videoElement.onpointerdown = () => {
      const { container, videoContainerObject } = this.getContainerByObjName(name);
      videoElement.style.zIndex = 100;
      videoElement.style.transition = '';
      const containerCoords = this.videoContainer.getBoundingClientRect();
      
      const initialPosition = videoContainerObject.coordinates;

      document.onpointermove = (e) => {
        videoElement.style.left = `${e.pageX - (videoElement.width / 2) - containerCoords.left}px`;
        videoElement.style.top = `${e.pageY - (videoElement.height / 2) - containerCoords.top}px`;
      };

      videoElement.onpointerup = () => {
        let intersectedVideoContainer = null;
        
        for (let i = 0; i < _.size(this.containers); i += 1) {
          for (let j = 0; j < _.size(this.containers[i].objects); j += 1) {
            if (this.videoElements[this.containers[i].objects[j].name] !== videoElement) {
              const container = this.containers[i];
              const objWidth = container.objectWidth;
              const objHeight = container.objectHeight;
              const condition = (
                parseFloat(videoElement.style.left) > container.objects[j].coordinates.x + objWidth ||
                parseFloat(videoElement.style.top) > container.objects[j].coordinates.y + objHeight ||
                parseFloat(videoElement.style.left) + container.objectWidth
                  < container.objects[j].coordinates.x ||
                parseFloat(videoElement.style.top) + container.objectHeight
                  < container.objects[j].coordinates.y
              );

              if (!condition) {
                intersectedVideoContainer = this.containers[i].objects[j];
                break;
              }
            }
          }
          if (intersectedVideoContainer) break;
        }

        videoElement.style.left = `${initialPosition.x}px`;
        videoElement.style.top = `${initialPosition.y}px`;
        videoElement.style.zIndex = 0;
        
        if (intersectedVideoContainer) {
          const intersectedVideo = this.videoElements[intersectedVideoContainer.name];
          const tmpName = intersectedVideoContainer.name;
          intersectedVideoContainer.name = videoContainerObject.name;
          videoContainerObject.name = tmpName;
          const tmpSize = { width: videoElement.width, height: videoElement.height };

          videoElement.style.transition = 'width 0.5s, height 0.5s, top 0.5s, left 0.5s';
          videoElement.style.left = intersectedVideo.style.left;
          videoElement.style.top = intersectedVideo.style.top;
          videoElement.setAttribute('width', intersectedVideo.width);
          videoElement.setAttribute('height', intersectedVideo.height);
          if (this.containers[0].objects.some(obj => intersectedVideoContainer === obj)) {
            videoElement.muted = false;
          }

          intersectedVideo.style.zIndex = 100;
          intersectedVideo.style.transition = 'width 0.5s, height 0.5s, top 0.5s, left 0.5s';
          intersectedVideo.style.left = `${initialPosition.x}px`;
          intersectedVideo.style.top = `${initialPosition.y}px`;
          intersectedVideo.setAttribute('width', tmpSize.width);
          intersectedVideo.setAttribute('height', tmpSize.height);
          intersectedVideo.muted = true;
          intersectedVideo.style.zIndex = 1;
        }

        document.onpointermove = null;
        videoElement.onpointerup = null;
      };
    };
  }

  render() {
    return (
      <div>
        <h1> Drag and drop videos </h1>
        <div className="input-src">
          <p> Paste src link to video: </p>
          <input type="text" ref={(c) => { this.srcInput = c; }} />
          <button onClick={() => this.addVideo(this.srcInput.value)} >Add video</button>
        </div>
        <div className="video-container-wrapper">
          <div className="video-container" ref={(c) => { this.videoContainer = c; }} />
        </div>
      </div>
    );
  }
}

export default Main;
