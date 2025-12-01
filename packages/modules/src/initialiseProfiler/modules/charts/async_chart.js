import Spinner from 'spin';
import spinnerOptions from '../utilities/spinnerOptions';
import initCharts, { initChartsInModal } from './init_charts';

export default () => {
  $(document).ready(() => {
    const asyncCharts = $('.async_chart-js');
    if (asyncCharts.length > 0) {
      // This returns an anonymous function that will call the url to get the html for
      // the chart to render and insert it into the div with the given id
      const createAsyncChartRenderer = (id, url) => () => {
        const target = document.getElementById(id);
        const spinner = new Spinner(spinnerOptions()).spin(target);
        $.get(url, (data) => {
          $(`#${id}`).html(data);
          spinner.stop();
          initCharts();
        });
      };

      // eslint-disable-next-line func-names
      asyncCharts.each(function () {
        const divId = $(this).data('divId');
        const url = $(this).data('url');

        const renderName = `render_${divId}`;
        window[renderName] = createAsyncChartRenderer(divId, url);
      });
    }

    // Init the charts in the modals (example: /analysis/squad modals).
    $(document).ready(() => {
      $('#km-modal').on('show.bs.modal', () => {
        initChartsInModal();
      });
    });
  });
};
