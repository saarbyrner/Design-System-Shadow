import 'bootstrap-select';
import qq from 'fine-uploader';
import i18n from '@kitman/common/src/utils/i18n';
import initDatepickerWithLocale from './init_datepicker_with_locale';

const initDefaultForm = () => {
  const $injuries = $('#injuries, .not_medical');
  const $illnesses = $('#illnesses, .not_medical');
  const $medical = $('.medical_input');
  $injuries.hide();
  $illnesses.hide();
  $medical.hide();
  $('.not_medical_history').hide();
  $('.not_medical').show().removeClass('d-none');
  $('.note_upload').hide();
};

const noteTypeChange = (noteTypeIds) => {
  $('#note_note_type').on('change', () => {
    const $injuries = $('#injuries, .not_medical');
    const $illnesses = $('#illnesses, .not_medical');
    const $medical = $('.medical_input');
    switch (parseInt($('#note_note_type').val(), 10)) {
      case noteTypeIds.injury:
        // Injury
        $illnesses.hide();
        $injuries.show().removeClass('d-none');
        $medical.hide();
        break;
      case noteTypeIds.illness:
        // Illness
        $injuries.hide();
        $illnesses.show().removeClass('d-none');
        $medical.hide();
        break;
      case noteTypeIds.medical:
        // Medical
        $injuries.show().removeClass('d-none');
        $illnesses.show().removeClass('d-none');
        $medical.show();
        break;
      default:
        // Null - Clear
        initDefaultForm();
        break;
    }
  });
};

const medicalTypeChange = (noteTypes) => {
  $('#note_medical_type').on('change', () => {
    const $injuries = $('#injuries, .not_medical');
    const $illnesses = $('#illnesses, .not_medical');
    const $inputNote = $('#inputNote');
    const $fileUploadCol = $('.file_upload_column');
    $injuries.show();
    $illnesses.show();
    switch ($('#note_medical_type').val()) {
      case noteTypes.allergy:
        $('.not_allergy').hide();
        $('.allergy').show();
        $inputNote.removeClass('large');
        $('.note_upload').hide();
        break;
      case noteTypes.therapeutic_use_exemption:
        $('.not_tue').hide();
        $('.tue').show();
        $inputNote.removeClass('large');
        break;
      case noteTypes.vaccination:
        $('.not_vaccination').hide();
        $('.vaccination').show();
        $inputNote.removeClass('large');
        $fileUploadCol.removeClass('no-left-margin');
        break;
      default:
        $('.not_medical_history').hide();
        $('.medical_history').show();
        $inputNote.addClass('large');
        $fileUploadCol.removeClass('no-left-margin');
        break;
    }
  });
};

const prepAllergy = (noteTypeIds, noteTypes) => {
  $('#note_note_type').val(noteTypeIds.medical);
  $('#note_medical_type').val(noteTypes.allergy);
  $('.medical_input').show();
  $('.not_allergy, .not_medical').hide();
  $('.allergy').show();
  $('.selectpicker').selectpicker('refresh');
};

const prepMedicalHistory = (noteTypeIds, noteTypes) => {
  $('#note_note_type').val(noteTypeIds.medical);
  $('#note_medical_type').val(noteTypes.communication);
  $('.medical_input').show();
  $('.not_medical_history, .not_medical').hide();
  $('.file_upload_column').addClass('no-left-margin');
  $('#inputNote').addClass('large');
  $('.medical_history').show();
  $('.selectpicker').selectpicker('refresh');
};

const prepTue = (noteTypeIds, noteTypes) => {
  $('#note_note_type').val(noteTypeIds.medical);
  $('#note_medical_type').val(noteTypes.therapeutic_use_exemption);
  $('.medical_input').show();
  $('.not_tue, .not_medical').hide();
  $('.tue').show();
  $('.selectpicker').selectpicker('refresh');
};

const prepVaccination = (noteTypeIds, noteTypes) => {
  $('#note_note_type').val(noteTypeIds.medical);
  $('#note_medical_type').val(noteTypes.vaccination);
  $('.medical_input').show();
  $('.not_vaccination, .not_medical').hide();
  $('.vaccination').show();
  $('.selectpicker').selectpicker('refresh');
};

const noteKeyup = () => {
  // Warn a user if they close the note view without saving
  $('#note_note').on('keyup', () => {
    $(window).on('beforeunload', () => i18n.t('You have unsaved changes'));
  });
};

