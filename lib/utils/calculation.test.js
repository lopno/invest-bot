const test = require('ava');
const calculationUtils = require('./calculation');

test('previousValue returns 100 for a value of 110 and a change of +10', (t) => {
  const currentValue = 110;
  const change = 10;
  const isPositive = true;
  const previousValue = calculationUtils.previousValue(currentValue, change, isPositive);
  t.is(previousValue, 100, 'previous value should be 100');
});

test('previousValue returns 100 for a value of 80 and a change of -20', (t) => {
  const currentValue = 80;
  const change = 20;
  const isPositive = false;
  const previousValue = calculationUtils.previousValue(currentValue, change, isPositive);
  t.is(previousValue, 100, 'previous value should be 100');
});

test('previousValue returns null if currentValue is invalid', (t) => {
  const currentValue = null;
  const change = 20;
  const isPositive = false;
  const previousValue = calculationUtils.previousValue(currentValue, change, isPositive);
  t.is(previousValue, null, 'previous value should be null');
});

test('previousValue returns null if change is invalid', (t) => {
  const currentValue = 100;
  const change = null;
  const isPositive = false;
  const previousValue = calculationUtils.previousValue(currentValue, change, isPositive);
  t.is(previousValue, null, 'previous value should be null');
});

test('previousValue returns null if isPositive is invalid', (t) => {
  const currentValue = 100;
  const change = 20;
  const isPositive = null;
  const previousValue = calculationUtils.previousValue(currentValue, change, isPositive);
  t.is(previousValue, null, 'previous value should be null');
});
