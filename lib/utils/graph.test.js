const test = require('ava');
const graphUtils = require('./graph');

test('getGraphLink returns a proper link', (t) => {
  const values = [92, 110, 100, 109, 100, 102, 118];
  const labels = [
    '01-05-2017',
    '02-05-2017',
    '03-05-2017',
    '04-05-2017',
    '05-05-2017',
    '06-05-2017',
    '07-05-2017'
  ];
  const minValue = 90;
  const maxValue = 120;
  const lineThickness = 3.5;
  const lineColor = 'FFFFFF';
  const axisColor = 'FFFFFF';
  const backgroundColor = '372987';
  const width = 600;
  const height = 400;
  const resultLink = graphUtils.getGraphLink(
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
  );
  const expectedLink = 'https://chart.googleapis.com/chart?chxt=x,y&chxr=0,0,7|1,90,120&chds=90,120&cht=lc&chd=t:92,110,100,109,100,102,118&chxl=0:|01-05-2017|02-05-2017|03-05-2017|04-05-2017|05-05-2017|06-05-2017|07-05-2017&chs=600x400&chco=FFFFFF&chls=3.5&chf=c,s,372987|bg,s,372987&chxs=0,N,FFFFFF,12,0,lt,FFFFFF,FFFFFF|1,N,FFFFFF,12,1,lt,FFFFFF,FFFFFF&chg=0,3.33,0';

  t.is(resultLink, expectedLink, 'expected links to be the same');
});
