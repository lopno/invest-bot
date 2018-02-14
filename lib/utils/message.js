const dateUtils = require('./date');
const reactions = require('../constant/reactions');
const fundTypes = require('../constant/fundType');
const numberUtils = require('./number');
const actionTypes = require('./../constant/action');


function printJuneLogo() {
  /* eslint-disable no-console */
  console.log('JJJJJJJJJJJ   UU       UU   NN       NN   EEEEEEEEE');
  console.log('JJJJJJJJJJJ   UU       UU   NNN      NN   EEEEEEEEE');
  console.log('         JJ   UU       UU   NNNN     NN   EE       ');
  console.log('         JJ   UU       UU   NN NN    NN  EEEEEEE   ');
  console.log('         JJ   UU       UU   NN  NN   NN   EE       ');
  console.log('         JJ   UU       UU   NN   NN  NN  EEEEEEE   ');
  console.log('        JJJ   UU       UU   NN    NN NN   EE       ');
  console.log('JJJJJJJJJJJ   UUU     UUU   NN     NNNN   EEEEEEEEE');
  console.log('JJJJJJJJJJ     UUUUUUUUU    NN      NNN   EEEEEEEEE');
  /* eslint-enable no-console */
}

function formatDate(date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return '';
  }
  return `${date.getDate()}/${(date.getMonth() + 1)} ${dateUtils.getWeekDay(date.getDay())}`;
}

function getReaction(change, isPositive) {
  if (change === 0.00) {
    return reactions.noChange[
      numberUtils.getRandomNumber(reactions.noChange)
      ];
  }
  if (isPositive && change <= 0.05) {
    return reactions.smallestPositiveChange[
      numberUtils.getRandomNumber(reactions.smallestPositiveChange)
      ];
  }
  if (isPositive && change <= 0.10) {
    return reactions.smallPositiveChange[
      numberUtils.getRandomNumber(reactions.smallPositiveChange)
      ];
  }
  if (isPositive && change <= 0.25) {
    return reactions.postiveChange[
      numberUtils.getRandomNumber(reactions.postiveChange)
      ];
  }
  if (isPositive && change <= 0.50) {
    return reactions.bigPostiveChange[
      numberUtils.getRandomNumber(reactions.bigPostiveChange)
      ];
  }
  if (isPositive && change > 0.50) {
    return reactions.biggestPositiveChange[
      numberUtils.getRandomNumber(reactions.biggestPositiveChange)
      ];
  }
  if (!isPositive && change <= 0.05) {
    return reactions.smallestNegativeChange[
      numberUtils.getRandomNumber(reactions.smallestNegativeChange)
      ];
  }
  if (!isPositive && change <= 0.10) {
    return reactions.smallNegativeChange[
      numberUtils.getRandomNumber(reactions.smallNegativeChange)
      ];
  }
  if (!isPositive && change <= 0.25) {
    return reactions.negativeChange[
      numberUtils.getRandomNumber(reactions.negativeChange)
      ];
  }
  if (!isPositive && change <= 0.50) {
    return reactions.bigNegativeChange[
      numberUtils.getRandomNumber(reactions.bigNegativeChange)
      ];
  }
  if (!isPositive && change > 0.50) {
    return reactions.biggestNegativeChange[
      numberUtils.getRandomNumber(reactions.biggestNegativeChange)
      ];
  }

  return 'Oh well.';
}

function formatFloat(float) {
  return Math.round(float * 100) / 100;
}

function formatFundType(fundType) {
  if (fundType === fundTypes.moderateShort) {
    return 'MODERATE_SHORT';
  }
  return fundType.toUpperCase();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('de-DE').format(value)
  .replace(/[,.]/g, m => m === ',' ? '.' : ','); // eslint-disable-line
}

function formatValuation(valuation, sharesCount, fundType) {
  const isUpdatedToday = valuation.date.getDay() === new Date().getDay();
  const isLatestValuationValid =
    numberUtils.isNumber(valuation.value) && numberUtils.isNumber(valuation.change);
  const intro = isUpdatedToday && isLatestValuationValid ?
    'Today\'s valuation'
    : `The latest valuation (${formatDate(valuation.date)})`;
  const prefix = valuation.isPositive ? '+' : '';
  if (!isLatestValuationValid) {
    return `${intro} for ${formatFundType(fundType)} is ${valuation.previousValue}.`;
  }
  const change = formatFloat((valuation.value - valuation.previousValue) * sharesCount);
  const summary = sharesCount !== 1 ? `The value of your ${sharesCount} shares is now ${formatFloat(valuation.value * sharesCount)} DKK (${prefix}${change} DKK).` : '';
  const reaction = getReaction(valuation.change, valuation.isPositive);
  return `${intro} for ${formatFundType(fundType)} is ${valuation.value} (${valuation.isPositive ? '+' : '-'} ${valuation.change}). ${summary} ${reaction}`;
}

function formatInvestment(invested, fundType) {
  const isUpdatedToday = invested.date.getDay() === new Date().getDay();
  const isLatestValuationValid =
    numberUtils.isNumber(invested.value);
  const intro = isUpdatedToday && isLatestValuationValid ?
    'Today\'s invested value'
    : `The latest invested value (${formatDate(invested.date)})`;
  const formattedCurrency = formatCurrency(invested.value);
  if (!isLatestValuationValid) {
    return `${intro} in ${formatFundType(fundType)} is ${formattedCurrency}. DKK`;
  }
  return `${intro} in ${formatFundType(fundType)} is ${formattedCurrency}. DKK`;
}


function getTotalInvestment(invested, fundType, action) {
  const isUpdatedToday = invested[0].date.getDay() === new Date().getDay();
  const intro = isUpdatedToday ?
  'Today\'s total invested value'
  : `The total invested value (${formatDate(invested[0].date)})`;
  // const intro = 'The total invested value';
  const sumInvested = invested.reduce((prev, next) => prev + next.value, 0);
  const formattedTotal = formatCurrency(sumInvested);
  if (action === actionTypes.total && invested.length === 1) {
    const singleValueTotal = formatCurrency(invested[0].value);
    return `${intro} in ${formatFundType(invested[0].fundType)}  is ${singleValueTotal}. DKK`;
  } else if (invested.length > 1) {
    return `${intro} in these funds is ${formattedTotal}. DKK`;
  }
  return `${intro} in these funds is ${formattedTotal}. DKK`;
}

function getHelp() {
  return 'I can help by answering questions about how your June investment is going.\nTell me the fund you want e.g. `opportunity` or `all` to see to see the latest valuation, or try one of the following actions with a fund:\n`graph` + number of days, will give a graph of selected period and fund \n`total` will show you the total invested value in the selected funds \n`invested` will show the invested value in each separate fund \nI\'ll always give tell how Opportunity is doing if I don\'t understand your message.';
}

module.exports = {
  printJuneLogo,
  formatDate,
  formatValuation,
  formatInvestment,
  getTotalInvestment,
  getHelp
};