export default () => {
  //------------------------------------------------------------------------
  // /app/views/athletes/medical_notes/new.html.erb

  $(document).ready(() => {
    // "shown" is used to make sure #new_note_container is already rendered
    $('#km-modal').on('shown.bs.modal', () => {
      const $date = $('.date');
      const $form = $('#new_note');

      initDefaultForm();

      if ($form.length > 0) {
        initDatepickerWithLocale($date, {
          autoclose: true,
        });
        $date.on('keydown', () => false);

        $form.on('ajax:beforeSend', () => {
          let isFormValid = true;
          const $submitBtn = $form.find('input[type=submit]');

          $form.find('.km-error').each(function () {
            $(this).removeClass('km-error');
          });

          // validate date
          $('.date:visible').each(function () {
            if ($(this).find('input').val() === '') {
              $(this).addClass('km-error');
              isFormValid = false;
              $submitBtn.attr('disabled', false);
            }
          });

          // validate select type
          $('#new_note div.km-search-select:visible').each(function () {
            if ($(this).find('select').val() === '') {
              $(this).addClass('km-error');
              isFormValid = false;
              $submitBtn.attr('disabled', false);
            }
          });

          // validate medical type
          if ($('.notesModal__medicalType:visible').length > 0) {
            $('.notesModal__medicalType:visible').each(function () {
              if ($(this).find('select').val() === '') {
                $(this).find('div.km-search-select').addClass('km-error');
                isFormValid = false;
                $submitBtn.attr('disabled', false);
              }
            });
          }

          // validate checkbox
          const checkbox = $(
            '.newNoteRelevantIssues input[type="checkbox"]:visible'
          );
          const noteType = $('select#note_note_type :selected').data('type');
          if (checkbox.length > 0 && noteType !== 'medical') {
            let isOneCheckboxChecked;
            for (let i = 0; i < checkbox.length; i++) {
              if ($(checkbox[i]).prop('checked') === true) {
                isOneCheckboxChecked = true;
                break;
              }
              /* eslint-enable max-depth */
            }
            if (!isOneCheckboxChecked) {
              $(checkbox).addClass('km-error');
              isFormValid = false;
              $submitBtn.attr('disabled', false);
            }
          }

          // validate textarea
          const $textarea = $('.newNoteNote textarea');
          if ($textarea.val().length === 0) {
            $textarea.addClass('km-error');
            isFormValid = false;
            $submitBtn.attr('disabled', false);
          }

          // validate note_medical_name
          const $noteMedicalName = $('#note_medical_name');
          if (
            $('#note_medical_name').is(':visible') &&
            $noteMedicalName.val().length === 0
          ) {
            $noteMedicalName.addClass('km-error');
            isFormValid = false;
            $submitBtn.attr('disabled', false);
          }

          return isFormValid;
        });

        $form.on('ajax:success', (event, data) => {
          if (window.location.pathname === '/athletes/availability') {
            window.location.reload();
          } else {
            window.location = data.location;
          }
        });

        $form.on('ajax:error', (event, data) => {
          // Error occured - re-enable the save button
          $('#new_note').find('input[type=submit]').attr('disabled', false);
          $('#new_note_container')
            .find('.km-error')
            .each(() => {
              $('#new_note_container').removeClass('km-error');
            });
          Object.keys(data.responseJSON).forEach((key) => {
            $(`#${key}`).find('input, textarea').addClass('km-error');
          });
        });

        noteKeyup();

        // Prevent multiple submittions by disabling button on form submission
        $('body').on('submit', '#new_note', () => {
          $('body').find('input[type=submit]').attr('disabled', true);
          $(window).off('beforeunload');
        });

        $('.modal').on('hidden.bs.modal', () => {
          $(window).off('beforeunload');
        });

        const newNoteForm = document.getElementById('new_note');
        const noteTypeIds = JSON.parse(newNoteForm.dataset.notetypeids);
        const noteTypes = JSON.parse(newNoteForm.dataset.notetypes);
        const endPoint = newNoteForm.dataset.endpoint;
        const isDebug = newNoteForm.dataset.debug;
        const url = newNoteForm.dataset.url;
        const noteMedicaltype = newNoteForm.dataset.notemedicaltype;

        noteTypeChange(noteTypeIds);
        medicalTypeChange(noteTypes);

        // eslint-disable-next-line no-unused-vars
        const uploader = new qq.FineUploader({
          element: document.getElementById('bootstrapped-fine-uploader'),
          request: {
            endpoint: endPoint,
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
                  .attr('name', 'note[attachment_ids][]')
                  .attr('value', attachmentId)
                  .prependTo('#new_note');
              }
            },
          },
        });

        $('.copy-last-note-button').on('click', () => {
          $.ajax({
            url,
            contentType: 'application/json',
            method: 'GET',
          }).then((data) => {
            if (data.note) {
              const inputBox = $('#note_note');
              let textToAdd = `\n[${i18n.t('Copied from note:')} ${
                data.note_date
              }]\n\n`;
              textToAdd += `${data.note}\n\n`;
              inputBox.val(inputBox.val() + textToAdd);
            } else {
              let errorBox =
                '<div class="alert alert-danger alert-dismissible" role="alert">';
              errorBox +=
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
              errorBox += '<span aria-hidden="true">&times;</span></button>';
              errorBox += `${data.error}</div>`;
              $('#error_container').append(errorBox);
            }
          });
        });

        switch (noteMedicaltype) {
          case 'tue':
            prepTue(noteTypeIds, noteTypes);
            break;
          case 'allergy':
            prepAllergy(noteTypeIds, noteTypes);
            break;
          case 'vaccination':
            prepVaccination(noteTypeIds, noteTypes);
            break;
          case 'medical_history':
            prepMedicalHistory(noteTypeIds, noteTypes);
            break;
          default:
            break;
        }
      }
    });
  });
};
