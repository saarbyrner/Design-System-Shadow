import $ from 'jquery';
import 'chosen-js';
import qq from 'fine-uploader';
import moment from 'moment';
import initDatepickerWithLocale from '../init_datepicker_with_locale';

// /app/views/settings/athletes/_athlete_settings_js.html.erb
function squad() {
  const $chosenSelect = $('.chzn-select').chosen();
  const $primarySquad = $('select.primary-squad');

  if ($primarySquad.length) {
    const options = [];
    // eslint-disable-next-line func-names
    $chosenSelect.children('option').each(function () {
      options.push({ name: $(this).text(), id: $(this).val() });
    });

    $chosenSelect.change(() => {
      const selectedOptions = [$primarySquad.data('none_option')];
      const values = $chosenSelect.val();
      values.forEach((value) => {
        const option = options.find((op) => op.id === value);
        selectedOptions.push(option);
      });

      const value = $primarySquad.val();
      $primarySquad.empty();
      $.each(selectedOptions, (index, selectedOption) => {
        $primarySquad.append(
          $('<option></option>')
            .attr('value', selectedOption.id)
            .text(selectedOption.name)
            .attr('selected', value === selectedOption.id)
        );
      });
      $primarySquad.selectpicker('refresh');
    });
    $chosenSelect.change();
  }
}

function setupPhoneSelect() {
  const countryCodePicker = $('#user_mobile_number_country.selectpicker');

  if (countryCodePicker && countryCodePicker.length !== 0) {
    countryCodePicker.selectpicker('setStyle', 'km-input-control', 'add');

    document.getElementById('user_mobile_number_national_number').disabled =
      countryCodePicker.val() == null || countryCodePicker.val() === '';

    countryCodePicker.on('changed.bs.select', (event) => {
      document.getElementById('user_mobile_number_national_number').disabled =
        event.target.value === '';
    });
  }
}

function setupEdit() {
  if (
    document.getElementsByClassName('edit_athlete')[0] ||
    document.getElementsByClassName('new_athlete')[0]
  ) {
    const formDataset = (
      document.getElementsByClassName('edit_athlete')[0] ||
      document.getElementsByClassName('new_athlete')[0]
    ).dataset;
    const endpoint = formDataset.endpoint;
    const isDebug = formDataset.debug;

    const shouldFormatUS = moment.locale()?.toLowerCase() === 'en';
    const weekStart = shouldFormatUS ? 0 : 1; // 1 = Monday, 0 Sunday is start of week
    let datePickerFormatValue = 'dd/mm/yyyy'; // The value for DatePicker format prop
    if (window.featureFlags['date-picker-text-entry-athlete']) {
      datePickerFormatValue = shouldFormatUS ? 'mm/dd/yyyy' : 'dd/mm/yyyy';
    }

    initDatepickerWithLocale($('.date'), {
      format: datePickerFormatValue,
      weekStart,
      autoclose: true,
    });

    if (!window.featureFlags['date-picker-text-entry-athlete']) {
      $('.date').on('keydown', () => false);
    }

    squad();

    if (window.location.hash)
      $(`a[href="${window.location.hash}"]`).trigger('click');

    window.values = {};

    // eslint-disable-next-line no-unused-vars
    const uploader = new qq.FineUploader({
      element: document.getElementById('bootstrapped-fine-uploader'),
      request: {
        endpoint,
        params: {},
        inputName: 'athlete[avatar]',
      },
      validation: {
        allowedExtensions: ['jpeg', 'jpg', 'png'],
        sizeLimit: 99999999,
        itemLimit: 1,
      },
      failedUploadTextDisplay: {
        mode: 'custom',
        maxChars: 200,
        responseProperty: 'error',
        enableTooltip: true,
      },
      classes: {
        success: 'alert alert-success',
        fail: 'alert alert-error',
      },
      callbacks: {
        onComplete: (id, fileName, responseJSON) => {
          if (responseJSON.success) {
            $('img#avatar').attr('src', decodeURIComponent(responseJSON.uri));
            $('#athlete_avatar_attachment_id').attr(
              'value',
              responseJSON.attachment_id
            );
          }
        },
      },
      debug: isDebug,
      deleteFile: {
        enable: true,
      },
    });
  }
}

export default () => {
  $(document).ready(() => {
    setupEdit();
    setupPhoneSelect();
  });
};
