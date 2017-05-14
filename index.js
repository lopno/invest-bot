/* eslint-disable no-console */
const SlackBot = require('slackbots');
const http = require('http');
const express = require('express');
const favicon = require('serve-favicon');

const graphAction = require('./lib/action/graph');
const slackMessageParse = require('./lib/parse/slackMessage');
const messageUtils = require('./lib/utils/message');
const valuationUtils = require('./lib/utils/valuation');
const actionTypes = require('./lib/constant/action');

const app = express();

// every 5 minutes (300000)
setInterval(() => http.get('http://protected-savannah-66517.herokuapp.com'), 300000);

app.get('/', (req, res) => res.sendStatus(200));

app.use(favicon(`${__dirname}/public/favicon.ico`));

app.listen(process.env.PORT || 3000);

const investBot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'Invest Bot',
});

// more information about additional params https://api.slack.com/methods/chat.postMessage
const params = {
  icon_emoji: ':ok_hand:',
};

investBot.on('start', () => {

  // investBot.postMessageToUser('mikaelmidt', 'Invest 4 lyfe!');
  // investBot.postMessageToUser('vedran', 'Invest 4 lyfe!');
  // investBot.postMessageToChannel('invest_test', 'service started', params);

  // console.log(investBot.channels);
});

function getChannelById(channelId) {
  // console.log('channels', channels);
  console.log('channelId', channelId);
  const channelRes = investBot.channels.filter(item => (item.id === channelId))[0];
  console.log('found this channel: ', channelRes.name);
  return channelRes.name;
}

// all ingoing events https://api.slack.com/rtm
investBot.on('message', (data) => {
  if (data.type === 'message'
    && data.text.includes('<@U4EC16W8M>')) {
    const channel = getChannelById(data.channel);
    const parsedMessage = slackMessageParse.parseSlackMessage(data.text);
    console.log('Message: ', data.text);
    console.log('Parsed Message: ', parsedMessage);

    if (parsedMessage.action === actionTypes.latestValuation) {
      valuationUtils.getValuation(parsedMessage.funds)
        .then(valuations =>
          valuations.forEach(valuation =>
            investBot.postMessageToChannel(
              channel,
              messageUtils.formatValuation(
                valuation, parsedMessage.sharesCount, valuation.fundType),
              params
            )
          )
        )
        .catch(error => console.log('error: ', error));
    } else if (parsedMessage.action === actionTypes.graph) {
      // TODO: support more funds in one graph later
      // TODO: rename parsedMessage.sharesCount
      graphAction.graphFund(parsedMessage.funds[0], parseInt(parsedMessage.sharesCount, 10))
        .then((graphLink) => {
          investBot.postMessageToChannel(
            channel,
            graphLink,
            params
          );
        })
        .catch(error => console.log(JSON.stringify(error)));
    }
  }
});
