/* eslint-disable func-names */
import { colors } from '@kitman/common/src/variables';

//------------------------------------------------------------------------
// /app/views/workloads/plans/_plans_js.html.erb

const workloadPlans = () => {
  $(document).ready(() => {
    if ($('#workloads_plans').length > 0) {
      // Render the 'add' form inline
      $('button[rel="add"]').on('click', function (e) {
        e.preventDefault();
        // show input form...
        window.$table = $(this).closest('table');
        window.$table.find('tr.create_mode').removeClass('d-none');

        // reset all form values...
        window.$table
          .find('tr.create_mode input, tr.create_mode select')
          .each(function () {
            $(this).val('');
          });

        // high-light add row
        window.$table.find('tr.create_mode .success').removeClass('success');
        window.$table
          .find('tr.create_mode td')
          .css({ 'background-color': '' })
          .animate({ backgroundColor: colors.s14 }, 1000);
        return false;
      });

      $('.js_new_prediction').on('ajax:success', (event, data) => {
        if (data.success === true) {
          window.location.reload();
        } else {
          const form = $(event.target);
          form.find('.km-error').each(function () {
            $(this).removeClass('km-error');
          });
          if (data.errors) {
            Object.keys(data.errors).forEach((field) => {
              if (field === 'session_type_id') {
                form.find(`#prediction_${field}`).parent().addClass('km-error');
              } else {
                form.find(`#prediction_${field}`).addClass('km-error');
              }
            });
          }
        }
      });

      $('.js_destroy_prediction').on('ajax:success', () => {
        window.location.reload();
      });

      // calculate workload totals
      const calculateWorkloadTotals = () => {
        window.$tables = $('.km-page-content')
          .find('table')
          .each(function () {
            let total = 0;

            $(this)
              .find('.display_workload:visible')
              .each(function () {
                if ($(this).html() > 0) {
                  total += parseInt($(this).html(), 10);
                }
              });

            if (total > 0) {
              $(this).find('.js_workload_total').html(total);
            }
          });
      };

      // Calculate workload - display only
      $('input[rel="rpe"], input[rel="duration"]').on('keyup', function () {
        window.$container = $(this).closest('tr');
        const rpe = window.$container.find('input[rel="rpe"]').val();
        const duration = window.$container.find('input[rel="duration"]').val();
        const workload = rpe * duration;

        if (workload > 0) {
          window.$container.find('.display_workload').html(workload);
        }
        calculateWorkloadTotals();
      });

      // calculate workload totals (init)
      calculateWorkloadTotals();
    }
  });
};

export default workloadPlans;
