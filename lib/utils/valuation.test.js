/* eslint-disable no-var, func-names, prefer-arrow-callback */
const sinon = require('sinon');
require('sinon-as-promised');
const assert = require('chai').assert;

const fundType = require('./../constant/fundType');
const database = require('../database/database');
const valuationApi = require('../api/valuation');
const fundSquareValuationParser = require('../parse/fundSquareValuation');

const valuationUtils = require('./valuation');
const numberUtils = require('./number');

function validateValuation(valuation) {
  assert.property(valuation, 'value', 'expected valuation to have value property');
  // TODO: Remove comment when problem is fixed
  // assert.isTrue(numberUtils.isNumber(valuation.value, 'expected value to be a number');
  assert.property(
    valuation, 'previousValue', 'expected valuation to have previousValue property');
  assert.isTrue(numberUtils.isNumber(valuation.previousValue), 'expected previousValue to be a number');
  assert.property(valuation, 'change', 'expected valuation to have change property');
  // TODO: Remove comment when problem is fixed
  // assert.isTrue(numberUtils.isNumber(valuation.change), 'expected change to be a number');
  assert.property(valuation, 'isPositive', 'expected valuation to have isPositive property');
  assert.isBoolean(valuation.isPositive, 'expected isPositive to be a boolean');
}

/* global describe, it, beforeEach, afterEach */

