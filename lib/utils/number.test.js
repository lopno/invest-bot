const assert = require('chai').assert;
const numberUtils = require('./number');

/* global describe, it */

describe('numberUtils', () => {
  describe('padNumber', () => {
    it('should add 0\'s until length is reached', () => {
      const number = 12;
      const length = 4;
      const expectedResult = '0012';
      const result = numberUtils.padNumber(number, length);
      assert.equal(result, expectedResult);
    });

    it('should return the number string if length is less than the length of the number', () => {
      const number = 12;
      const length = 0;
      const expectedResult = '12';
      const result = numberUtils.padNumber(number, length);
      assert.equal(result, expectedResult);
    });

    it('should return the number string if length is equal to the length of the number', () => {
      const number = 12;
      const length = 2;
      const expectedResult = '12';
      const result = numberUtils.padNumber(number, length);
      assert.equal(result, expectedResult);
    });
  });
});
