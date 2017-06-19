const test = require('ava');
const dateUtils = require('./date');

test('getWeekDay returns the string \'Sunday\' given 0 as input', (t) => {
  const input = 0;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, 'Sunday');
});

test('getWeekDay returns the string \'Monday\' given 1 as input', (t) => {
  const input = 1;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, 'Monday', 'expected result string to be \'Monday\'');
});

test('getWeekDay returns the string \'Tuesday\' given 2 as input', (t) => {
  const input = 2;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, 'Tuesday', 'expected result string to be \'Tuesday\'');
});

test('getWeekDay returns the string \'Wednesday\' given 3 as input', (t) => {
  const input = 3;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, 'Wednesday', 'expected result string to be \'Wednesday\'');
});

test('getWeekDay returns the string \'Thursday\' given 4 as input', (t) => {
  const input = 4;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, 'Thursday', 'expected result string to be \'Thursday\'');
});

test('getWeekDay returns the string \'Friday\' given 5 as input', (t) => {
  const input = 5;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, 'Friday', 'expected result string to be \'Friday\'');
});

test('getWeekDay returns the string \'Saturday\' given 6 as input', (t) => {
  const input = 6;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, 'Saturday', 'expected result string to be \'Saturday\'');
});

test('getWeekDay returns an empty string \'\' given 7 as input', (t) => {
  const input = 7;
  const resultString = dateUtils.getWeekDay(input);
  t.is(resultString, '', 'expected result string to be \'\'');
});

test('formatDateToIso8601 formats date to format YYYY-MM-DD', (t) => {
  const input = new Date(1999, 0, 9); // 0 is January
  const resultString = dateUtils.formatDateToIso8601(input);
  t.is(resultString, '1999-01-09');
});

test('formatDateToIso8601 returns null if input is not of type date', (t) => {
  const input = '1999/12/31';
  const resultString = dateUtils.formatDateToIso8601(input);
  t.is(resultString, null);
});

test('formatDateToShortFormat returns null if input is not of type date', (t) => {
  const input = '1999/12/31';
  const resultString = dateUtils.formatDateToShortFormat(input);
  t.is(resultString, null);
});

test('formatDateToShortFormat returns 1/12 for December 1st', (t) => {
  const input = new Date(2017, 11, 1);
  const resultString = dateUtils.formatDateToShortFormat(input);
  t.is('1/12', resultString, 'expected December 1st to be formatted as \'1/12\'');
});
