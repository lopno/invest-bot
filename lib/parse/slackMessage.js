const fundType = require('../constant/fundType');

function getFundTypeFromMessage(message) {
  const upperMessage = message.toUpperCase();
  const includesDefensive = upperMessage.includes(fundType.defensive.toUpperCase());
  const includesShort = upperMessage.includes('SHORT');
  const includesModerate = upperMessage.includes(fundType.moderate.toUpperCase());
  const includesBalanced = upperMessage.includes(fundType.balanced.toUpperCase());
  const includesProgressive = upperMessage.includes(fundType.progressive.toUpperCase());
  const includesOpportunity = upperMessage.includes(fundType.opportunity.toUpperCase());

  if (includesDefensive) {
    return fundType.defensive;
  }

  if (includesModerate && !includesShort) {
    return fundType.moderate;
  }

  if (includesShort) {
    return fundType.moderateShort;
  }

  if (includesBalanced) {
    return fundType.balanced;
  }

  if (includesProgressive) {
    return fundType.progressive;
  }

  if (includesOpportunity) {
    return fundType.opportunity;
  }

  // default case
  return fundType.opportunity;
}

function getSharesCountFromMessage(message) {
  const strippedMessage = message.replace(/<@(.)*>/, ''); // remove person IDs
  const regex = /\d+((\.|,){1}\d+)?/;
  const matchedString = strippedMessage.match(regex);
  return matchedString ? matchedString[0].replace(/,/, '.') : 1;
}

function parseSlackMessage(slackMessage) {
  return {
    fundType: getFundTypeFromMessage(slackMessage),
    sharesCount: getSharesCountFromMessage(slackMessage),
  };
}

module.exports = {
  parseSlackMessage,
};
