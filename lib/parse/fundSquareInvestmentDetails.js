const xpath = require('xpath');
const parse5 = require('parse5');
const xmlser = require('xmlserializer');
const dom = require('xmldom').DOMParser;

/**
 * Parses fundSquare site
 * @param site
 * @param fundType
 * @returns {{assetString: string, value: Number, date: Date}}
 */
function parseFundSquareInvestmentDetailsSite(site, fundType) {
  const document = parse5.parse(site.toString());
  const xhtml = xmlser.serializeToString(document);
  /* eslint-disable new-cap */
  const doc = new dom({ errorHandler: { error: () => {} } }).parseFromString(xhtml);
  /* eslint-enable new-cap */
  const select = xpath.useNamespaces({ x: 'http://www.w3.org/1999/xhtml' });
  const totalAssets =
    select('(//x:div[@id="content"]/x:div[@id="blocresume"])/x:table/x:tbody/x:tr[3]/x:td/x:table/x:tbody/x:tr/x:td/x:div[3]/x:center/x:table/x:tbody/x:tr[7]/x:td[2]/text()', doc)
      .toString().trim();
  const dateString =
    select('(//x:div[@id="content"]/x:div[@id="blocresume"])/x:table/x:tbody/x:tr[3]/x:td/x:table/x:tbody/x:tr/x:td/x:div[3]/x:center/x:table/x:tbody/x:tr[1]/x:td[2]/text()', doc)
      .toString().trim();
  const totalAssetsNumber = parseFloat(totalAssets.split(' ').join('').replace('DKK', ''));
  const dateArray = dateString.split('/');
  const investedDate = new Date(
    parseInt(dateArray[2], 10),
    parseInt(dateArray[1], 10) - 1,
    parseInt(dateArray[0], 10));

  return {
    fundType,
    assetString: totalAssets,
    value: totalAssetsNumber,
    date: investedDate,
  };
}

module.exports = {
  parseFundSquareInvestmentDetailsSite,
};
