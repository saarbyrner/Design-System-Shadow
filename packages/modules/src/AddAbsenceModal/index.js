// @flow
import $ from 'jquery';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  AppStatus,
  DatePicker,
  Dialogue,
  Dropdown,
  FormValidator,
  LegacyModal as Modal,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Athlete, AbsenceData } from '../AthleteAvailabilityList/types';

type Props = {
  absenceData: AbsenceData,
  absenceReasons: Array<{ id: number, reason: string, order: number }>,
  athlete: ?Athlete,
  closeModal: Function,
  isOpen: boolean,
  updateAbsenceReasonType: Function,
  updateAbsenceFromDate: Function,
  updateAbsenceToDate: Function,
  saveAbsence: Function,
  feedbackModalStatus: ?string,
  feedbackModalMessage: ?string,
};

const AddAbsenceModal = (props: I18nProps<Props>) => {
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [selectedAbsenceReason, setSelectedAbsenceReason] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const getAbsenceReasons = props.absenceReasons.map((reason) => {
    return {
      id: reason.id,
      title: reason.reason,
    };
  });

  const onSave = () => {
    const $fromDate = $(
      '.athleteAvailabilityAddAbsenceModal__datePickers--from'
    )
      .find('input')
      .val();

    const $toDate = $('.athleteAvailabilityAddAbsenceModal__datePickers--to')
      .find('input')
      .val();

    if (Date.parse($fromDate) > Date.parse($toDate)) {
      $('.athleteAvailabilityAddAbsenceModal__dateConflictError').show();
      $('.athleteAvailabilityAddAbsenceModal__optionalText').hide();
    } else {
      $('.athleteAvailabilityAddAbsenceModal__dateConflictError').hide();
      $('.athleteAvailabilityAddAbsenceModal__optionalText').show();
      if (props.athlete) {
        props.saveAbsence(props.athlete.id, props.absenceData);
      }
    }
  };

  return (
    <>
      <Dialogue
        confirmAction={() => {
          setSelectedAbsenceReason('');
          setSelectedFromDate(null);
          setSelectedToDate(null);
          setHasChanges(false);
          setShowExitDialog(false);
          props.closeModal();
        }}
        visible={showExitDialog}
        message={props.t('Exit without saving?')}
        cancelAction={() => {
          setShowExitDialog(false);
        }}
        confirmButtonText={props.t('Exit')}
      />
      <Modal
        isOpen={props.isOpen}
        close={() => {
          if (hasChanges) {
            setShowExitDialog(true);
          } else {
            props.closeModal();
          }
        }}
      >
        <div className="athleteAvailabilityAddAbsenceModal">
          <h5 className="athleteAvailabilityAddAbsenceModal__title">
            {props.athlete
              ? `${props.athlete.firstname} ${props.athlete.lastname} `
              : null}
            <span className="km-light-text">{props.t('Add Absence')}</span>
          </h5>
          <FormValidator
            successAction={() => {
              onSave();
            }}
            inputNamesToIgnore={['availabilitylist_add_absence_to_date']}
          >
            <div className="athleteAvailabilityAddAbsenceModal__selectReason js-validationSection">
              <Dropdown
                label={props.t('Absence Reason')}
                name="availabilitylist_add_absence_reason"
                items={getAbsenceReasons}
                onChange={(value) => {
                  setHasChanges(true);
                  setSelectedAbsenceReason(value);
                  props.updateAbsenceReasonType(value);
                }}
                value={selectedAbsenceReason}
              />
              <span className="formValidator__errorMsg">
                {props.t('Absence Reason Required')}
              </span>
            </div>
            <div className="athleteAvailabilityAddAbsenceModal__datePickers">
              <div className="athleteAvailabilityAddAbsenceModal__datePickers--from js-validationSection">
                <DatePicker
                  label={props.t('Absent From')}
                  name="availabilitylist_add_absence_from_date"
                  value={selectedFromDate}
                  onDateChange={(value) => {
                    setHasChanges(true);
                    setSelectedFromDate(value);
                    props.updateAbsenceFromDate(value);
                  }}
                />
                <span className="formValidator__errorMsg">
                  {props.t('Date Required')}
                </span>
              </div>
              <div className="athleteAvailabilityAddAbsenceModal__datePickers--to">
                <DatePicker
                  label={props.t('Absent To')}
                  name="availabilitylist_add_absence_to_date"
                  value={selectedToDate}
                  onDateChange={(value) => {
                    const dateValue = value || '';
                    setHasChanges(true);
                    setSelectedToDate(dateValue);
                    props.updateAbsenceToDate(dateValue);
                  }}
                  clearBtn
                />
                <span className="athleteAvailabilityAddAbsenceModal__dateConflictError">
                  {props.t('Date conflicts with preceding date')}
                </span>
                <span className="athleteAvailabilityAddAbsenceModal__optionalText">
                  {props.t('Optional')}
                </span>
              </div>
            </div>
            <div className="km-datagrid-modalFooter athleteAvailabilityAddAbsenceModal__footer">
              <TextButton
                onClick={() => {}}
                type="primary"
                text={props.t('Save')}
              />
            </div>
          </FormValidator>
        </div>
        <AppStatus
          status={props.feedbackModalStatus}
          message={props.feedbackModalMessage}
        />
      </Modal>
    </>
  );
};

export const AddAbsenceModalTranslated = withNamespaces()(AddAbsenceModal);
export default AddAbsenceModal;
