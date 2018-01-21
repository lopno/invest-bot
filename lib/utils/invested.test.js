const sinon = require('sinon');
require('sinon-as-promised');
const test = require('ava');

const fundType = require('./../constant/fundType');
const investedUtils = require('./invested');

function validateValuation(t, invested) {
  t.not(invested.value, undefined, 'expected valuation to have value property');
  t.not(invested.assetString, undefined, 'expected valuation to have change property');
  t.not(invested.date, undefined, 'expected valuation to have a date property');
}

var sandbox; // eslint-disable-line
var clock; // eslint-disable-line

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
  clock = sinon.useFakeTimers(new Date(2017, 3, 13).getTime()); // April 13th 2017
});

test.afterEach(() => {
  sandbox.restore();
  clock.restore();
});

test('getSite should return a function given defensive fund type', (t) => {
  const investedFunction = investedUtils.getSite(fundType.defensive);
  t.is(typeof investedFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given moderate short fund type', (t) => {
  const investedFunction = investedUtils.getSite(fundType.moderateShort);
  t.is(typeof investedFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given moderate fund type', (t) => {
  const investedFunction = investedUtils.getSite(fundType.moderate);
  t.is(typeof investedFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given balanced fund type', (t) => {
  const investedFunction = investedUtils.getSite(fundType.balanced);
  t.is(typeof investedFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given progressive fund type', (t) => {
  const investedFunction = investedUtils.getSite(fundType.progressive);
  t.is(typeof investedFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given opportunity fund type', (t) => {
  const investedFunction = investedUtils.getSite(fundType.opportunity);
  t.is(typeof investedFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given equity fund type', (t) => {
  const investedFunction = investedUtils.getSite(fundType.equity);
  t.is(typeof investedFunction, 'function', 'expected getSite to return a function');
});

test('should return null for an invalid fund type', (t) => {
  const investedFunction = investedUtils.getSite(null);
  t.is(investedFunction, null, 'expected getSite to return null for invalid fund type');
});


test.serial('getValuation should use data from database if it exists', (t) => {
  const funds = [fundType.balanced, fundType.opportunity];
  return investedUtils.getInvestment(funds)
    .then(investment => investment.map(invested =>
      validateValuation(t, invested)));
});
