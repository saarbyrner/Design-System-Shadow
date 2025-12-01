import 'bootstrap-select';
import initDatepickerWithLocale from './init_datepicker_with_locale';

export default () => {
  //------------------------------------------------------------------------
  // /app/views/athletes/issues/_issues.js.erb
  const selectFields = $(
    'button[data-id="inputPathology"], button[data-id="inputSide"], button[data-id="inputClassification"], button[data-id="inputBodyArea"], button[data-id="inputPathologyGrade"]'
  );

  // toggles the visibility of the game selector or training session selector
  // based on the activty (eventType) selected
  const toggleGameTrainingSelector = (eventType) => {
    const $gameSelector = $('.js-gameSelector');
    const $trainingSessionSelector = $('.js-trainingSessionSelector');
    if (eventType === 'game') {
      $gameSelector.show();
      $trainingSessionSelector.hide();
    } else if (eventType === 'training') {
      $trainingSessionSelector.show();
      $gameSelector.hide();
    } else {
      $trainingSessionSelector.hide();
      $gameSelector.hide();
    }
  };

  const toggleMinutes = (visible) => {
    if (visible) {
      $('#occurrenceMins').show();
    } else {
      $('#occurrenceMins').hide();
    }
  };

  const removeSelectErrorClsOnChange = () => {
    // eslint-disable-next-line func-names
    $('select').on('change', function () {
      const $selectWrapper = $(this).parent().parent();
      if ($selectWrapper.hasClass('error')) {
        $selectWrapper.removeClass('error');
        $selectWrapper.addClass('success');
      }
    });
  };

  const inputOccurrenceOnChange = () => {
    // eslint-disable-next-line func-names
    $(document).on('change', '#inputOccurrence', function () {
      const eventType = $(this)
        .find('option:selected')
        .parent()
        .attr('data-event-type');
      const minutesVisible = $(this)
        .find('option:selected')
        .parent()
        .attr('data-meta');
      toggleGameTrainingSelector(eventType);
      toggleMinutes(minutesVisible);
    });
  };

  const injuryFormDropdowns = () => {
    removeSelectErrorClsOnChange();
    inputOccurrenceOnChange();
  };

  const resetInjuryForm = () => {
    $('#inputSide, #inputOccurrence').selectpicker('val', 0);
    $('#inputBodyAreaDetails, #inputOccurrenceDetails').hide().html('');
    $('#inputPathologyGrade, #occurrenceMins').hide();
    $('#occurrenceMins input').attr('value', '');
    $('textarea[name="injury_note"]').attr('value', '');

    selectFields.removeAttr('disabled');

    injuryFormDropdowns();
    return false;
  };

  const resetIllnessForm = () => {
    $('input[name="illness_type_id"]').removeAttr('checked');
    $('input[type="submit"]').removeClass('disabled');
    return false;
  };

  const inputPathologyOnChange = (osicsInfoAthleteIssuesPath) => {
    // eslint-disable-next-line func-names
    $('#inputPathology').on('change', function () {
      if ($(this).val()) {
        const url = `${osicsInfoAthleteIssuesPath}/?id=${$(this).val()}`;
        $('div.osics-code').hide();
        $.get(url, (osicsData) => {
          if (osicsData) {
            $('div.osics-code').removeClass('hide');
            $('div.osics-code span').html(osicsData.id);
            $('div.osics-code input').attr('value', osicsData.id);
            $('div.osics-code').fadeIn(300);
            $('#inputClassification').selectpicker(
              'val',
              osicsData.osics_classification_id
            );
            $('#inputBodyArea').selectpicker(
              'val',
              osicsData.osics_body_area_id
            );
          }
        });
      }
    });
  };

  const populateInjuryForm = (data) => {
    resetInjuryForm();

    selectFields.addClass('disabled');

    $('select#inputSide').selectpicker('val', data.side_id);
    $('select#inputClassification').selectpicker(
      'val',
      data.osics_classification_id
    );
    $('select#inputBodyArea').selectpicker('val', data.osics_body_area_id);
    $('select#inputPathology').selectpicker('val', data.osics_pathology_id);

    $('input[name="injury_form[existing_injury]"]').attr('value', data.id);
    $('input[name="injury_form[existing_injury]"]').removeAttr('disabled');
  };

  const inputIssueOnChange = (injuryAthleteIssuesPath) => {
    // eslint-disable-next-line func-names
    $('#inputIssue').on('change', function () {
      const existingInjury = $(this).val() > 0;
      const $bottomHalfIllness = $('#bottom_half_illness');
      const $bottomHalfIllnessCont = $('#bottom_half_illness_container');
      const $bottomHalfInjury = $('#bottom_half_injury');
      const $bottomHalfInjuryCont = $('#bottom_half_injury_container');

      if ($(this).val() === 'type_illness') {
        resetIllnessForm();
        $bottomHalfIllness.show();
        $bottomHalfIllnessCont.show();
        $bottomHalfInjury.hide();
        $bottomHalfInjuryCont.hide();
      } else if ($(this).val() === 'type_injury' || existingInjury === true) {
        $bottomHalfIllness.hide();
        $bottomHalfIllnessCont.hide();
        $bottomHalfInjury.show();
        $bottomHalfInjuryCont.show();

        injuryFormDropdowns();

        if (existingInjury === true) {
          $.getJSON(
            `${injuryAthleteIssuesPath}/?injury_id=${$(this).val()}`,
            (data) => {
              populateInjuryForm(data);
            }
          );
        } else {
          resetInjuryForm();
          $('input[name="injury_form[existing_injury]"]').attr('value', null);
          $('input[name="injury_form[existing_injury]"]').attr(
            'disabled',
            'disabled'
          );

          selectFields.removeClass('disabled');

          const hiddenSelectFields = $(
            'select#inputPathology, select#inputSide, select#inputClassification, select#inputBodyArea, select#inputPathologyGrade'
          );
          hiddenSelectFields.selectpicker('val', 0);
        }
      }
    });
  };

  const submitManyIssuesOnClick = () => {
    $('#submit-many-issues').on('click', () => {
      const $addAnotherInjury = $(
        'input[name="injury_form[add_another_injury]"]'
      );
      $addAnotherInjury.removeAttr('disabled');
      $addAnotherInjury.attr('value', true);
    });
  };

  $(document).ready(() => {
    $('#km-modal').on('show.bs.modal', () => {
      const issuesModalRootElement = document.getElementById(
        'issues_modal_container'
      );
      if (issuesModalRootElement) {
        const injuryAthleteIssuesPath =
          issuesModalRootElement.dataset.injuryAthleteIssuesPath;
        const osicsInfoAthleteIssuesPath =
          issuesModalRootElement.dataset.osicsInfoAthleteIssuesPath;

        // based on what type of activity is selected,
        // hide / show the game or training session selector
        const initForm = () => {
          $('.selectpicker').selectpicker();

          toggleMinutes(false);

          injuryFormDropdowns();

          inputPathologyOnChange(osicsInfoAthleteIssuesPath);

          inputIssueOnChange(injuryAthleteIssuesPath);

          initDatepickerWithLocale($('.date'));

          submitManyIssuesOnClick();

          $('#new_injury_form').on(
            'ajax:success',
            (event, data, success, xhr) => {
              const redirectTo = xhr.getResponseHeader('Location');
              if (redirectTo) {
                $('#ajax-modal').hide();
                location.href = redirectTo; // eslint-disable-line no-restricted-globals
              } else {
                $('#issues_modal_container').html(data).fadeTo(400, 1.0);

                $('#bottom_half_illness').hide();
                $('#bottom_half_illness_container').hide();

                $('#bottom_half_injury').show();
                $('#bottom_half_injury_container').show();

                if ($('input[name="injury_form[existing_injury]"]').val() > 0) {
                  selectFields.addClass('disabled');
                }
                initForm();
              }
            }
          );

          $('#new_illness_form').on(
            'ajax:success',
            (event, data, success, xhr) => {
              const redirectTo = xhr.getResponseHeader('Location');
              if (redirectTo) {
                $('#ajax-modal').hide();
                location.href = redirectTo; // eslint-disable-line no-restricted-globals
              } else {
                $('#issues_modal_container').html(data).fadeTo(400, 1.0);

                $('#bottom_half_illness').show();
                $('#bottom_half_illness_container').show();

                $('#bottom_half_injury').hide();
                $('#bottom_half_injury_container').hide();
                initForm();
              }
            }
          );

          if ($('#inputIssue').val() === '') {
            $('#inputIssue')
              .find('option:eq(1)')
              .prop('selected', true)
              .trigger('change');
          }
        };

        initForm();
      }

      // JS for the edit injury occurrence modal
      const editInjuryOccurenceModal = document.getElementById(
        'edit_injury_modal_container'
      );

      if (editInjuryOccurenceModal) {
        const initForm = () => {
          // show either game or training session select based on the injury activity
          const eventTypeOnInit = $('#inputEditOccurrence')
            .find('option:selected')
            .parent()
            .attr('data-event-type');
          toggleGameTrainingSelector(eventTypeOnInit);

          // bind change event for selecting the activity
          // eslint-disable-next-line func-names
          $(document).on('change', '#inputEditOccurrence', function () {
            const eventType = $(this)
              .find('option:selected')
              .parent()
              .attr('data-event-type');
            const minutesVisible = $(this)
              .find('option:selected')
              .parent()
              .attr('data-meta');
            toggleGameTrainingSelector(eventType);
            toggleMinutes(minutesVisible);
          });
        };

        initForm();
      }
    });
  });
};
