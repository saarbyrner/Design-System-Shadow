/* eslint-disable flowtype/require-valid-file-annotation */
const formatGraphData = (graphData) => {
  const dates = [];
  const datapoints = [];
  let categories = [];
  const lines = [];
  let count = 0;

  if (graphData.categories) {
    categories = graphData.categories;
  }

  graphData.metrics.forEach((metric, metricIndex) =>
    metric.series.forEach((item, seriesIndex) => {
      // 2D array of table data
      datapoints[count] = {};
      lines[count] = {
        metricIndex,
        seriesIndex,
      };

      item.datapoints.forEach((datapoint) => {
        // if we don't have the date, add it to our dates array
        if (dates.indexOf(datapoint[0]) === -1) {
          dates.push(datapoint[0]);
        }

        // update our datapoint hash for the current series
        datapoints[count][datapoint[0]] = datapoint[1];
      });

      count += 1;
    })
  );

  // sort dates ascending
  dates.sort((a, b) => a - b);

  return {
    dates,
    datapoints,
    categories,
    lines,
  };
};

export default formatGraphData;
