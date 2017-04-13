/* eslint-disable no-var, func-names, prefer-arrow-callback */
const sinon = require('sinon');
require('sinon-as-promised');
const assert = require('chai').assert;

const fundType = require('./../constant/fundType');
const database = require('../database/database');
const valuationApi = require('../api/valuation');
const fundSquareValuationParser = require('../parse/fundSquareValuation');

const valuationUtils = require('./valuation');

function validateValuation(valuation) {
  assert.property(valuation, 'value', 'expected valuation to have value property');
  assert.property(
    valuation, 'previousValue', 'expected valuation to have previousValue property');
  assert.property(valuation, 'change', 'expected valuation to have change property');
  assert.property(valuation, 'isPositive', 'expected valuation to have isPositive property');
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
      const fund = fundType.balanced;
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

      // should not fetch site if valuation is already in database
      valuationApiMock
        .expects('getJuneBalancedSite')
        .never();

      valuationUtils.getValuation(fund)
        .then(validateValuation)
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => done())
        .catch(done);
    });

    it('should parse site, store data, and return it, if value in database is null', function (done) {
      const currentDate = new Date(2017, 3, 13); // April 13th 2017
      const yesterday = new Date(2017, 3, 12); // April 12th 2017
      const fund = fundType.balanced;
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
        .withExactArgs(currentDate, fund, parsedValuation.value)
        .resolves();

      // should fetch site if valuation is null in database
      valuationApiMock
        .expects('getJuneBalancedSite')
        .once()
        .resolves(dummySite);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite)
        .resolves(parsedValuation);

      valuationUtils.getValuation(fund)
        .then(validateValuation)
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => fundSquareValuationParserMock.verify())
        .then(() => done())
        .catch(done);
    });

    it('should parse site, store data, and return it, if data is not in database', function (done) {
      const currentDate = new Date(2017, 3, 13); // April 13th 2017
      const fund = fundType.balanced;
      const dummySite = 'I am a html site, trust me.';
      const parsedValuation = {
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
        .withExactArgs(currentDate, fund, parsedValuation.value)
        .resolves();

      valuationApiMock
        .expects('getJuneBalancedSite')
        .once()
        .resolves(dummySite);

      fundSquareValuationParserMock
        .expects('parseFundSquareValuationSite')
        .once()
        .withExactArgs(dummySite)
        .resolves(parsedValuation);

      valuationUtils.getValuation(fund)
        .then(validateValuation)
        .then(() => databaseMock.verify())
        .then(() => valuationApiMock.verify())
        .then(() => done())
        .catch(done);
    });
  });
});
