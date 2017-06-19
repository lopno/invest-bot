/* eslint-disable import/no-extraneous-dependencies */
const test = require('ava');
const database = require('../../lib/database/database');

test('getLatestValuations should return 2 valuations if given 2 as input', (t) => {
  const count = 2;
  return database.getLatestValuations(count)
    .then((result) => {
      t.is(result.length, count, `expected ${count} rows as result`);
    });
});
