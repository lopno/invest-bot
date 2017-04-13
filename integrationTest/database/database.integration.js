/* eslint-disable import/no-extraneous-dependencies, func-names, prefer-arrow-callback */
const assert = require('chai').assert;
const database = require('../../lib/database/database');

/* global describe, it */

if (process.env.DATABASE_URL) {
  describe('database', function () {
    describe('getLatestValuations', function () {
      it('should return 2 valuations if given 2 as input', function (done) {
        const count = 2;
        database.getLatestValuations(count)
          .then((result) => {
            assert.lengthOf(result, count, `expected ${count} rows as result`);
          })
          .then(() => done())
          .catch(done);
      });
    });
  });
} else {
  throw new Error('DATABASE_URL not defined');
}
