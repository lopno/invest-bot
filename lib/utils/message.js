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
  if (isPositive) {
    return 'Nice!';
  }

  return 'Oh well.';
}

function formatValuation(valuation, sharesCount, fundType) {
  const shares = sharesCount || 1;
  const isUpdatedToday = valuation.date.getDay() === new Date().getDay();
  const intro = isUpdatedToday ?
    'Today\'s valuation'
    : `The latest valuation (${formatDate(valuation.date)})`;


  return `${intro} for ${fundType} is ${valuation.value} (${valuation.isPositive ? '+' : '-'} ${valuation.change})`;

  /*
   console.log(messageUtils.formatDate(valuation.date));
   console.log('New:         ', valuation.value, ' ', valuation.value * sharesCount);
   console.log('change:      ', valuation.isPositive ? '+' : '-', valuation.change);
   console.log('Old:         ', valuation.previousValue, ' ', valuation.previousValue * sharesCount);
   console.log('value change:', (valuation.value - valuation.previousValue) * sharesCount, '\n');
   */
}

module.exports = {
  printJuneLogo,
  formatDate,
  formatValuation,
};
