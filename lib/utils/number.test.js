const test = require('ava');
const numberUtils = require('./number');

test('padNumber should add 0\'s until length is reached', (t) => {
  const number = 12;
  const length = 4;
  const expectedResult = '0012';
  const result = numberUtils.padNumber(number, length);
  t.is(result, expectedResult);
});

test('padNumber should return the number string if length is less than the length of the number', (t) => {
  const number = 12;
  const length = 0;
  const expectedResult = '12';
  const result = numberUtils.padNumber(number, length);
  t.is(result, expectedResult);
});

test('padNumber should return the number string if length is equal to the length of the number', (t) => {
  const number = 12;
  const length = 2;
  const expectedResult = '12';
  const result = numberUtils.padNumber(number, length);
  t.is(result, expectedResult);
});

test('getPercentageChange should return the absolute percent-wise change between two numbers', (t) => {
  const oldNumber = 108.88;
  const newNumber = 108.41;
  const expectedResult = 0.43;
  const result = numberUtils.getPercentageChange(oldNumber, newNumber);
  t.is(result, expectedResult);
});

test('getPercentageChange should return the absolute percent-wise change between two numbers', (t) => {
  const oldNumber = 115.13;
  const newNumber = 114.42;
  const expectedResult = 0.62;
  const result = numberUtils.getPercentageChange(oldNumber, newNumber);
  t.is(result, expectedResult);
});

test('getPercentageChange should return the absolute percent-wise change between two numbers', (t) => {
  const oldNumber = 106.57;
  const newNumber = 106.22;
  const expectedResult = 0.33;
  const result = numberUtils.getPercentageChange(oldNumber, newNumber);
  t.is(result, expectedResult);
});
