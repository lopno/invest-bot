const test = require('ava');
const slackMessage = require('./slackMessage');
const fundType = require('../constant/fundType');

test('parseSlackMessage should return an array containing all fund types for a message containing \'all\'', (t) => {
  const result = slackMessage.parseSlackMessage('show me all the funds, please Mr. bot');
  t.not(result.funds, undefined, 'expected result to have property funds');
  t.true(result.funds.indexOf(fundType.defensive) > -1);
  t.true(result.funds.indexOf(fundType.moderateShort) > -1);
  t.true(result.funds.indexOf(fundType.moderate) > -1);
  t.true(result.funds.indexOf(fundType.balanced) > -1);
  t.true(result.funds.indexOf(fundType.progressive) > -1);
  t.true(result.funds.indexOf(fundType.opportunity) > -1);
  t.true(result.funds.indexOf(fundType.equity) > -1);
});

test('parseSlackMessage should return array including DEFENSIVE if message contains word defensive', (t) => {
  const result = slackMessage.parseSlackMessage('I am a defensive dude');
  t.true(result.funds.indexOf(fundType.defensive) > -1);
});

test('parseSlackMessage should return array including  MODERATE_SHORT if message contains words moderate and short', (t) => {
  const result = slackMessage.parseSlackMessage('give me short and maybe give me moderate');
  t.true(result.funds.indexOf(fundType.moderateShort) > -1);
});

test('parseSlackMessage should return array including  MODERATE if message contains word moderate and not word short', (t) => {
  const result = slackMessage.parseSlackMessage('I am a moderate dude');
  t.true(result.funds.indexOf(fundType.moderate) > -1);
});

test('parseSlackMessage should return array including  BALANCED if message contains word balanced', (t) => {
  const result = slackMessage.parseSlackMessage('I am a balanced dude');
  t.true(result.funds.indexOf(fundType.balanced) > -1);
});

test('parseSlackMessage should return array including  progressive if message contains word progressive', (t) => {
  const result = slackMessage.parseSlackMessage('I am a progressive dude');
  t.true(result.funds.indexOf(fundType.progressive) > -1);
});

test('parseSlackMessage should return array including opportunity if message contains word opportunity', (t) => {
  const result = slackMessage.parseSlackMessage('I am a opportunity dude');
  t.true(result.funds.indexOf(fundType.opportunity) > -1);
});

test('parseSlackMessage should return array including opportunity if message contains word opportunity', (t) => {
  const result = slackMessage.parseSlackMessage('I am an equity dude');
  t.true(result.funds.indexOf(fundType.equity) > -1);
});

test('parseSlackMessage should return array including opportunity if message does not contain a fund type', (t) => {
  const result = slackMessage.parseSlackMessage('I am a dude');
  t.true(result.funds.indexOf(fundType.opportunity) > -1);
});

test('parseSlackMessage should parse first number as sharesCount', (t) => {
  const result =
    slackMessage.parseSlackMessage('How is balanced doing bro? I have 10.3 shares <3!!!');
  t.is(result.sharesCount, '10.3');
  t.true(result.funds.indexOf(fundType.balanced) > -1);
});

test('parseSlackMessage should parse floating point numbers with comma as dots', (t) => {
  const result =
    slackMessage.parseSlackMessage('How is balanced doing bro? I have 10,3 shares <3!!!');
  t.is(result.sharesCount, '10.3');
  t.true(result.funds.indexOf(fundType.balanced) > -1);
});

test('parseSlackMessage should parse integers', (t) => {
  const result =
    slackMessage.parseSlackMessage('How is balanced doing bro? I have 10 shares <3!!!');
  t.is(result.sharesCount, '10');
  t.true(result.funds.indexOf(fundType.balanced) > -1);
});

test('parseSlackMessage should parse integers', (t) => {
  const result =
    slackMessage.parseSlackMessage('How is equity doing bro? I have 10 shares <3!!!');
  t.is(result.sharesCount, '10');
  t.true(result.funds.indexOf(fundType.equity) > -1);
});

test('parseSlackMessage should parse first number', (t) => {
  const result =
    slackMessage.parseSlackMessage('74238974.20 384729 5748675.123, 543,23343 wowowowo');
  t.is(result.sharesCount, '74238974.20');
});

test('parseSlackMessage should ignore person ID', (t) => {
  const result =
    slackMessage.parseSlackMessage('<@U4EC16W8M> opportunity 87');
  t.is(result.sharesCount, '87');
});
