/* eslint-disable no-console */
const Botkit = require('botkit');
const graphAction = require('./lib/action/graph');
const slackMessageParse = require('./lib/parse/slackMessage');
const messageUtils = require('./lib/utils/message');
const valuationUtils = require('./lib/utils/valuation');
const actionTypes = require('./lib/constant/action');
const investmentUtils = require('./lib/utils/invested');

// init slack bot
const investBot = Botkit.slackbot({
  retry: 'Infinity',
  debug: false
});

investBot
  .spawn({
    token: process.env.SLACK_TOKEN
  })
  .startRTM((err) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log('Invest bot is up and running...');
    }
  });


investBot.on('direct_mention', (bot, message) => {
  console.log(message);

  const parsedMessage = slackMessageParse.parseSlackMessage(message.text);
  console.log('Message: ', message.text);
  console.log('Parsed Message: ', parsedMessage);

  if (parsedMessage.action === actionTypes.latestValuation) {
    valuationUtils.getValuation(parsedMessage.funds)
      .then(valuations =>
        valuations.forEach(valuation =>
          bot.reply(
            message,
            messageUtils.formatValuation(
              valuation, parsedMessage.sharesCount, valuation.fundType)
          )
        )
      )
      .catch(error => console.log('error: ', error));
  } else if (parsedMessage.action === actionTypes.graph) {
    // TODO: support more funds in one graph later
    // TODO: rename parsedMessage.sharesCount
    graphAction.graphFund(parsedMessage.funds[0], parseInt(parsedMessage.sharesCount, 10))
      .then((graphLink) => {
        bot.reply(
          message,
          graphLink
        );
      })
      .catch(error => console.log(JSON.stringify(error)));
  } else if (parsedMessage.action === actionTypes.invested) {
    investmentUtils.getInvestment(parsedMessage.funds)
      .then(investments =>
        investments.forEach(invested =>
          bot.reply(
            message,
            messageUtils.formatInvestment(
              invested,
              invested.fundType)
          )
        )
      )
      .catch(error => console.log(JSON.stringify(error)));
  } else if (parsedMessage.action === actionTypes.total) {
    investmentUtils.getInvestment(parsedMessage.funds)
     .then(investment =>
         bot.reply(
           message,
           messageUtils.getTotalInvestment(
             investment,
             investment.fundType,
             parsedMessage.action)
         )
     )
     .catch(error => console.log(JSON.stringify(error)));
  }
});
