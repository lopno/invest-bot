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

  describe('getPercentageChange', () => {
    it('should return the absolute percent-wise change between two numbers', () => {
      const oldNumber = 108.88;
      const newNumber = 108.41;
      const expectedResult = 0.43;
      const result = numberUtils.getPercentageChange(oldNumber, newNumber);
      assert.equal(result, expectedResult);
    });

    it('should return the absolute percent-wise change between two numbers', () => {
      const oldNumber = 115.13;
      const newNumber = 114.42;
      const expectedResult = 0.62;
      const result = numberUtils.getPercentageChange(oldNumber, newNumber);
      assert.equal(result, expectedResult);
    });

    it('should return the absolute percent-wise change between two numbers', () => {
      const oldNumber = 106.57;
      const newNumber = 106.22;
      const expectedResult = 0.33;
      const result = numberUtils.getPercentageChange(oldNumber, newNumber);
      assert.equal(result, expectedResult);
    });
  });
});
