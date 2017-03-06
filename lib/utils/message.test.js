const assert = require('chai').assert;
const sinon = require('sinon');
const messageUtils = require('./message');
const fundType = require('../constant/fundType');

/* global describe, it */

describe('Message Utils', () => {
  describe('printJuneLogo', () => {
    it('should console log JUNE logo', () => {
      const spy = sinon.spy(console, 'log');

      messageUtils.printJuneLogo();

      assert.isTrue(spy.calledWith('JJJJJJJJJJJ   UU       UU   NN       NN   EEEEEEEEE'));
      assert.isTrue(spy.calledWith('JJJJJJJJJJJ   UU       UU   NNN      NN   EEEEEEEEE'));
      assert.isTrue(spy.calledWith('         JJ   UU       UU   NNNN     NN   EE       '));
      assert.isTrue(spy.calledWith('         JJ   UU       UU   NN NN    NN  EEEEEEE   '));
      assert.isTrue(spy.calledWith('         JJ   UU       UU   NN  NN   NN   EE       '));
      assert.isTrue(spy.calledWith('         JJ   UU       UU   NN   NN  NN  EEEEEEE   '));
      assert.isTrue(spy.calledWith('        JJJ   UU       UU   NN    NN NN   EE       '));
      assert.isTrue(spy.calledWith('JJJJJJJJJJJ   UUU     UUU   NN     NNNN   EEEEEEEEE'));
      assert.isTrue(spy.calledWith('JJJJJJJJJJ     UUUUUUUUU    NN      NNN   EEEEEEEEE'));

      spy.restore();
    });
  });

  describe('formatDate', () => {
    it('should return a non empty string given a date', () => {
      const date = new Date();
      const resultString = messageUtils.formatDate(date);
      assert.isString(resultString, 'expected a string');
      assert.isAbove(resultString.length, 0, 'expected length of string to be over 0');
    });

    it('should return empty string for input that is not a date object', () => {
      const notDate = '11-10-2016';
      const resultString = messageUtils.formatDate(notDate);
      assert.isString(resultString, 'expected a string');
      assert.equal(resultString.length, 0, 'expected length of string to be 0');
    });
  });

  describe('formatValuation', () => {
    it('should format a date very nice like', () => {
      const valuation = {
        date: new Date(),
        value: 103.12,
        change: 0.21,
        isPositive: true,
        previousValue: 102.91,
      };
      const sharesCount = 100;
      const fund = fundType.moderateShort;
      const resultString = messageUtils.formatValuation(valuation, sharesCount, fund);
      console.log(resultString);
    })
  })
});
