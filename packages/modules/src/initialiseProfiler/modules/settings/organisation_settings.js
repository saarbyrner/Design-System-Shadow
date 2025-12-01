import 'bootstrap-select';

// /app/views/settings/organisations/_edit_organisation.js.erb
export default () => {
  $(document).ready(() => {
    if (document.getElementById('metric-settings-form')) {
      const primarySelect = $('select[name="primary_workload"]');
      const secondarySelect = $('select[name="secondary_workload"]');

      const setDisabledItems = () => {
        // We have a case where the secondary var is chosen, the primary var
        // can then be changed to the same as the secondary var. This if statement checks
        // for that and resets the secondary selection.
        if (secondarySelect.val() === primarySelect.val()) {
          secondarySelect.find('option').removeAttr('disabled');
          secondarySelect.selectpicker('val', '');
        }

        secondarySelect.find('option').removeAttr('disabled');
        secondarySelect
          .find($(`option[value="${primarySelect.val()}"]`))
          .attr('disabled', 'disabled');

        primarySelect.selectpicker('render');
        secondarySelect.selectpicker('render');
      };

      // Disable the primary selected option from the secondary select on page load.
      secondarySelect
        .find($(`option[value="${primarySelect.val()}"]`))
        .attr('disabled', 'disabled');

      primarySelect.on('changed.bs.select', () => {
        setDisabledItems();
      });

      // Reset form value
      $('.km-default-reset').on('click', (e) => {
        $('[data-km-default]').each((i, element) => {
          const wrapped = $(element);
          wrapped.val(wrapped.data('km-default'));
          if (wrapped.hasClass('selectpicker')) {
            wrapped.selectpicker('render');
          }
        });
        $('.km-form-footer button:disabled').each((index, element) => {
          $(element).prop('disabled', false);
        });
        setDisabledItems();
        e.preventDefault();
        return false;
      });
    }
  });
};
