const fetch = require('node-fetch');

const database = require('../database/database');
const databaseUtils = require('../utils/database');
const graphUtils = require('../utils/graph');
const dateUtils = require('../utils/date');

function graphFund(fund, valuationCount) {
  const values = [];
  const labels = [];
  return database.getLatestValuations(valuationCount)
    .then((valuations) => {
      valuations.reverse();
      valuations.forEach((valuation) => {
        const value = valuation[databaseUtils.getColumnForFundType(fund)];
        if (value !== null) {
          values.push(value);
          labels.push(dateUtils.formatDateToShortFormat(valuation.date));
        }
      });

      /* eslint-disable prefer-spread */
      const lowerBound = Math.floor(Math.min.apply(Math, values));
      const upperBound = Math.ceil(Math.max.apply(Math, values));
      /* eslint-enable prefer-spread */
      const lineWidth = 3;

      const graphLink = graphUtils.getGraphLink(
        values,
        labels,
        lowerBound, // TODO: make lower y-axis dynamic
        upperBound, // TODO: make upper y-axis dynamic
        lineWidth,
        'FFFFFF',
        'FFFFFF',
        '372987',
        750,
        400
      );

      const body = {
        longUrl: graphLink,
      };

      return fetch(
        `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        }
      );
    })
    .then(googleResponse => googleResponse.json())
    .then(res => res.id); // id is the shortened url
}

module.exports = {
  graphFund,
};
