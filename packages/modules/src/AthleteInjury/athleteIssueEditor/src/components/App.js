// @flow
import { TrackEvent } from '@kitman/common/src/utils';
import ReactDOM from 'react-dom';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import $ from 'jquery';
import type { DropdownItem } from '@kitman/components/src/types';
import {
  Checkbox,
  DatePicker,
  Dropdown,
  FormValidator,
  LegacyModal as Modal,
  Textarea,
  TextButton,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AppStatus from '../containers/AppStatus';
import IssueDetails from '../containers/IssueDetails';
import InjuryOccurrence from '../containers/InjuryOccurrence';
import AthleteAvailabilityHistory from '../containers/AthleteAvailabilityHistory';
import Notes from '../containers/Notes';

import type { IssueStatusEvent } from '../../../types/_common';

type Props = {
  athleteName: string,
  eventsOrder: Array<string>,
  events: { string: IssueStatusEvent },
  info: string,
  recurrenceId: number,
  examinationDate?: ?string,
  occurrenceDate?: ?string,
  hasRecurrence: boolean,
  isFirstOccurrence: boolean,
  updateInfo: Function,
  createIssue: Function,
  editIssue: Function,
  formMode: 'EDIT' | 'CREATE',
  formType: 'INJURY' | 'ILLNESS',
  priorInjuryOptions: Array<DropdownItem>,
  priorIllnessOptions: Array<DropdownItem>,
  updateFormType: Function,
  updateHasRecurrence: Function,
  updateRecurrence: Function,
  updateExaminationDate: Function,
};

const App = (props: I18nProps<Props>) => {
  const formTypeOptions = [
    { title: props.t('Injury'), id: 'INJURY' },
    { title: props.t('Illness'), id: 'ILLNESS' },
  ];

  const onSaveForm = () => {
    if (props.formMode === 'EDIT') {
      props.editIssue();
    } else {
      props.createIssue();
    }
  };

  const closeModal = () => {
    TrackEvent('emr close modal', 'click', 'action close modal');

    // To be able to close the modal from outside the React app
    // while keeping it self-contained, unmount it
    ReactDOM.unmountComponentAtNode(
      document.getElementById('athleteIssueEditorContainer')
    );
    document.removeEventListener('keydown', escClose, false); // eslint-disable-line no-use-before-define
  };

  const escClose = (event: any) => {
    if (event.keyCode === 27) {
      closeModal();
    }
  };
  // because we are mounting the component when the modal "opens",
  // we can't rely on shouldCloseOnEsc prop of the react-modal
  document.addEventListener('keydown', escClose, false);

  const getPrevInjuryStatusId = (currentInjuryStatusEventId: string) => {
    const currentInjuryStatusEventIndex = props.eventsOrder.indexOf(
      currentInjuryStatusEventId
    );
    const prevInjuryStatusEventId =
      props.eventsOrder[currentInjuryStatusEventIndex - 1];
    // injury_status_id should be stringified
    // in order to compare it safely to the previous input value.
    return prevInjuryStatusEventId
      ? props.events[prevInjuryStatusEventId].injury_status_id.toString()
      : null;
  };

  const getPrevInjuryStatusEventDate = (currentInjuryStatusEventId: string) => {
    const currentInjuryStatusEventIndex = props.eventsOrder.indexOf(
      currentInjuryStatusEventId
    );
    const prevInjuryStatusEventId =
      props.eventsOrder[currentInjuryStatusEventIndex - 1];
    return prevInjuryStatusEventId
      ? props.events[prevInjuryStatusEventId].date
      : null;
  };

  const getCurrentInjuryStatusEventId = (input: Object, className: string) =>
    input.closest(`.${className}`)[0].dataset.injurystatuseventid;

  const validateInjuryStatus = (
    input: Object,
    isFirstInjuryStatusEvent: boolean
  ) => {
    if (isFirstInjuryStatusEvent) {
      // The first injury status is always valid
      return true;
    }

    const $currentInput = input[0];
    const currentInjuryStatusId = $currentInput.value;

    // Injury status name is valid if it is not the same as the preceding injury status name
    return (
      getPrevInjuryStatusId(
        getCurrentInjuryStatusEventId(input, 'js-issueStatusSelect')
      ) !== currentInjuryStatusId
    );
  };

  const validateInjuryStatusEventDate = (input: Object) => {
    const currentInjuryStatusEventId = getCurrentInjuryStatusEventId(
      input,
      'js-injuryStatusEventDate'
    );

    // The first date should always be valid
    if (props.eventsOrder.indexOf(currentInjuryStatusEventId) === 0) {
      return true;
    }

    const currentInjuryStatusEventDate =
      props.events[currentInjuryStatusEventId].date;
    const prevInjuryStatusEventDate = getPrevInjuryStatusEventDate(
      currentInjuryStatusEventId
    );

    const currentDateObj = moment(
      currentInjuryStatusEventDate,
      DateFormatter.dateTransferFormat
    );
    const prevDateObj = moment(
      prevInjuryStatusEventDate,
      DateFormatter.dateTransferFormat
    );

    // Date is valid if it is the same as or greater than the previous
    return moment(currentDateObj).isSameOrAfter(prevDateObj, 'day');
  };

  const validateAvailabilityHistory = (input: Object) => {
    const $currentInput = input[0];
    const isInputEnabled = !input.parent().hasClass('customDropdown--disabled');

    // only run the check if this is an injury status select and it is not saved yet
    if (
      $currentInput.name === 'athleteAvailabilityHistory_event_status' &&
      isInputEnabled
    ) {
      const isFirstInjuryStatusEvent =
        $('input[name=athleteAvailabilityHistory_event_status]')[0] ===
        $currentInput;
      return validateInjuryStatus(input, isFirstInjuryStatusEvent);
    }

    // only run the check if this is an injury datepicker and it is not saved yet
    if (
      $currentInput.name === 'athleteAvailabilityHistory_event_date' &&
      isInputEnabled
    ) {
      return validateInjuryStatusEventDate(input);
    }

    return true;
  };

  const validateExaminationDate = () => {
    if (!props.occurrenceDate || !props.examinationDate) {
      return true;
    }

    // Examination date is valid if it is the same as or greater than occurrence date
    return moment(props.examinationDate).isSameOrAfter(
      // $FlowFixMe At this point, we are sure occurrenceDate exists
      props.occurrenceDate,
      'day'
    );
  };

  const getIssueTypeSection = () => {
    const priorIssueLabel =
      props.formType === 'INJURY'
        ? props.t('Prior Injury (Date of Injury - Resolved Date)')
        : props.t('Prior Illness (Date of Illness - Resolved Date)');
    const priorIssueList =
      props.formType === 'INJURY'
        ? props.priorInjuryOptions
        : props.priorIllnessOptions;

    return props.formMode === 'CREATE' ? (
      <>
        <div className="row">
          <div className="col-lg-4">
            <Dropdown
              label={props.t('Issue')}
              items={formTypeOptions}
              value={props.formType}
              onChange={(value) => props.updateFormType(value)}
            />
          </div>
          <div className="col-lg-2 athleteIssueEditor__hasRecurrenceField">
            <Checkbox
              label={props.t('Recurrence')}
              id="isIssueRecurrenceField"
              isChecked={props.hasRecurrence}
              toggle={(checkbox) => props.updateHasRecurrence(checkbox.checked)}
              isLabelPositionedOnTheLeft
              name="athleteIssueEditor__hasRecurrenceField"
              isDisabled={priorIssueList.length === 0}
            />
          </div>
        </div>
        {props.hasRecurrence ? (
          <div className="row athleteIssueEditor__row">
            <div className="col-lg-11">
              <Dropdown
                label={priorIssueLabel}
                items={priorIssueList}
                value={props.recurrenceId}
                onChange={(value) => props.updateRecurrence(value)}
              />
            </div>
          </div>
        ) : null}
      </>
    ) : null;
  };

  const getExaminationDateField = () => (
    <div className="row athleteIssueEditor__row js-validationSection formValidator__section">
      <div className="col-lg-4">
        <DatePicker
          label={props.t('Examination Date')}
          onDateChange={(examinationDate) => {
            props.updateExaminationDate(examinationDate);
          }}
          name="ExaminationDate"
          value={props.examinationDate || null}
          disableFutureDates
        />
        <span className="formValidator__errorMsg">
          {props.formType === 'INJURY'
            ? props.t('This cannot be before the date of injury')
            : props.t('This cannot be before the date of illness')}
        </span>
      </div>
    </div>
  );

  const renderRecurrenceTitle = () => {
    // the parent issue has at least 1 recurrence and the viewed issue is the first occurrence
    if (props.hasRecurrence && props.isFirstOccurrence) {
      return props.formType === 'INJURY'
        ? props.t('Edit Issue (This injury has a Recurrence)')
        : props.t('Edit Issue (This illness has a Recurrence)');
    }
    // the parent issue has at least 1 recurrence and the viewed issue is NOT the first occurrence
    if (props.hasRecurrence) {
      return props.t('Edit Issue (Recurrence)');
    }
    // the parent issue has only 1 occurrence
    return props.t('Edit Issue');
  };

  const getModalSubtitle = () => {
    if (props.formMode === 'CREATE') {
      return props.t('New Issue');
    }

    return renderRecurrenceTitle();
  };

  const getNonValidatedInputs = () => {
    const inputNames = [
      'athleteIssueEditor_time_input',
      'athleteIssueEditor__hasRecurrenceField',
      'athleteIssueEditor__sessionCompletedField',
      'athleteIssueEditor_bamic_grade',
      'athleteIssueEditor_bamic_site',
      'injuryNotes__checkbox',
      'showSupplementaryPathology',
    ];
    // if the issue is a recurrence, we don't validate on the disabled onset field
    if (props.hasRecurrence) {
      inputNames.push('athleteIssueEditor_onset_input');
    }
    return inputNames;
  };

  return (
    <div>
      <Modal isOpen width={1024} close={closeModal}>
        <div className="row-fluid athleteIssueEditor">
          <FormValidator
            successAction={() => onSaveForm()}
            inputNamesToIgnore={getNonValidatedInputs()}
            customValidation={(input) => {
              if (input.attr('name') === 'ExaminationDate') {
                return validateExaminationDate();
              }

              return validateAvailabilityHistory(input);
            }}
          >
            <div className="athleteIssueEditor__title">
              {props.athleteName}
              <span>
                &nbsp;
                {getModalSubtitle()}
              </span>
            </div>

            <div className="athleteIssueEditor__formSection">
              {getIssueTypeSection()}
              {window.featureFlags['examination-date'] &&
                getExaminationDateField()}
            </div>
            <div className="athleteIssueEditor__formSection">
              <IssueDetails />
            </div>
            <div className="athleteIssueEditor__formSection">
              <InjuryOccurrence />
            </div>
            <div className="athleteIssueEditor__formSection">
              <div className="athleteIssueEditor__row">
                <AthleteAvailabilityHistory />
              </div>
            </div>
            <div className="athleteIssueEditor__formSection">
              <div className="athleteIssueEditor__row">
                <Notes />
              </div>
            </div>
            <div className="athleteIssueEditor__formSection athleteIssueEditor__formSection--last">
              <div className="athleteIssueEditor__row js-validationSection">
                <span className="athleteIssueEditor__infoText">
                  {props.t('(Maximum 1023 characters)')}
                </span>
                <Textarea
                  label={props.t('Modifications/Info')}
                  value={props.info}
                  onChange={(info) => props.updateInfo(info)}
                  maxLimit={1023}
                  name="athleteModificationInfo_textarea"
                />
                <span className="formValidator__errorMsg">
                  {props.t('Character limit exceeded')}
                </span>
              </div>
            </div>
            <div className="km-datagrid-modalFooter athleteIssueEditor__footer">
              <TextButton
                text={props.t('Save')}
                type="primary"
                onClick={() => {}}
              />
            </div>
          </FormValidator>
          <AppStatus />
        </div>
      </Modal>
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
