const fundTypes = require('../constant/fundType');

/**
 * returns the corresponding row name given a fund type
 * @param fundType
 * @returns {*}
 */
function getColumnForFundType(fundType) {
  switch (fundType) {
    case fundTypes.defensive: return 'defensive';
    case fundTypes.moderateShort: return 'moderate_short';
    case fundTypes.moderate: return 'moderate';
    case fundTypes.balanced: return 'balanced';
    case fundTypes.progressive: return 'progressive';
    case fundTypes.opportunity: return 'opportunity';
    case fundTypes.equity: return 'equity';
    default: return null;
  }
}

module.exports = {
  getColumnForFundType,
};
