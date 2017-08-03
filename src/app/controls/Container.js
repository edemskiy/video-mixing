import _ from 'lodash';
/** Class representing a Container. */
class Container {
  /**
   * Create a container.
   * @param {Object} parametres - Parametres of the container
   * @param {string} parametres.name - The name of the container.
   * @param {boolean} parametres.isHorizontal - Represents orientation of container.
   * @param {number} parametres.maxObjectsInLine - Maximum number of elements in a row(column).
   * @param {Object} parametres.objectSize - size of the single element in container.
   * @param {number} parametres.objectSize.width - width of the single element in container.
   * @param {number} parametres.objectSize.height - height of the single element in container.
   * @param {Object} parametres.basePosition - coordinates of top left corner of the container.
   * @param {number} parametres.basePosition.x - x coordinate of top left corner of the container.
   * @param {number} parametres.basePosition.y - y coordinate of top left corner of the container.
   * @param {number} parametres.paddingTop - top indent of the container element
   * @param {number} parametres.paddingBottom - bottom indent of the container element
   * @param {number} parametres.paddingLeft - left indent of the container element
   * @param {number} parametres.paddingRight - right indent of the container element
   */
  constructor({ name, maxObjectsInLine, objectSize,
    basePosition, isHorizontal, paddingTop,
    paddingBottom, paddingLeft, paddingRight }) {
    this.name = _.isString(name) ? name : Math.random().toString(36).substring(7);
    this.isHorizontal = _.isBoolean(isHorizontal) ? isHorizontal : true;

    this.maxObjectsInLine = _.isFinite(maxObjectsInLine) && maxObjectsInLine > 0
      ? Math.floor(maxObjectsInLine) : 2;

    this.objectWidth = _.isObject(objectSize)
      && _.isFinite(objectSize.width)
      && objectSize.width > 0
      ? objectSize.width : 320;

    this.objectHeight = _.isObject(objectSize)
      && _.isFinite(objectSize.height)
      && objectSize.height > 0
      ? objectSize.height : 240;

    this.positionX = _.isObject(basePosition) && _.isFinite(basePosition.x) ? basePosition.x : 0;
    this.positionY = _.isObject(basePosition) && _.isFinite(basePosition.y) ? basePosition.y : 0;

    this.paddingTop = !isNaN(paddingTop) && _.isFinite(paddingTop) ? paddingTop : 0;
    this.paddingBottom = !isNaN(paddingBottom) && _.isFinite(paddingBottom) ? paddingBottom : 0;
    this.paddingLeft = !isNaN(paddingLeft) && _.isFinite(paddingLeft) ? paddingLeft : 0;
    this.paddingRight = !isNaN(paddingRight) && _.isFinite(paddingRight) ? paddingRight : 0;

    this.width = 0;
    this.height = 0;

    this.objects = [];
    this.currentLine = [];

    this.currentX = this.positionX;
    this.currentY = this.positionY;
  }
  /**
   * Add new element to the container.
   * @param {string} name - name of the new element.
   */
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
  /**
   * Delete element from container by name.
   * @param {string} name - name of the element to be deleted.
   */
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
        newElements.forEach(newElement => this.addNewObject(newElement.name));
        this.allLines = Math.ceil(_.size(this.objects) / this.maxObjectsInLine);
      }
    });
    this.recalculateSize();
  }
  /**
   * Checks if container has elements.
   * @returns {boolean} Returns true if container doesn't have elements, else false.
   */
  isEmpty() {
    return (this.objects.length === 0);
  }
  /**
   * Recalculate the size of the container.
   */
  recalculateSize() {
    if (!this.isEmpty()) {
      if (this.isHorizontal) {
        const elementFullWidth = this.objectWidth + this.paddingLeft + this.paddingRight;
        if (this.width <= this.maxObjectsInLine * elementFullWidth) {
          if (this.allLines === 1) this.width = elementFullWidth * _.size(this.objects);
          else this.width = this.maxObjectsInLine * elementFullWidth;
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
