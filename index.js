const express = require('express');
const favicon = require('serve-favicon');
const app = express();

const valuationUtils = require('./lib/utils/valuation');
const fundTypeConstants = require('./lib/constant/fundType');

app.get('/', (req, res) => {
  return valuationUtils.getValuation(fundTypeConstants.balanced)
    .then((valuation) => res.send(JSON.stringify(valuation)));
});

app.use(favicon(__dirname + '/public/favicon.ico'));

app.listen(process.env.PORT || 3000);
