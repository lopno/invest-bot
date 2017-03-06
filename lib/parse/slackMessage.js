const fundType = require('../constant/fundType');

function getFundTypeFromMessage(message) {
  const upperMessage = message.toUpperCase();
  const includesDefensive = upperMessage.includes(fundType.defensive);
  const includesShort = upperMessage.includes('SHORT');
  const includesModerate = upperMessage.includes(fundType.moderate);
  const includesBalanced = upperMessage.includes(fundType.balanced);
  const includesProgressive = upperMessage.includes(fundType.progressive);
  const includesOpportunity = upperMessage.includes(fundType.opportunity);

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

function parseSlackMessage(slackMessage) {
  // TODO: shares count
  return {
    fundType: getFundTypeFromMessage(slackMessage),
  }
}

module.exports = {
  parseSlackMessage,
};