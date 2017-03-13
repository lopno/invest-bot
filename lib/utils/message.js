const dateUtils = require('./date');
const reactions = require('../constant/reactions');
const numberUtils = require('./number');


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
      numberUtils.getRandomNumber(reactions.smallestNegativeChange)
      ];
  }
  if (!isPositive && change <= 0.50) {
    return reactions.bigNegativeChange[
      numberUtils.getRandomNumber(reactions.negativeChange)
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

function formatValuation(valuation, sharesCount, fundType) {
  const isUpdatedToday = valuation.date.getDay() === new Date().getDay();
  const intro = isUpdatedToday ?
    'Today\'s valuation'
    : `The latest valuation (${formatDate(valuation.date)})`;
  const prefix = valuation.isPositive ? '+' : '';
  const change = formatFloat((valuation.value - valuation.previousValue) * sharesCount);
  const summary = sharesCount !== 1 ? `The value of your ${sharesCount} shares is now ${formatFloat(valuation.value * sharesCount)} (${prefix}${change}).` : '';
  const reaction = getReaction(valuation.change, valuation.isPositive);
  return `${intro} for ${fundType} is ${valuation.value} (${valuation.isPositive ? '+' : '-'} ${valuation.change}). ${summary} ${reaction}`;
}

module.exports = {
  printJuneLogo,
  formatDate,
  formatValuation,
};
