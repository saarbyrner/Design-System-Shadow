import Highcharts from 'highcharts/highstock';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const setSlideinLegendColors = (legend) => {
    const chart =
      Highcharts.charts[
        $(`#${$(legend).data('chart-id')}`).data('highcharts-chart')
      ];
    if (chart && chart.series) {
      const legendColours = chart.series.map((s) => s.color);
      $(legend)
        .siblings('.slideinLegend-content')
        .find('li')
        .toArray()
        .forEach((e, index) => {
          const list = $(e);
          if (list.hasClass('disabled')) {
            list.find('.slideinLegend-circle').css('background-color', '#ccc');
          } else {
            list
              .find('.slideinLegend-circle')
              .css('background-color', legendColours[index]);
          }
        });
    }
  };

  window.slideinLegendToggleSeries = (legendElement, series) => {
    if ($(legendElement).data('toggle') === 'show') {
      series.hide();
      $(legendElement).addClass('disabled').data('toggle', 'hide');
    } else {
      series.show();
      $(legendElement).removeClass('disabled').data('toggle', 'show');
    }
    const legendHeader = $(legendElement).closest('.slideinLegend').find('h3');
    setSlideinLegendColors(legendHeader);
  };

  // eslint-disable-next-line func-names
  $(document).on('click', '.slideinLegend h3', function () {
    setSlideinLegendColors(this);
    $(this).closest('.slideinLegend').toggleClass('slideinLegend-active');
    $(this)
      .find('.slideinLegend-caret')
      .toggleClass('slideinLegend-caret-showLegend');
    $(this)
      .siblings('.slideinLegend-content')
      .toggleClass('slideinLegend-content-showLegend');
  });
};
