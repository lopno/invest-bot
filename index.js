/* eslint-disable no-console */
const SlackBot = require('slackbots');

const slackMessageParse = require('./lib/parse/slackMessage');
const messageUtils = require('./lib/utils/message');
const valuationUtils = require('./lib/utils/valuation');

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
  console.log('found this channel: ', channelRes);
  return channelRes.name;
}

// all ingoing events https://api.slack.com/rtm
investBot.on('message', (data) => {
  if (data.type === 'message'
  && data.text.includes('<@U4EC16W8M>')) {
    console.log(data);
    const channel = getChannelById(data.channel);
    console.log('posting to channel: ', channel);
    const parsedMessage = slackMessageParse.parseSlackMessage(data.text);
    valuationUtils.getValuation(parsedMessage.fundType)
      .then(valuation =>
        investBot.postMessageToChannel(
          channel,
          messageUtils.formatValuation(
            valuation, parsedMessage.sharesCount, parsedMessage.fundType),
          params))
      .then(res => console.log('res: ', res))
      .catch(error => console.log('error: ', error));
  }
});
