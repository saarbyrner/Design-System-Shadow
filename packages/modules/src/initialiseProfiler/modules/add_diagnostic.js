import { trackIntercomEvent } from '@kitman/common/src/utils';
import 'bootstrap-select';
import qq from 'fine-uploader';
import initDatepickerWithLocale from './init_datepicker_with_locale';

export default () => {
  const initForm = () => {
    const newDiagnosticForm = document.getElementById('new_diagnostic');
    const diagnosticType = JSON.parse(
      newDiagnosticForm.dataset.diagnostictypes
    );
    const endpoint = newDiagnosticForm.dataset.endpoint;
    const isDebug = newDiagnosticForm.dataset.debug;
    const annotationDiagnosticTypes = [
      JSON.stringify(diagnosticType.blood_tests),
      JSON.stringify(diagnosticType.cardiac_data),
      JSON.stringify(diagnosticType.concussion),
    ];

    const $date = $('.date');
    const $diagnosticTypeId = $('#diagnostic_diagnostic_type_id');
    const $form = $(newDiagnosticForm);

    initDatepickerWithLocale($date);
    $date.on('keydown', () => false);

    $diagnosticTypeId.on('change', () => {
      if (
        $diagnosticTypeId.val() === JSON.stringify(diagnosticType.medication)
      ) {
        $('#medical_controls').show();
        $('#covid_controls').hide();
        $('#covid_antibody_controls').hide();
        $('#annotation_controls').hide();
      } else if (
        window.featureFlags['covid-19-medical-diagnostic'] &&
        $diagnosticTypeId.val() === JSON.stringify(diagnosticType.covid_19_test)
      ) {
        $('#covid_controls').show();
        $('#medical_controls').hide();
        $('#covid_antibody_controls').hide();
        $('#annotation_controls').hide();
      } else if (
        window.featureFlags['covid-19-medical-diagnostic'] &&
        $diagnosticTypeId.val() ===
          JSON.stringify(diagnosticType.covid_19_antibody_test)
      ) {
        $('#covid_antibody_controls').show();
        $('#covid_controls').hide();
        $('#medical_controls').hide();
        $('#annotation_controls').hide();
      } else if (annotationDiagnosticTypes.includes($diagnosticTypeId.val())) {
        $('#annotation_controls').show();
        $('#medical_controls').hide();
        $('#covid_controls').hide();
        $('#covid_antibody_controls').hide();
      } else {
        $('#medical_controls').hide();
        $('#covid_controls').hide();
        $('#covid_antibody_controls').hide();
        $('#annotation_controls').hide();
      }
    });

    if ($diagnosticTypeId.val() !== '') {
      $diagnosticTypeId.trigger('change');
    }

    // show/hide the course complete datepicker
    const $completeDateContainer = $(
      '.addDiagnosticsModal__completeDateContainer'
    );
    if ($completeDateContainer.length > 0) {
      $('#medication_complete_check').on('change', () => {
        $completeDateContainer.toggleClass('d-none');
      });
    }

    $('#submit-many-diagnostics').on('click', () => {
      const $addAnotherDiagnostic = $('input[name="add_another_diagnostic"]');
      $addAnotherDiagnostic.removeAttr('disabled');
      $addAnotherDiagnostic.attr('value', true);
    });

    // Validation

    // Remove error style from input on interaction
    $form.find('.input-group.date .km-input-control').on(
      'change',
      // eslint-disable-next-line func-names
      function () {
        $(this).removeClass('km-error');
        $(this).closest('.km-error-msg').hide();
      }
    );
    // eslint-disable-next-line func-names
    $form.find('.km-input-control').on('keyup', function () {
      $(this).removeClass('km-error');
      $(this).closest('.km-error-msg').hide();
    });
    $form.find("select[name='diagnostic[covid_result]']").on(
      'changed.bs.select',
      // eslint-disable-next-line func-names
      function () {
        $(this).closest('.bootstrap-select').removeClass('km-error');
      }
    );
    $form.find("select[name='diagnostic[covid_antibody_result]']").on(
      'changed.bs.select',
      // eslint-disable-next-line func-names
      function () {
        $(this).closest('.bootstrap-select').removeClass('km-error');
      }
    );

    $form.on('ajax:beforeSend', () => {
      const $errorMsg = $('.km-error-msg');
      const $medicationDateField = $('.addDiagnosticsModal__createDateField');
      const $completeDateField = $('.addDiagnosticsModal__completeDateField');
      const medicationDate = $medicationDateField.val();
      const completeDate = $completeDateField.val();
      const $covidResultField = $("select[name='diagnostic[covid_result]']");
      const $covidAntibodyResultField = $(
        "select[name='diagnostic[covid_antibody_result]']"
      );

      let isFormValid = true;

      // compulsory fields need to be filled
      // eslint-disable-next-line func-names
      $form.find('.km-input-control').each(function () {
        if (
          !$(this).val() &&
          !$(this).hasClass('ignoreValidation') &&
          !$(this).is(':hidden')
        ) {
          $(this).addClass('km-error');
          $(this).closest('.km-error-msg').show();
          isFormValid = false;
        }
      });

      // course complete date cannot be set sooner than the creation date
      if (
        moment(medicationDate).isAfter(completeDate) &&
        $('#medication_complete_check').is(':checked')
      ) {
        $medicationDateField.addClass('km-error');
        $completeDateField.addClass('km-error');
        $errorMsg.show();
        isFormValid = false;
      }

      if (
        $covidAntibodyResultField.is(':visible') &&
        !$covidAntibodyResultField.val()
      ) {
        $covidAntibodyResultField
          .closest('.bootstrap-select')
          .addClass('km-error');
        isFormValid = false;
      }
      if ($covidResultField.is(':visible') && !$covidResultField.val()) {
        $covidResultField.closest('.bootstrap-select').addClass('km-error');
        isFormValid = false;
      }

      return isFormValid;
    });

    $form.on('ajax:success', (event, data, success, xhr) => {
      const redirectTo = xhr.getResponseHeader('Location');
      if (redirectTo) {
        $('#km-modal').hide();
        trackIntercomEvent('add-athlete-diagnostic');
        location.href = redirectTo; // eslint-disable-line no-restricted-globals
      } else {
        $($('#km-modal').find('.modal-content')[0]).html(data).fadeTo(400, 1.0);
        $('.selectpicker').selectpicker();
        initForm();
      }
    });

    // eslint-disable-next-line no-unused-vars
    const uploader = new qq.FineUploader({
      element: document.getElementById('bootstrapped-fine-uploader'),
      request: {
        endpoint,
        params: {
          authenticity_token: $('meta[name=csrf-token]').attr('content'),
        },
        inputName: 'attachment',
      },
      validation: {
        allowedExtensions: [
          'pdf',
          'jpeg',
          'jpg',
          'png',
          'doc',
          'docx',
          'xlsx',
          'xls',
          'ppt',
          'pptx',
          'txt',
          'rtf',
          'csv',
          'mp4',
          'mp3',
        ],
        sizeLimit: 99999999,
        itemLimit: 3,
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
      debug: isDebug,
      callbacks: {
        onComplete: (id, fileName, responseJSON) => {
          if (responseJSON.success) {
            const attachmentId = responseJSON.attachment_id;
            $('<input>')
              .attr('type', 'hidden')
              .attr('name', 'diagnostic[attachment_ids][]')
              .attr('value', attachmentId)
              .prependTo($form);
          }
        },
      },
    });
  };

  $(document).ready(() => {
    $('#km-modal').on('shown.bs.modal', () => {
      if ($('#new_diagnostic').length > 0) {
        initForm();
      }
    });
  });
};
