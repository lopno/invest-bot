const test = require('ava');
const sinon = require('sinon');
const messageUtils = require('./message');
const fundType = require('../constant/fundType');

test('printJuneLogo should console log JUNE logo', (t) => {
  const spy = sinon.spy(console, 'log');

  messageUtils.printJuneLogo();

  t.true(spy.calledWith('JJJJJJJJJJJ   UU       UU   NN       NN   EEEEEEEEE'));
  t.true(spy.calledWith('JJJJJJJJJJJ   UU       UU   NNN      NN   EEEEEEEEE'));
  t.true(spy.calledWith('         JJ   UU       UU   NNNN     NN   EE       '));
  t.true(spy.calledWith('         JJ   UU       UU   NN NN    NN  EEEEEEE   '));
  t.true(spy.calledWith('         JJ   UU       UU   NN  NN   NN   EE       '));
  t.true(spy.calledWith('         JJ   UU       UU   NN   NN  NN  EEEEEEE   '));
  t.true(spy.calledWith('        JJJ   UU       UU   NN    NN NN   EE       '));
  t.true(spy.calledWith('JJJJJJJJJJJ   UUU     UUU   NN     NNNN   EEEEEEEEE'));
  t.true(spy.calledWith('JJJJJJJJJJ     UUUUUUUUU    NN      NNN   EEEEEEEEE'));

  spy.restore();
});

test('formatDate should return a non empty string given a date', (t) => {
  const date = new Date();
  const resultString = messageUtils.formatDate(date);
  t.is(typeof resultString, 'string', 'expected a string');
  t.true(resultString.length > 0, 'expected length of string to be over 0');
});

test('formatDate should return empty string for input that is not a date object', (t) => {
  const notDate = '11-10-2016';
  const resultString = messageUtils.formatDate(notDate);
  t.is(typeof resultString, 'string', 'expected a string');
  t.is(resultString.length, 0, 'expected length of string to be 0');
});


test('formatValuation should format a date very nice like', (t) => {
  const valuation = {
    date: new Date(),
    value: 103.12,
    change: 0.21,
    isPositive: true,
    previousValue: 102.91,
  };
  const sharesCount = 100.23;
  const fund = fundType.moderateShort;
  const resultString = messageUtils.formatValuation(valuation, sharesCount, fund);
  console.log(resultString); // eslint-disable-line no-console
  t.pass();
});

test('formatValuation should format 0 change real good like', (t) => {
  const valuation = {
    value: 105.82,
    previousValue: 105.82,
    change: 0,
    isPositive: false,
    date: new Date(),
  };
  const fund = fundType.balanced;
  const sharesCount = 1;
  const resultString = messageUtils.formatValuation(valuation, sharesCount, fund);
  console.log(resultString); // eslint-disable-line no-console
  t.pass();
});

test('formatValuation should fall back to yesterday\'s valuation if today\'s is bad', (t) => {
  const valuation = {
    value: null,
    previousValue: 105.82,
    change: Infinity,
    isPositive: false,
    date: new Date(),
  };

  const fund = fundType.balanced;
  const sharesCount = 1;
  const resultString = messageUtils.formatValuation(valuation, sharesCount, fund);
  console.log(resultString); // eslint-disable-line no-console
  t.pass();
});

test('format Investment should return stuff if all is good', (t) => {
  const invested = {
    value: 9920689.56,
    date: new Date(),
  };

  const fund = fundType.balanced;
  const resultString = messageUtils.formatInvestment(invested, fund);
  console.log(resultString); // eslint-disable-line no-console
  t.pass();
});
