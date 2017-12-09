const sinon = require('sinon');
require('sinon-as-promised');
const test = require('ava');

const fundType = require('./../constant/fundType');
const database = require('../database/database');
const valuationApi = require('../api/valuation');
const fundSquareValuationParser = require('../parse/fundSquareValuation');

const valuationUtils = require('./valuation');
const numberUtils = require('./number');

function validateValuation(t, valuation) {
  t.not(valuation.value, undefined, 'expected valuation to have value property');
  // TODO: Remove comment when problem is fixed
  // assert.isTrue(numberUtils.isNumber(valuation.value, 'expected value to be a number');
  t.not(valuation.previousValue, undefined, 'expected valuation to have previousValue property');
  t.true(numberUtils.isNumber(valuation.previousValue), 'expected previousValue to be a number');
  t.not(valuation.change, undefined, 'expected valuation to have change property');
  // TODO: Remove comment when problem is fixed
  // assert.isTrue(numberUtils.isNumber(valuation.change), 'expected change to be a number');
  t.not(valuation.isPositive, undefined, 'expected valuation to have isPositive property');
  t.is(typeof valuation.isPositive, 'boolean', 'expected isPositive to be a boolean');
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
  const valuationFunction = valuationUtils.getSite(fundType.defensive);
  t.is(typeof valuationFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given moderate short fund type', (t) => {
  const valuationFunction = valuationUtils.getSite(fundType.moderateShort);
  t.is(typeof valuationFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given moderate fund type', (t) => {
  const valuationFunction = valuationUtils.getSite(fundType.moderate);
  t.is(typeof valuationFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given balanced fund type', (t) => {
  const valuationFunction = valuationUtils.getSite(fundType.balanced);
  t.is(typeof valuationFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given progressive fund type', (t) => {
  const valuationFunction = valuationUtils.getSite(fundType.progressive);
  t.is(typeof valuationFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given opportunity fund type', (t) => {
  const valuationFunction = valuationUtils.getSite(fundType.opportunity);
  t.is(typeof valuationFunction, 'function', 'expected getSite to return a function');
});

test('should return a function given equity fund type', (t) => {
  const valuationFunction = valuationUtils.getSite(fundType.equity);
  t.is(typeof valuationFunction, 'function', 'expected getSite to return a function');
});

test('should return null for an invalid fund type', (t) => {
  const valuationFunction = valuationUtils.getSite(null);
  t.is(valuationFunction, null, 'expected getSite to return null for invalid fund type');
});

// TODO: should probably split this out in different files

test.serial('getValuation should use data from database if it exists', (t) => {
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

  return valuationUtils.getValuation(funds)
    .then(valuations => valuations.map(valuation => validateValuation(t, valuation)))
    .then(() => databaseMock.verify())
    .then(() => valuationApiMock.verify());
});

test.serial('getValuation should parse site, store data, and return it, if value in database is null', (t) => {
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

  return valuationUtils.getValuation(funds)
    .then(valuations => valuations.map(valuation => validateValuation(t, valuation)))
    .then(() => databaseMock.verify())
    .then(() => valuationApiMock.verify())
    .then(() => fundSquareValuationParserMock.verify());
});

test.serial('getValuation should parse site, store data, and return it, if data is not in database', (t) => {
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

  return valuationUtils.getValuation(funds)
    .then(valuations => valuations.map(valuation => validateValuation(t, valuation)))
    .then(() => databaseMock.verify())
    .then(() => valuationApiMock.verify());
});

test.serial('getValuation should parse site, store data, and return it, if data in database is not from today', (t) => {
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

  return valuationUtils.getValuation(funds)
    .then(valuations => valuations.map(valuation => validateValuation(t, valuation)))
    .then(() => databaseMock.verify())
    .then(() => valuationApiMock.verify());
});

test.serial('getValuation should return latest valuation from database if site doesn\'t give a proper valuation', (t) => {
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

  return valuationUtils.getValuation(funds)
    .then(valuations => valuations.map(valuation => validateValuation(t, valuation)))
    .then(() => databaseMock.verify())
    .then(() => valuationApiMock.verify());
});

test.serial('getValuation should handle different sources of data: opportunity valuation is from database, balanced gives good parsed value, and defensive gives bad parsed value', (t) => {
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

  return valuationUtils.getValuation(funds)
    .then(valuations => valuations.map(valuation => validateValuation(t, valuation)))
    .then(() => databaseMock.verify())
    .then(() => valuationApiMock.verify());
});
