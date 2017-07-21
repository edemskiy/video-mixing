// import _ from 'lodash';

class Container {
  constructor({ name, maxObjectsInLine, objectSize,
    basePosition, isHorizontal = true, paddingTop,
    paddingBottom, paddingLeft, paddingRight }) {
    this.name = (typeof name === 'string') ? name : Math.random().toString(36).substring(7);
    this.isHorizontal = (typeof isHorizontal === 'boolean') ? isHorizontal : true;

    this.maxObjectsInLine = maxObjectsInLine > 0
      && !isNaN(maxObjectsInLine)
      && Number.isFinite(maxObjectsInLine)
      ? Math.floor(maxObjectsInLine) : 2;

    this.objectWidth = objectSize
      && objectSize.width > 0
      && !isNaN(objectSize.width)
      && Number.isFinite(objectSize.width)
      ? objectSize.width : 320;

    this.objectHeight = objectSize
      && objectSize.height > 0
      && !isNaN(objectSize.height)
      && Number.isFinite(objectSize.height)
      ? objectSize.height : 240;

    this.positionX = basePosition
      && !isNaN(basePosition.x)
      && Number.isFinite(basePosition.x)
      ? basePosition.x : 0;

    this.positionY = basePosition
      && !isNaN(basePosition.y)
      && Number.isFinite(basePosition.y)
      ? basePosition.y : 0;

    this.paddingTop = !isNaN(paddingTop) && Number.isFinite(paddingTop)
      ? paddingTop : 0;
    this.paddingBottom = !isNaN(paddingBottom) && Number.isFinite(paddingBottom)
      ? paddingBottom : 0;
    this.paddingLeft = !isNaN(paddingLeft) && Number.isFinite(paddingLeft)
      ? paddingLeft : 0;
    this.paddingRight = !isNaN(paddingRight) && Number.isFinite(paddingRight)
      ? paddingRight : 0;

    this.width = 0;
    this.height = 0;

    this.objects = [];
    this.currentLine = [];

    this.currentX = this.positionX;
    this.currentY = this.positionY;
  }

  addNewObject(name) {
    const element = {
      name,
      coordinates: {
        x: this.currentX + this.paddingLeft,
        y: this.currentY + this.paddingTop,
      },
    };

    this.objects.push(element);
    this.currentLine.push(element);

    element.positionInLine = this.currentLine.length - 1;

    if (this.currentLine.length === this.maxObjectsInLine) {
      this.currentLine = [];
      if (this.isHorizontal) {
        this.currentX = this.positionX;
        this.currentY += (this.objectHeight + this.paddingBottom + this.paddingTop);
      } else {
        this.currentY = this.positionY;
        this.currentX += (this.objectWidth + this.paddingRight + this.paddingLeft);
      }
    } else if (this.isHorizontal) {
      this.currentX += (this.objectWidth + this.paddingRight + this.paddingLeft);
    } else {
      this.currentY += (this.objectHeight + this.paddingBottom + this.paddingTop);
    }

    this.allLines = Math.ceil(this.objects.length / this.maxObjectsInLine);
    element.line = this.allLines;

    this.recalculateSize();
  }

  deleteObject(name) {
    this.objects.forEach((element, index) => {
      if (element.name === name) {
        const firstElementIndexInLine = index - element.positionInLine;
        this.currentX = this.objects[firstElementIndexInLine].coordinates.x - this.paddingLeft;
        this.currentY = this.objects[firstElementIndexInLine].coordinates.y - this.paddingTop;

        const newElements = this.objects.splice(
          firstElementIndexInLine,
          this.objects.length - firstElementIndexInLine,
        );

        newElements.splice(element.positionInLine, 1);

        this.currentLine = [];
        newElements.forEach((newElement) => {
          this.addNewObject(newElement.name);
        });
      }
    });
    this.recalculateSize();
  }

  isEmpty() {
    return (this.objects.length === 0);
  }

  recalculateSize() {
    if (!this.isEmpty()) {
      if (this.isHorizontal) {
        const elementFullWidth = (this.objectWidth + this.paddingLeft + this.paddingRight);
        if (this.width < this.maxObjectsInLine * elementFullWidth) {
          this.width = this.maxObjectsInLine * elementFullWidth;
        }
        this.height = this.allLines * (this.objectHeight + this.paddingTop + this.paddingBottom);
      } else {
        const elementFullHeight = this.objectHeight + this.paddingTop + this.paddingBottom;
        if (this.height < this.maxObjectsInLine * elementFullHeight) {
          this.height = this.maxObjectsInLine * elementFullHeight;
        }
        this.width = this.allLines * (this.objectWidth + this.paddingLeft + this.paddingRight);
      }
    } else {
      this.width = 0;
      this.height = 0;
    }
  }
}

export default Container;