describe('Valuation Utils', () => {
  describe('getSite', () => {
    it('should return a function given defensive fund type', () => {
      const valuationFunction = valuationUtils.getSite(fundType.defensive);
      assert.isFunction(valuationFunction, 'expected getSite to return a function');
    });

    it('should return a function given moderate short fund type', () => {
      const valuationFunction = valuationUtils.getSite(fundType.moderateShort);
      assert.isFunction(valuationFunction, 'expected getSite to return a function');
    });

    it('should return a function given moderate fund type', () => {
      const valuationFunction = valuationUtils.getSite(fundType.moderate);
      assert.isFunction(valuationFunction, 'expected getSite to return a function');
    });

    it('should return a function given balanced fund type', () => {
      const valuationFunction = valuationUtils.getSite(fundType.balanced);
      assert.isFunction(valuationFunction, 'expected getSite to return a function');
    });

    it('should return a function given progressive fund type', () => {
      const valuationFunction = valuationUtils.getSite(fundType.progressive);
      assert.isFunction(valuationFunction, 'expected getSite to return a function');
    });

    it('should return a function given opportunity fund type', () => {
      const valuationFunction = valuationUtils.getSite(fundType.opportunity);
      assert.isFunction(valuationFunction, 'expected getSite to return a function');
    });

    it('should return null for an invalid fund type', () => {
      const valuationFunction = valuationUtils.getSite(null);
      assert.isNull(valuationFunction, 'expected getSite to return null for invalid fund type');
    });
  });

  describe('getValuation', () => {
    var sandbox;
    var clock;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      clock = sinon.useFakeTimers(new Date(2017, 3, 13).getTime()); // April 13th 2017
    });

    afterEach(() => {
      sandbox.restore();
      clock.restore();
    });

    it('should use data from database if it exists', function (done) {
      const currentDate = new Date(2017, 3, 13); // April 13th 2017
      const yesterday = new Date(2017, 3, 12); // April 12th 2017
      const funds = [fundType.balanced];
      const valuationData = [
        {
          date: currentDate,
          defensive: 101.24,
          moderateShort: 102.43,
          moderate: 103.84,
          balanced: 106.32,
          progressive: 108.43,
          opportunity: 113.38
        },
        {
          date: yesterday,
          defensive: 101.20,
          moderateShort: 102.38,
          moderate: 103.64,
          balanced: 106.12,
          progressive: 108.03,
          opportunity: 113.01
        }
      ];

      const databaseMock = sandbox.mock(database);
      const valuationApiMock = sandbox.mock(valuationApi);

      databaseMock
        .expects('getLatestValuations')
        .once()
        .withExactArgs(2)
        .resolves(valuationData);

      databaseMock
        .expects('saveValuation')
        .never();

      // should not fetch site if valuation is already in database
      valuationApiMock
        .expects('getJuneBalancedSite')
        .never();

      valuationUtils.getValuation(funds)
        .then(valuations => valuations.map(validateValuation))
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => done())
        .catch(done);
    });

    it('should parse site, store data, and return it, if value in database is null', function (done) {
      const currentDate = new Date(2017, 3, 13); // April 13th 2017
      const yesterday = new Date(2017, 3, 12); // April 12th 2017
      const chosenType = fundType.balanced;
      const funds = [chosenType];
      const dummySite = 'I am a html site, trust me.';

      // The newest valuation for balanced has not yet been saved
      const valuationData = [
        {
          date: currentDate,
          defensive: 101.24,
          moderateShort: 102.43,
          moderate: 103.84,
          balanced: null,
          progressive: 108.43,
          opportunity: 113.38
        },
        {
          date: yesterday,
          defensive: 101.20,
          moderateShort: 102.38,
          moderate: 103.64,
          balanced: 106.12,
          progressive: 108.03,
          opportunity: 113.01
        }
      ];

      const parsedValuation = {
        fundType: chosenType,
        value: 106.23,
        previousValue: 106.12,
        change: 0.11,
        isPositive: true,
        date: currentDate
      };

      const databaseMock = sandbox.mock(database);
      const valuationApiMock = sandbox.mock(valuationApi);
      const fundSquareValuationParserMock = sandbox.mock(fundSquareValuationParser);

      databaseMock
        .expects('getLatestValuations')
        .once()
        .withExactArgs(2)
        .resolves(valuationData);

      databaseMock
        .expects('saveValuation')
        .once()
        .withExactArgs(currentDate, chosenType, parsedValuation.value)
        .resolves();

      // should fetch site if valuation is null in database
      valuationApiMock
        .expects('getJuneBalancedSite')
        .once()
        .resolves(dummySite);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite, chosenType)
        .resolves(parsedValuation);

      valuationUtils.getValuation(funds)
        .then(valuations => valuations.map(validateValuation))
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => fundSquareValuationParserMock.verify())
        .then(() => done())
        .catch(done);
    });

    it('should parse site, store data, and return it, if data is not in database', function (done) {
      const currentDate = new Date(2017, 3, 13); // April 13th 2017
      const chosenType = fundType.balanced;
      const funds = [chosenType];
      const dummySite = 'I am a html site, trust me.';
      const parsedValuation = {
        fundType: chosenType,
        value: 106.23,
        previousValue: 106.12,
        change: 0.11,
        isPositive: true,
        date: currentDate
      };

      const databaseMock = sandbox.mock(database);
      const valuationApiMock = sandbox.mock(valuationApi);
      const fundSquareValuationParserMock = sandbox.mock(fundSquareValuationParser);

      databaseMock
        .expects('getLatestValuations')
        .withExactArgs(2)
        .once()
        .resolves(null);

      databaseMock
        .expects('saveValuation')
        .once()
        .withExactArgs(currentDate, chosenType, parsedValuation.value)
        .resolves();

      valuationApiMock
        .expects('getJuneBalancedSite')
        .once()
        .resolves(dummySite);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite, chosenType)
        .resolves(parsedValuation);

      valuationUtils.getValuation(funds)
        .then(valuations => valuations.map(validateValuation))
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => done())
        .catch(done);
    });

    it('should parse site, store data, and return it, if data in database is not from today', function (done) {
      const yesterday = new Date(2017, 3, 12); // April 12th 2017
      const twoDaysAgo = new Date(2017, 3, 11); // April 11th 2017
      const chosenType = fundType.balanced;
      const funds = [chosenType];
      const dummySite = 'I am a html site, trust me.';
      const parsedValuation = {
        fundType: chosenType,
        value: 106.23,
        previousValue: 106.12,
        change: 0.11,
        isPositive: true,
        date: yesterday
      };

      const databaseValues = [
        {
          date: yesterday,
          defensive: 101.24,
          moderateShort: 102.43,
          moderate: 103.84,
          balanced: 106.32,
          progressive: 108.43,
          opportunity: 113.38
        },
        {
          date: twoDaysAgo,
          defensive: 101.20,
          moderateShort: 102.38,
          moderate: 103.64,
          balanced: 106.12,
          progressive: 108.03,
          opportunity: 113.01
        }
      ];

      const databaseMock = sandbox.mock(database);
      const valuationApiMock = sandbox.mock(valuationApi);
      const fundSquareValuationParserMock = sandbox.mock(fundSquareValuationParser);

      databaseMock
        .expects('getLatestValuations')
        .withExactArgs(2)
        .once()
        .resolves(databaseValues);

      databaseMock
        .expects('saveValuation')
        .never();

      valuationApiMock
        .expects('getJuneBalancedSite')
        .once()
        .resolves(dummySite);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite, chosenType)
        .resolves(parsedValuation);

      valuationUtils.getValuation(funds)
        .then(valuations => valuations.map(validateValuation))
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => done())
        .catch(done);
    });

    it('should return latest valuation from database if site doesn\'t give a proper valuation', function (done) {
      const yesterday = new Date(2017, 3, 12); // April 12th 2017
      const twoDaysAgo = new Date(2017, 3, 11); // April 11th 2017
      const chosenType = fundType.balanced;
      const funds = [chosenType];
      const dummySite = 'I am a html site, trust me.';
      const parsedValuation = {
        fundType: chosenType,
        value: null,
        previousValue: null,
        change: null,
        isPositive: false,
        date: null
      };

      const databaseValues = [
        {
          date: yesterday,
          defensive: 101.24,
          moderateShort: 102.43,
          moderate: 103.84,
          balanced: 106.32,
          progressive: 108.43,
          opportunity: 113.38
        },
        {
          date: twoDaysAgo,
          defensive: 101.20,
          moderateShort: 102.38,
          moderate: 103.64,
          balanced: 106.12,
          progressive: 108.03,
          opportunity: 113.01
        }
      ];

      const databaseMock = sandbox.mock(database);
      const valuationApiMock = sandbox.mock(valuationApi);
      const fundSquareValuationParserMock = sandbox.mock(fundSquareValuationParser);

      databaseMock
        .expects('getLatestValuations')
        .withExactArgs(2)
        .once()
        .resolves(databaseValues);

      databaseMock
        .expects('saveValuation')
        .never();

      valuationApiMock
        .expects('getJuneBalancedSite')
        .once()
        .resolves(dummySite);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite, chosenType)
        .resolves(parsedValuation);

      valuationUtils.getValuation(funds)
        .then(valuations => valuations.map(validateValuation))
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => done())
        .catch(done);
    });

    it('should handle different sources of data: opportunity valuation is from database, balanced gives good parsed value, and defensive gives bad parsed value', function (done) {
      const currentDate = new Date(2017, 3, 13); // April 13th 2017
      const yesterday = new Date(2017, 3, 12); // April 12th 2017
      const funds = [fundType.progressive, fundType.balanced, fundType.defensive];
      const dummySite = 'I am a html site, trust me.';

      const newBalancedValuation = 106.23;

      const databaseValues = [
        {
          date: currentDate,
          defensive: null,
          moderateShort: 102.43,
          moderate: 103.84,
          balanced: null,
          progressive: 108.43,
          opportunity: 113.38
        },
        {
          date: yesterday,
          defensive: 101.20,
          moderateShort: 102.38,
          moderate: 103.64,
          balanced: 106.12,
          progressive: 108.03,
          opportunity: 113.01
        }
      ];

      const goodParsedValuation = {
        fundType: fundType.balanced,
        value: newBalancedValuation,
        previousValue: 106.12,
        change: 0.11,
        isPositive: true,
        date: currentDate
      };

      const badParsedValuation = {
        fundType: fundType.defensive,
        value: null,
        previousValue: null,
        change: Infinity,
        isPositive: false,
        date: null
      };

      const databaseMock = sandbox.mock(database);
      const valuationApiMock = sandbox.mock(valuationApi);
      const fundSquareValuationParserMock = sandbox.mock(fundSquareValuationParser);

      databaseMock
        .expects('getLatestValuations')
        .withExactArgs(2)
        .once()
        .resolves(databaseValues);

      // should only save the well formed valuation
      databaseMock
        .expects('saveValuation')
        .withExactArgs(currentDate, fundType.balanced, newBalancedValuation)
        .once();

      // should not save valuation if it is null
      databaseMock
        .expects('saveValuation')
        .withArgs(currentDate, fundType.defensive)
        .never();

      valuationApiMock
        .expects('getJuneBalancedSite')
        .once()
        .resolves(dummySite);

      valuationApiMock
        .expects('getJuneDefensiveSite')
        .once()
        .resolves(dummySite);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite, fundType.defensive)
        .resolves(badParsedValuation);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite, fundType.balanced)
        .resolves(goodParsedValuation);

      valuationUtils.getValuation(funds)
        .then(valuations => valuations.map(validateValuation))
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => done())
        .catch(done);
    });
  });
});
