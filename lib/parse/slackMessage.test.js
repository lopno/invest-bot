const slackMessage = require('./slackMessage');
const assert = require('chai').assert;
const fundType = require('../constant/fundType');

/* global describe, it */

describe('slackMessage', () => {
  describe('parseSlackMessage', () => {
    it('Should return DEFENSIVE if message contains word defensive', () => {
      const result = slackMessage.parseSlackMessage('I am a defensive dude');
      assert.equal(result.fundType, fundType.defensive);
    });

    it('Should return MODERATE_SHORT if message contains words moderate and short', () => {
      const result = slackMessage.parseSlackMessage('give me short and maybe give me moderate');
      assert.equal(result.fundType, fundType.moderateShort);
    });

    it('Should return MODERATE if message contains word moderate and not word short', () => {
      const result = slackMessage.parseSlackMessage('I am a moderate dude');
      assert.equal(result.fundType, fundType.moderate);
    });

    it('Should return BALANCED if message contains word balanced', () => {
      const result = slackMessage.parseSlackMessage('I am a balanced dude');
      assert.equal(result.fundType, fundType.balanced);
    });

    it('Should return progressive if message contains word progressive', () => {
      const result = slackMessage.parseSlackMessage('I am a progressive dude');
      assert.equal(result.fundType, fundType.progressive);
    });

    it('Should return opportunity if message contains word opportunity', () => {
      const result = slackMessage.parseSlackMessage('I am a opportunity dude');
      assert.equal(result.fundType, fundType.opportunity);
    });

    it('Should return opportunity if message does not contain a fund type', () => {
      const result = slackMessage.parseSlackMessage('I am a dude');
      assert.equal(result.fundType, fundType.opportunity);
    });

    it('should parse first number as sharesCount', () => {
      const result =
        slackMessage.parseSlackMessage('How is balanced doing bro? I have 10.3 shares <3!!!');
      assert.equal(result.sharesCount, 10.3);
      assert.equal(result.fundType, fundType.balanced);
    });

    it('should parse floating point numbers with comma as dots', () => {
      const result =
        slackMessage.parseSlackMessage('How is balanced doing bro? I have 10,3 shares <3!!!');
      assert.equal(result.sharesCount, 10.3);
      assert.equal(result.fundType, fundType.balanced);
    });

    it('should parse integers', () => {
      const result =
        slackMessage.parseSlackMessage('How is balanced doing bro? I have 10 shares <3!!!');
      assert.equal(result.sharesCount, 10);
      assert.equal(result.fundType, fundType.balanced);
    });

    it('should parse first number', () => {
      const result =
        slackMessage.parseSlackMessage('74238974.20 384729 5748675.123, 543,23343 wowowowo');
      assert.equal(result.sharesCount, 74238974.20);
    });

    it('should ignore person ID', () => {
      const result =
        slackMessage.parseSlackMessage('<@U4EC16W8M> opportunity 87');
      assert.equal(result.sharesCount, 87);
    });
  });
});
