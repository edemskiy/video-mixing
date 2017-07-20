class Container {

  constructor({name,
    maxObjectsInLine, objectSize, basePosition, isHorizontal,
    paddingTop, paddingBottom, paddingLeft, paddingRight}) {

    this.name = name;
    this._isHorizontal = isHorizontal;
    this._maxObjectsInLine = maxObjectsInLine;
    this._objectWidth = objectSize.width;
    this._objectHeight = objectSize.height;
    this.positionX = basePosition.x;
    this.positionY = basePosition.y;


    this.paddingTop =  !isNaN(parseFloat(paddingTop)) && isFinite(paddingTop)  ? paddingTop : 0;
    this.paddingBottom = !isNaN(parseFloat(paddingBottom)) && isFinite(paddingBottom) ? paddingBottom : 0;
    this.paddingLeft = !isNaN(parseFloat(paddingLeft)) && isFinite(paddingLeft)? paddingLeft : 0;
    this.paddingRight = !isNaN(parseFloat(paddingRight)) && isFinite(paddingRight)? paddingRight : 0;

    this.width = 0;
    this.height = 0;

    this.objects = [];
    this._currentLine = [];

    this._currentX = this.positionX;
    this._currentY = this.positionY;

  }

  addNewObject(name) {
    let element = {name,
      coordinates: {x: this._currentX + this.paddingLeft, y: this._currentY+this.paddingTop}};
    this.objects.push(element);
    this._currentLine.push(element);
    this.objects[this.objects.length-1].positionInLine = this._currentLine.length-1;

    if (this._currentLine.length === this._maxObjectsInLine) {
      this._currentLine = [];
      if (this._isHorizontal) {
        this._currentX = this.positionX;
        this._currentY += (this._objectHeight + this.paddingBottom + this.paddingTop);
      }
      else {
        this._currentY = this.positionY;
        this._currentX += (this._objectWidth + this.paddingRight + this.paddingLeft);
      }
    } else {
      if (this._isHorizontal) {
        this._currentX += (this._objectWidth + this.paddingRight + this.paddingLeft);
      }
      else {
        this._currentY += (this._objectHeight + this.paddingBottom + this.paddingTop);
      }
    }

    this._allLines = Math.floor(this.objects.length / this._maxObjectsInLine);
    this._allLines = ((this.objects.length - this._allLines*this._maxObjectsInLine) === 0) ? this._allLines : (this._allLines + 1);
    this.objects[this.objects.length-1].line = this._allLines;

    this._recalculateSize();

  }

  deleteObject(name) {

    this.objects.forEach((element, index)=> {
      if (element.name === name) {

        let firstElementIndexInLine = index-element.positionInLine;
        this._currentX = this.objects[firstElementIndexInLine].coordinates.x - this.paddingLeft;
        this._currentY = this.objects[firstElementIndexInLine].coordinates.y - this.paddingTop;

        let newElements = this.objects.splice(
          firstElementIndexInLine,
          this.objects.length - firstElementIndexInLine
        );

        newElements.splice(element.positionInLine, 1);

        this._currentLine = [];
        newElements.forEach((newElement)=> {
          this.addNewObject(newElement.name);
        });
      }
    });
    this._recalculateSize();

  };

  isEmpty(){
    return (this.objects.length === 0);
  }

  _recalculateSize(){
    if(!this.isEmpty()){
      if (this._isHorizontal) {

        if (this.width < this._maxObjectsInLine * (this._objectWidth + this.paddingLeft + this.paddingRight))
          this.width = this._maxObjectsInLine * (this._objectWidth + this.paddingLeft + this.paddingRight);
        this.height = this._allLines * (this._objectHeight + this.paddingTop + this.paddingBottom);

      } else {
        if (this.height < this._maxObjectsInLine * (this._objectHeight + this.paddingTop + this.paddingBottom))
          this.height = this._maxObjectsInLine * (this._objectHeight + this.paddingTop + this.paddingBottom);
        this.width = this._allLines * (this._objectWidth + this.paddingLeft + this.paddingRight);
      }
    }else{
      this.width = 0;
      this.height = 0;
    }

  }

}

export default Container;