import 'chosen-js';
import i18n from '@kitman/common/src/utils/i18n';
import initAthleteAnalysisChart from './charts/charts_initialisers/athlete_analysis';

export default () => {
  //------------------------------------------------------------------------
  // /app/views/analysis/athletes/_form.html.erb

  $(document).ready(() => {
    if ($('form#athlete_analysis').length > 0) {
      $('.chzn-select').chosen();

      const form = $('form#athlete_analysis');
      const button = form.find('input[type="submit"]');

      form.on('ajax:beforeSend', () => {
        // eslint-disable-next-line func-names
        form.find('.km-error').each(function () {
          $(this).removeClass('km-error');
        });
        if ($("select[name='athletes[]'] option:selected").length === 0) {
          $("select[name='athletes[]']")
            .closest('.chzn-select')
            .addClass('km-error');
        }
        if ($("select[name='variables[]'] option:selected").length === 0) {
          $("select[name='variables[]']")
            .closest('.chzn-select')
            .addClass('km-error');
        }
        if ($('.km-error').length > 0) {
          return false; // required to cancel the ajax request
        }

        button.attr('disabled', 'yes').attr('value', i18n.t('Loading...'));
        $('#loader_gif').show();
        $('#fetching_data_message').show();
        $('#drawing_content_message').hide();
        $('#searching_overlay').show();
        $('#js_alert_container').html('');
        $('#first-run').hide();
        $('#outlet').hide();

        const athletes = form.find("select[name='athletes[]']").val().join();
        const variables = form.find("select[name='variables[]']").val().join();
        const outputType = $('input#output_type_graph:checked').length
          ? 'graph'
          : 'table';
        window.location.hash = `a=${athletes}&v=${variables}&t=${outputType}`;
        return true;
      });

      form.on('ajax:success', (event, data) => {
        $('#fetching_data_message').hide();
        $('#loader_gif').hide();
        $('#searching_overlay').hide();
        $('#drawing_content_message').show();

        setTimeout(() => {
          $('#first-run').hide();
          $('#outlet').html(data).fadeTo(400, 1.0);
          initAthleteAnalysisChart();
          $(window).trigger('scroll');
          button
            .removeAttr('disabled')
            .attr('value', i18n.t('Generate Report'));
        }, 10);
      });

      form.on('ajax:error', () => {
        /* create error alert dynamically so user can dismiss it without problems */
        $('#js_alert_container').html(
          $('<div/>')
            .addClass('alert alert-warning')
            .html(
              $(
                '<button type="butto" class="close" data-dismiss="alert"/></button>'
              ).append('&times;')
            )
            .append(`<strong>${i18n.t('Error!')}</strong>`)
            .append(
              ` ${i18n.t(
                "There was an problem with the search. Try again to see if it's temporary, if not please contact support"
              )}`
            )
        );
        $('#outlet').html('');
        $('#first-run').show();
        $('#searching_overlay').hide();
        button.removeAttr('disabled').attr('value', i18n.t('Generate Report'));
      });

      $('#select_all').on('click', (e) => {
        e.preventDefault();
        $('#athletes option').prop('selected', true);
        $('#athletes').trigger('chosen:updated');
      });

      $('#deselect_all').on('click', (e) => {
        e.preventDefault();
        $('#athletes option').prop('selected', false);
        $('#athletes').trigger('chosen:updated');
      });

      $('#select_all_options').on('click', (e) => {
        e.preventDefault();
        $('#variables option').prop('selected', true);
        $('#variables').trigger('chosen:updated');
      });

      $('#deselect_all_options').on('click', (e) => {
        e.preventDefault();
        $('#variables option').prop('selected', false);
        $('#variables').trigger('chosen:updated');
      });

      // URL in format with params: analysis/athletes#a=108269&v=tv_16379&t=graph
      // Below removes hash, and splits based on '&' character
      // Very hacky, but not refactoring to query params as this is an old feature
      // (not been touched ~5 years as of 2024) and customers use bookmarks to auto load filters
      const urlHashParams = new Map(
        window.location.hash
          .substring(1)
          .split('&')
          .map((param) => param.split('='))
      );
      const athletes = urlHashParams.get('a');
      const variables = urlHashParams.get('v');
      const outputType = urlHashParams.get('t');

      if (athletes && variables) {
        $("select[name='athletes[]']").val(athletes.split(','));
        $('#athletes').trigger('chosen:updated');

        $("select[name='variables[]']").val(variables.split(','));
        $('#variables').trigger('chosen:updated');

        if (outputType && outputType === 'graph') {
          $('input#output_type_graph').prop('checked', true);
        }

        $('#submitAnalysis').trigger('click');
      }
    }
  });
};
