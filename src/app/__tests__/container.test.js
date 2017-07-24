/* global describe, it, beforeEach, afterEach */
import chai from 'chai';
import _ from 'lodash';
import Container from '../controls/Container';

const assert = chai.assert;

const generateRandomString = () => Math.random().toString(36).substring(7);

describe('Main test', () => {
  for (let elementsNumber = 2; elementsNumber < 5; elementsNumber += 1) {
    describe(`max ${elementsNumber} elements in a row`, () => {
      let container = null;

      beforeEach(() => {
        container = new Container({ maxObjectsInLine: elementsNumber });
        for (let i = 1; i <= (container.maxObjectsInLine * 2) + 1; i += 1) {
          container.addNewObject(generateRandomString());
        }
      });

      afterEach(() => {
        for (let i = 1; i <= _.size(container.objects); i += 1) {
          // check "line" property of element
          assert.equal(
            container.objects[i - 1].line,
            Math.floor(((i - 1) / container.maxObjectsInLine) + 1),
          );

          // check "x" coordinate of element
          assert.equal(
            container.objects[i - 1].coordinates.x,
            container.positionX +
              container.paddingLeft + (((i - 1) % container.maxObjectsInLine) *
              (container.paddingLeft + container.objectWidth + container.paddingRight)),
          );

          // check "y" coordinate of element
          assert.equal(
            container.objects[i - 1].coordinates.y,
            container.positionY +
              container.paddingTop + ((container.objects[i - 1].line - 1) *
              (container.paddingTop + container.objectHeight + container.paddingBottom)),
          );
        }
        // check total amount of lines in container
        assert.equal(
            container.allLines,
            Math.ceil(_.size(container.objects) / container.maxObjectsInLine),
          );
      });

      it('Adding new object', () => {
        const oldElementsNumber = _.size(container.objects);
        container.addNewObject(generateRandomString());
        assert.equal(_.size(container.objects), oldElementsNumber + 1);
      });

      it('Deleting last element', () => {
        const oldElementsNumber = _.size(container.objects);
        container.deleteObject(_.last(container.objects).name);
        assert.equal(_.size(container.objects), oldElementsNumber - 1);
      });

      it('Deleting first element', () => {
        const oldElementsNumber = _.size(container.objects);
        container.deleteObject(_.first(container.objects).name);
        assert.equal(_.size(container.objects), oldElementsNumber - 1);
      });

      it('Deleting random element', () => {
        const oldElementsNumber = _.size(container.objects);
        container.deleteObject(container.objects[
            _.random(1, _.size(container.objects) - 2)
          ].name);
        assert.equal(_.size(container.objects), oldElementsNumber - 1);
      });
    });
  }
});