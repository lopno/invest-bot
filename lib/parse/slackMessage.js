const action = require('../constant/action');
const fundType = require('../constant/fundType');

function getActionFromMessage(message) {
  const upperMessage = message.toUpperCase();
  const includesGraph = upperMessage.includes('GRAPH');
  const includesInvested = upperMessage.includes('INVESTED');
  const includesTotal = upperMessage.includes('TOTAL');
  const includesHelp = upperMessage.includes('HELP');
  /*
   const isGreeting = [
   'HI',
   'HEY',
   'HELLO',
   'YO',
   'WHAT\'S UP',
   'WHAT UP',
   'WHADDUP',
   'WADDUP',
   'SUP',
   'HOW ARE',
   'DOING',
   'GOING ON',
   'HOWDY',
   ].some(greeting => upperMessage.includes(greeting));
   */
  if (includesHelp) {
    return action.help;
  } else if (includesGraph) {
    return action.graph;
  } else if (includesTotal) {
    return action.total;
  } else if (includesInvested) {
    return action.invested;
  }
  return action.latestValuation;
}

function getFundTypesFromMessage(message) {
  const upperMessage = message.toUpperCase();
  const includesAll = upperMessage.includes('ALL');
  const includesDefensive = upperMessage.includes(fundType.defensive.toUpperCase());
  const includesShort = upperMessage.includes('SHORT');
  const includesModerate = upperMessage.includes(fundType.moderate.toUpperCase());
  const includesBalanced = upperMessage.includes(fundType.balanced.toUpperCase());
  const includesProgressive = upperMessage.includes(fundType.progressive.toUpperCase());
  const includesOpportunity = upperMessage.includes(fundType.opportunity.toUpperCase());
  const includesEquity = upperMessage.includes(fundType.equity.toUpperCase());

  const result = [];

  if (includesAll || includesOpportunity) {
    result.push(fundType.opportunity);
  }

  if (includesAll || includesProgressive) {
    result.push(fundType.progressive);
  }

  if (includesAll || includesBalanced) {
    result.push(fundType.balanced);
  }

  if (includesAll || (includesModerate && !includesShort)) {
    result.push(fundType.moderate);
  }

  if (includesAll || includesShort) {
    result.push(fundType.moderateShort);
  }

  if (includesAll || includesDefensive) {
    result.push(fundType.defensive);
  }

  if (includesAll || includesEquity) {
    result.push(fundType.equity);
  }

  if (result.length === 0) {
    result.push(fundType.opportunity);
  }

  return result;
}

function getSharesCountFromMessage(message) {
  const strippedMessage = message.replace(/<@(.)*>/, ''); // remove person IDs
  const regex = /\d+((\.|,){1}\d+)?/;
  const matchedString = strippedMessage.match(regex);
  return matchedString ? matchedString[0].replace(/,/, '.') : 1;
}

function parseSlackMessage(slackMessage) {
  return {
    action: getActionFromMessage(slackMessage),
    funds: getFundTypesFromMessage(slackMessage),
    sharesCount: getSharesCountFromMessage(slackMessage),
  };
}

module.exports = {
  parseSlackMessage,
};
