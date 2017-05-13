/* eslint-disable max-len */
/**
 * Generates an image url for a graph
 * @param values - array of numbers
 * @param minValue - lower bound of the y-axis. Should be lower or equal to lowest value in values
 * @param maxValue - upper bound of the y-axis. Should be greater or equal to highest value in values
 * @param lineThickness - number of pixel the line is thick
 * @param lineColor - hex color of line e.g. C0FFEE
 * @param axisColor - hex color of axis and labels e.g. C0FFEE
 * @param backgroundColor - hex color of background e.g. C0FFEE
 * @param width - width of image in pixels
 * @param height - height of image in pixels
 * @returns {string} - url of image
 */
/* eslint-enable max-len */
function getGraphLink(
  values,
  labels,
  minValue,
  maxValue,
  lineThickness,
  lineColor,
  axisColor,
  backgroundColor,
  width,
  height
) {
  if (values.length !== labels.length) {
    throw new Error('getGraphLink: values and labels must be arrays of the same length');
  }
  const valuesString = values.join(',');
  const valuesLength = values.length;
  const labelsString = labels.join('|');

  return `https://chart.googleapis.com/chart?chxt=x,y&chxr=0,0,${valuesLength}|1,${minValue},${maxValue}&chds=${minValue},${maxValue}&cht=lc&chd=t:${valuesString}&chxl=0:|${labelsString}&chs=${width}x${height}&chco=${lineColor}&chls=${lineThickness}&chf=c,s,${backgroundColor}|bg,s,${backgroundColor}&chxs=0,N,${axisColor},12,0,lt,${axisColor},${axisColor}|1,N,${axisColor},12,1,lt,${axisColor},${axisColor}`
}

module.exports = {
  getGraphLink,
};
