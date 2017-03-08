const dateUtils = require('./date');

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
  // TODO: write funny things here
    if (isPositive && change <= 0.05 ) {
      return "At least you're not losing money!";
    }
    if (isPositive && change <= 0.10) {
      return "Not bad, not bad..."
    }
    if (isPositive && change <= 0.25) {
      return "Today was a p good day!"
    }
    if (isPositive && change <= 0.50) {
      return "Now you're making money! :ok_hand:"
    }
    if (isPositive && change > 0.50) {
      return "The sky is the limit!"
    }
    if (!isPositive && change <= 0.05) {
      return "Could have been worse."
    }
    if (!isPositive && change <= 0.50)  {
      return ""
    }
    if (!isPositive && change > 0.50) {
      return "Hope you have a tough stomach."
    }

  return 'Oh well.';
}

function formatFloat(float) {
  return Math.round(float * 100) / 100;
}

function formatValuation(valuation, sharesCount, fundType) {
  const shares = sharesCount || 1;
  const isUpdatedToday = valuation.date.getDay() === new Date().getDay();
  const intro = isUpdatedToday ?
    'Today\'s valuation'
    : `The latest valuation (${formatDate(valuation.date)})`;
  const prefix = valuation.isPositive ? '+' : '-';
  const change = formatFloat((valuation.value - valuation.previousValue) * sharesCount);
  const summary = sharesCount !== 1 ? `The value of your ${sharesCount} shares is now ${formatFloat(valuation.value * sharesCount)} (${prefix}${change}).` : '';

  return `${intro} for ${fundType} is ${valuation.value} (${valuation.isPositive ? '+' : '-'} ${valuation.change}). ${summary}`;
}

module.exports = {
  printJuneLogo,
  formatDate,
  formatValuation,
};
