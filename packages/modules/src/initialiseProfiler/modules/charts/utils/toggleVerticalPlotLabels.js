const toggleVerticalPlotLabels = (event, div) => {
  const daysThreshold = 120;
  let min = 0;
  let max = 0;
  if (event.xAxis) {
    min = Math.round(event.xAxis[0].min);
    max = Math.round(event.xAxis[0].max);
  } else if (event.currentTarget) {
    min = Math.round(event.currentTarget.xAxis[0].dataMin);
    max = Math.round(event.currentTarget.xAxis[0].dataMax);
  }
  const daysSpan = Math.round((max - min) / (60 * 60 * 24 * 1000));
  const $label = $(`#${div} .chart_plot_label`);
  if (daysSpan > daysThreshold) {
    $label.fadeOut(200);
  } else {
    $label.fadeIn(200);
  }
};

export default toggleVerticalPlotLabels;
