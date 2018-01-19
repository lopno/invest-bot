const test = require('ava');
const valuationApi = require('./valuation');

test('GET June Defensive site should return a response for a GET request', (t) => {
  return valuationApi.getJuneDefensiveSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Defensive site');
    });
});

test('GET June Defensive price site should return a response for a GET request', (t) => {
  return valuationApi.getJuneDefensivePriceSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Defensive price site');
    });
});

test('GET June Moderate Short site Should return a response for a GET request', (t) => {
  return valuationApi.getJuneModerateShortSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Moderate Short site');
    });
});

test('GET June Moderate Short price site Should return a response for a GET request', (t) => {
  return valuationApi.getJuneModerateShortPriceSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Moderate Short price site');
    });
});

test('GET June Moderate site should return a response for a GET request', (t) => {
  return valuationApi.getJuneModerateSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Moderate site');
    });
});

test('GET June Moderate price site should return a response for a GET request', (t) => {
  return valuationApi.getJuneModeratePriceSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Moderate price site');
    });
});

test('GET June balanced site should return a response for a GET request', (t) => {
  return valuationApi.getJuneBalancedSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June balanced site');
    });
});

test('GET June balanced price site should return a response for a GET request', (t) => {
  return valuationApi.getJuneBalancedPriceSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June balanced price site');
    });
});

test('GET June Progressive site should return a response for a GET request', (t) => {
  return valuationApi.getJuneProgressiveSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Progressive site');
    });
});

test('GET June Progressive price site should return a response for a GET request', (t) => {
  return valuationApi.getJuneProgressivePriceSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Progressive price site');
    });
});

test('GET June Opportunity site should return a response for a GET request', (t) => {
  return valuationApi.getJuneOpportunitySite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Opportunity site');
    });
});

test('GET June Opportunity price site should return a response for a GET request', (t) => {
  return valuationApi.getJuneOpportunityPriceSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Opportunity site');
    });
});

test('GET June Equity site should return a response for a GET request', (t) => {
  return valuationApi.getJuneEquitySite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Equity site');
    });
});

test('GET June Equity price site should return a response for a GET request', (t) => {
  return valuationApi.getJuneEquityPriceSite()
    .then((site) => {
      t.truthy(site, 'expected a response from GET June Equity price site');
    });
});
