/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import Container from '../controls/Container';

class Main extends React.Component {
  componentDidMount() {
    this.container = new Container({
      maxObjectsInLine: 2,
      objectSize: { width: 320, height: 240 },
      basePosition: { x: 0, y: 0 },
      isHorizontal: true,
      paddingTop: 10,
      paddingBottom: 20,
      paddingLeft: 10,
      paddingRight: 10,
    });
  }

  addNewObjectToContainer() {
    const newObjectName = `object${this.container.objects.length + 1}`;
    this.container.addNewObject(newObjectName);

    this.mainDiv.style.height = `${this.container.height}px`;
    this.mainDiv.style.width = `${this.container.width}px`;
    
    const element = document.createElement('div');
    element.classList.add('element');
    element.style.height = `${this.container.objectHeight}px`;
    element.style.width = `${this.container.objectWidth}px`;
    element.style.top = `${_.last(this.container.objects).coordinates.y}px`;
    element.style.left = `${_.last(this.container.objects).coordinates.x}px`;
    element.id = newObjectName;

    this.mainDiv.appendChild(element);
  }

  render() {
    return (
      <div>
        <h1> video container test </h1>
        <button onClick={() => this.addNewObjectToContainer()} >ADD ELEMENT</button>
        <div className="mainDiv" ref={(c) => { this.mainDiv = c; }} />
      </div>
    );
  }
}

export default Main;
