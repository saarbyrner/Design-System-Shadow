import { trackIntercomEvent } from '@kitman/common/src/utils';
import initScale from './scale_element';
import initColourPicker from './colour_picker';
import sliderTemplate from './slider_template.hbs';
import {
  isFormPartlyFilled,
  isFormFullyFilled,
  setSubmitBtnDisabled,
  clearErrorClsFromAllFields,
  showEmptyFieldProceedModal,
} from './form_helpers';
import { handleClientSideErrorOnForm, initForm } from './form_init';

export default () => {
  //
  // Submit form by pressing the submit button on modal
  //
  const submitFormCallback = function (formEl, e) {
    e.preventDefault();
    $(this).attr('disabled', 'disabled');
    formEl.submit();
    return false;
  };

  const onAthleteClick = () => {
    $('input[name="set_athlete"]').on('click', (e) => {
      e.preventDefault();
      const athleteId = $('select[name="select_athlete"]').val();
      location.href = `/questionnaires/new?athlete=${athleteId}`; // eslint-disable-line no-restricted-globals
    });
  };

  const initIndicationChooser = () => {
    const indicationEntries = [];
    const addIndication = (value, displayName) => {
      if (indicationEntries.indexOf(value) < 0) {
        indicationEntries.push(value);
        $('#indication_sliders').append(
          sliderTemplate({
            area: value,
            area_name: displayName,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          })
        );
        const newSlider = $('#indication_sliders .js-dynamic_slider:last');
        initScale($('.scaleField', newSlider));
      }
    };

    $('input:radio[name=indication]').on('click', function () {
      if ($(this).val() === 'yes') {
        $('#indication_entry').slideDown();
      } else {
        $('#indication_entry').hide();
      }
    });

    $(document).on(
      'click',
      '#indication_entry #indication_sliders .js-dynamic_slider a.js-remove_indication',
      function () {
        const el = $(this);
        const area = el.data('area');
        el.parent().parent().remove();
        indicationEntries.splice(indicationEntries.indexOf(area), 1);
        return false;
      }
    );
    $('#indication_entry map#indication_map area').on('click', (el) => {
      addIndication(
        $(el.currentTarget).data('area'),
        $(el.currentTarget).data('area-name')
      );
      return false;
    });
    $('#indication_entry select.indication_dropdown').on('change', (el) => {
      addIndication(el.currentTarget.selectedOptions[0].value);
      $('select.indication_dropdown').prop('selectedIndex', 0).blur();
    });
  };

  $(document).ready(() => {
    const questionnaireRootElement = document.getElementById('questionnaire');
    if (questionnaireRootElement) {
      const isAnAthlete = questionnaireRootElement.dataset.isAnAthlete;
      const isANewRecord = questionnaireRootElement.dataset.isANewRecord;

      $(() => {
        const fieldBlockSelectorCls = '.questionnaire__fieldBlock';
        const fieldSelectorCls = '.km-input-control';
        const fieldBlockErrorCls = 'questionnaire__fieldBlock--error';
        const fieldErrorCls = 'km-error';

        onAthleteClick();

        initColourPicker();

        initIndicationChooser();

        $(() => {
          const $form = $('#questionnaire_form');
          const $submitByPassBtn = $('#submit_bypass');
          let confirmedIncompleteSubmit = false;

          initForm(
            $form,
            fieldBlockSelectorCls,
            fieldSelectorCls,
            fieldBlockErrorCls
          );

          //
          // Empty Field Proceed modal save button click event handler
          //
          $submitByPassBtn.on('click', (e) => {
            confirmedIncompleteSubmit = true;
            submitFormCallback($form, e);
          });

          //
          // This runs when the Save button at the bottom is pressed (not the modal save!)
          //
          $form.on('ajax:beforeSend', () => {
            //
            // Set the save button disabled to prevent further interaction
            //
            setSubmitBtnDisabled($form);

            //
            // If the form is submitted anyway without all fields completed, proceed
            //
            if (confirmedIncompleteSubmit === true) {
              return true;
            }

            clearErrorClsFromAllFields(
              $form,
              fieldBlockSelectorCls,
              fieldSelectorCls,
              fieldBlockErrorCls,
              fieldErrorCls
            );

            //
            // If all fields are empty, don't proceed and return to the questionnaire
            //
            if (
              !isFormPartlyFilled(
                $form,
                fieldBlockSelectorCls,
                fieldSelectorCls,
                fieldBlockErrorCls,
                fieldErrorCls
              )
            ) {
              setSubmitBtnDisabled($form);
              return false;
            }

            //
            // If the form is completely filled, save it
            //
            if (isFormFullyFilled($form)) {
              return true;
            }

            //
            // If the user filled at least one input, trigger the empty field proceed modal
            // to validate if you want to save the form this way
            //
            showEmptyFieldProceedModal();
            return false;
          });

          //
          // This runs when the form submit has successfully returned with a response
          //
          $form.on('ajax:success', (event, data, success, xhr) => {
            if (data.success === true) {
              // add intercom event only for new questionnaires submitted by staff
              if (!isAnAthlete && isANewRecord) {
                trackIntercomEvent('add-questionnaire-on-behalf-of-player');
              }
              location.href = xhr.getResponseHeader('Location'); // eslint-disable-line no-restricted-globals
            } else {
              handleClientSideErrorOnForm(
                $form,
                data.errors,
                fieldBlockSelectorCls,
                fieldSelectorCls,
                fieldBlockErrorCls,
                fieldErrorCls
              );
            }
          });
        });
      });
    }
  });
};
