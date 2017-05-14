/* eslint-disable prefer-arrow-callback, func-names */
const assert = require('chai').assert;
const dateUtils = require('./date');

/* global describe, it */

describe('Date Utils', () => {
  describe('getWeekDay', () => {
    it('should return the string \'Sunday\' given 0 as input', () => {
      const input = 0;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, 'Sunday');
    });

    it('should return the string \'Monday\' given 1 as input', () => {
      const input = 1;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, 'Monday', 'expected result string to be \'Monday\'');
    });

    it('should return the string \'Tuesday\' given 2 as input', () => {
      const input = 2;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, 'Tuesday', 'expected result string to be \'Tuesday\'');
    });

    it('should return the string \'Wednesday\' given 3 as input', () => {
      const input = 3;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, 'Wednesday', 'expected result string to be \'Wednesday\'');
    });

    it('should return the string \'Thursday\' given 4 as input', () => {
      const input = 4;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, 'Thursday', 'expected result string to be \'Thursday\'');
    });

    it('should return the string \'Friday\' given 5 as input', () => {
      const input = 5;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, 'Friday', 'expected result string to be \'Friday\'');
    });

    it('should return the string \'Saturday\' given 6 as input', () => {
      const input = 6;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, 'Saturday', 'expected result string to be \'Saturday\'');
    });

    it('should return an empty string \'\' given 7 as input', () => {
      const input = 7;
      const resultString = dateUtils.getWeekDay(input);
      assert.equal(resultString, '', 'expected result string to be \'\'');
    });
  });

  describe('formatDateToIso8601', () => {
    it('should format date to format YYYY-MM-DD', () => {
      const input = new Date(1999, 0, 9); // 0 is January
      const resultString = dateUtils.formatDateToIso8601(input);
      assert.equal(resultString, '1999-01-09');
    });

    it('should return null if input is not of type date', () => {
      const input = '1999/12/31';
      const resultString = dateUtils.formatDateToIso8601(input);
      assert.isNull(resultString);
    });
  });

  describe('formatDateToShortFormat', function () {
    it('should return null if input is not of type date', function () {
      const input = '1999/12/31';
      const resultString = dateUtils.formatDateToShortFormat(input);
      assert.isNull(resultString);
    });

    it('should return 1/12 for December 1st', function () {
      const input = new Date(2017, 11, 1);
      const resultString = dateUtils.formatDateToShortFormat(input);
      assert.equal('1/12', resultString, 'expected December 1st to be formatted as \'1/12\'');
    });
  });
});
