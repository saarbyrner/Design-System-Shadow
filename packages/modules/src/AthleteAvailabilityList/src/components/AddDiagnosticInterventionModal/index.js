// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import {
  DatePicker,
  Dropdown,
  FormValidator,
  InputFile,
  InputText,
  LegacyModal as Modal,
  Textarea,
  TextButton,
  Checkbox,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { DropdownItem } from '@kitman/components/src/types';
import {
  getOsicsPathologyName,
  getSide,
} from '@kitman/common/src/utils/issues';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import AppStatus from '../../containers/AppStatus';
import type {
  DiagnosticData,
  DiagnosticsWithExtraFields,
} from '../../../types';

type Props = {
  isOpen: boolean,
  athleteId: ?number,
  attachments: Array<?File>,
  diagnosticTypes: Array<DropdownItem>,
  diagnosticsWithExtraFields: DiagnosticsWithExtraFields,
  closeModal: Function,
  athleteInjuries: Array<IssueOccurrenceRequested>,
  athleteIllnesses: Array<IssueOccurrenceRequested>,
  diagnosticData: DiagnosticData,
  covidResults: Array<DropdownItem>,
  covidAntibodyResults: Array<DropdownItem>,
  injuryOsicsPathologies: Array<{ id: string, name: string }>,
  illnessOsicsPathologies: Array<{ id: string, name: string }>,
  sides: Array<{ id: number, name: string }>,
  restrictAccessList: Array<DropdownItem>,
  injuryStatuses: InjuryStatuses,
  updateRelevantInjuries: Function,
  updateRelevantIllnesses: Function,
  updateDiagnosticMedicationType: Function,
  updateDiagnosticMedicationDosage: Function,
  updateDiagnosticMedicationFrequency: Function,
  updateDiagnosticMedicationNotes: Function,
  updateDiagnosticMedicationCompleted: Function,
  updateDiagnosticCovidTestDate: Function,
  updateDiagnosticCovidTestType: Function,
  updateDiagnosticCovidResult: Function,
  updateDiagnosticCovidReference: Function,
  updateDiagnosticCovidAntibodyTestDate: Function,
  updateDiagnosticCovidAntibodyTestType: Function,
  updateDiagnosticCovidAntibodyResult: Function,
  updateDiagnosticCovidAntibodyReference: Function,
  updateDiagnosticAnnotationContent: Function,
  updateDiagnosticRestrictAccessTo: Function,
  populateAthleteIssuesForDiagnostics: Function,
  updateDiagnosticAttachments: Function,
  uploadAttachments: Function,
  updateDiagnosticType: Function,
  updateDiagnosticDate: Function,
  saveDiagnostic: Function,
};

const AddDiagnosticInterventionModal = (props: I18nProps<Props>) => {
  useEffect(() => {
    if (props.athleteId) {
      props.populateAthleteIssuesForDiagnostics(props.athleteId);
    }
  }, [props.athleteId]);

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
      });
    }

    return date.format('D MMM YYYY');
  };

  const getRelevantIssues = (issueType) => {
    const issues =
      issueType === 'INJURY' ? props.athleteInjuries : props.athleteIllnesses;
    return issues && issues.length > 0 ? (
      issues.map((issue) => {
        const lastEventId = issue.events_order[issue.events_order.length - 1];
        const lastEvent = issue.events.find(
          (event) => event.id === lastEventId
        );
        const firstEvent = issue.events.find(
          (event) => event.id === issue.events_order[0]
        );
        const relevantIssueIds =
          issueType === 'INJURY'
            ? props.diagnosticData.injury_ids
            : props.diagnosticData.illness_ids;
        const isIssueSelected = relevantIssueIds.indexOf(issue.issue_id) !== -1;
        const updateCallback =
          issueType === 'INJURY'
            ? props.updateRelevantInjuries
            : props.updateRelevantIllnesses;
        // The last item in the system is always the closer, it's ID is its position.
        // Can't use ID as the closer event can be different for each system,
        // eg ID 3 might not be a closer for all systems.
        const injuryStatusSystemCloserId = props.injuryStatuses.slice(-1)[0].id;
        return (
          <div
            className="athleteAvailabilityDiagnosticModal__relevantIssue"
            key={issue.issue_id}
          >
            <div className="athleteAvailabilityDiagnosticModal__issueCheckboxContainer">
              <Checkbox
                id={`isSelectedIssue_${issue.issue_id}`}
                isChecked={isIssueSelected}
                toggle={() => updateCallback(issue.issue_id)}
                name="athleteAvailabilityDiagnosticModal__checkbox"
              />
            </div>
            <span className="athleteAvailabilityDiagnosticModal__issueDate">
              {firstEvent
                ? formatDate(
                    moment(
                      firstEvent.event_date,
                      DateFormatter.dateTransferFormat
                    )
                  )
                : null}
            </span>
            <span className="athleteAvailabilityDiagnosticModal__issueName">
              {getOsicsPathologyName(
                props.injuryOsicsPathologies,
                props.illnessOsicsPathologies,
                issueType,
                issue
              )}
            </span>
            {getSide(
              'athleteAvailabilityDiagnosticModal__issueSide',
              props.sides,
              issue.side_id
            )}
            {lastEvent &&
            lastEvent.injury_status_id !== injuryStatusSystemCloserId ? (
              <span className="athleteAvailabilityDiagnosticModal__currentLabel">
                {props.t('Current')}
              </span>
            ) : null}
          </div>
        );
      })
    ) : (
      <p className="athleteAvailabilityDiagnosticModal__emptyText">
        {props.t('#sport_specific__There_are_no_issues_for_this_athlete.')}
      </p>
    );
  };

  const getUploadFields = () => {
    return props.attachments.map((attachment, index) => (
      <div
        className="athleteAvailabilityDiagnosticModal__uploadFile"
        key={`attachment_${index}`} // eslint-disable-line react/no-array-index-key
      >
        <InputFile
          value={attachment}
          onChange={(file) => props.updateDiagnosticAttachments(file, index)}
          name="file"
        />
      </div>
    ));
  };

  const renderMedicalFormSection = () => {
    return (
      props.diagnosticData.diagnostic_type ===
        props.diagnosticsWithExtraFields.medication && (
        <>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--medicationDetails">
            <InputText
              value={props.diagnosticData.medication_type || ''}
              onValidation={(input) =>
                props.updateDiagnosticMedicationType(input.value)
              }
              label={props.t('Type')}
              maxLength={128}
              required={false}
              showRemainingChars={false}
            />
            <InputText
              value={props.diagnosticData.medication_dosage || ''}
              onValidation={(input) =>
                props.updateDiagnosticMedicationDosage(input.value)
              }
              label={props.t('Dosage')}
              maxLength={128}
              required={false}
              showRemainingChars={false}
            />
            <InputText
              value={props.diagnosticData.medication_frequency || ''}
              onValidation={(input) =>
                props.updateDiagnosticMedicationFrequency(input.value)
              }
              label={props.t('Frequency')}
              maxLength={128}
              required={false}
              showRemainingChars={false}
            />
          </div>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--medicationNote">
            <Textarea
              label={props.t('Notes')}
              value={props.diagnosticData.medication_notes || ''}
              onChange={(note) => props.updateDiagnosticMedicationNotes(note)}
              name="athleteProfileDiagnosticModal_textarea"
              t={props.t}
            />
          </div>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--courseCompleted">
            <Checkbox
              label={props.t('Course already completed')}
              id="courseCompleted"
              name="athleteProfileDiagnosticModal__courseCompleted"
              isChecked={props.diagnosticData.medication_completed}
              toggle={(checkbox) =>
                props.updateDiagnosticMedicationCompleted(checkbox.checked)
              }
            />
          </div>
        </>
      )
    );
  };

  const renderCovidFormSection = () => {
    return (
      props.diagnosticData.diagnostic_type ===
        props.diagnosticsWithExtraFields.covid_19_test && (
        <>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--covidTestDate">
            <DatePicker
              label={props.t('Date of Test')}
              name="diagnostic_covid_test_date"
              value={props.diagnosticData.covid_test_date}
              onDateChange={(date) => props.updateDiagnosticCovidTestDate(date)}
              orientation="vertical auto"
              maxDate={moment(new Date())}
            />
          </div>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--covidTestDetails">
            <div>
              <InputText
                value={props.diagnosticData.covid_test_type}
                onValidation={(input) =>
                  props.updateDiagnosticCovidTestType(input.value)
                }
                label={props.t('Test Type')}
                required={false}
              />
              <span className="athleteAvailabilityDiagnosticModal__optionalText">
                {props.t('Optional')}
              </span>
            </div>
            <Dropdown
              onChange={(covidResultId) =>
                props.updateDiagnosticCovidResult(covidResultId)
              }
              items={props.covidResults}
              label={props.t('Result')}
              value={props.diagnosticData.covid_result}
            />

            <div>
              <InputText
                value={props.diagnosticData.covid_reference}
                onValidation={(input) =>
                  props.updateDiagnosticCovidReference(input.value)
                }
                label={props.t('Reference')}
                required={false}
              />
              <span className="athleteAvailabilityDiagnosticModal__optionalText">
                {props.t('Optional')}
              </span>
            </div>
          </div>
        </>
      )
    );
  };

  const renderCovidAntibodyFormSection = () => {
    return (
      props.diagnosticData.diagnostic_type ===
        props.diagnosticsWithExtraFields.covid_19_antibody_test && (
        <>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--covidTestDate">
            <DatePicker
              label={props.t('Date of Test')}
              name="diagnostic_covid_test_date"
              value={props.diagnosticData.covid_antibody_test_date}
              onDateChange={(date) =>
                props.updateDiagnosticCovidAntibodyTestDate(date)
              }
              orientation="vertical auto"
              maxDate={moment(new Date())}
            />
          </div>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--covidTestDetails">
            <div>
              <InputText
                value={props.diagnosticData.covid_antibody_test_type}
                onValidation={(input) =>
                  props.updateDiagnosticCovidAntibodyTestType(input.value)
                }
                label={props.t('Test Type')}
                required={false}
              />
              <span className="athleteAvailabilityDiagnosticModal__optionalText">
                {props.t('Optional')}
              </span>
            </div>
            <Dropdown
              onChange={(covidResultId) =>
                props.updateDiagnosticCovidAntibodyResult(covidResultId)
              }
              items={props.covidAntibodyResults}
              label={props.t('Result')}
              value={props.diagnosticData.covid_antibody_result}
            />
            <div>
              <InputText
                value={props.diagnosticData.covid_antibody_reference}
                onValidation={(input) =>
                  props.updateDiagnosticCovidAntibodyReference(input.value)
                }
                label={props.t('Reference')}
                required={false}
              />{' '}
              <span className="athleteAvailabilityDiagnosticModal__optionalText">
                {props.t('Optional')}
              </span>
            </div>
          </div>
        </>
      )
    );
  };

  const renderAnnotationFormSection = () => {
    return (
      [
        props.diagnosticsWithExtraFields.blood_tests,
        props.diagnosticsWithExtraFields.cardiac_data,
        props.diagnosticsWithExtraFields.concussion,
      ].includes(props.diagnosticData.diagnostic_type) && (
        <>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--annotationContent">
            <Textarea
              label={props.t('Note')}
              value={props.diagnosticData.annotation_content || ''}
              onChange={(annotationContent) =>
                props.updateDiagnosticAnnotationContent(annotationContent)
              }
              name="athleteProfileDiagnosticModal_textarea"
              t={props.t}
            />
            <Dropdown
              label={props.t('Restrict access to')}
              value={props.diagnosticData.restrict_access_to}
              onChange={(restrictToId) =>
                props.updateDiagnosticRestrictAccessTo(restrictToId)
              }
              items={props.restrictAccessList}
            />
          </div>
        </>
      )
    );
  };

  return (
    <Modal
      isOpen={props.isOpen}
      close={() => props.closeModal()}
      title={props.t('Diagnostic/Intervention')}
    >
      <div className="athleteAvailabilityDiagnosticModal">
        <FormValidator
          successAction={() =>
            props.saveDiagnostic(props.athleteId, props.diagnosticData)
          }
          inputNamesToIgnore={[
            'file',
            'athleteProfileDiagnosticModal__courseCompleted',
            'athleteAvailabilityDiagnosticModal__checkbox',
            'athleteProfileDiagnosticModal_textarea',
            'test_type',
            'reference',
          ]}
        >
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--typeDate">
            <Dropdown
              onChange={(typeId) => props.updateDiagnosticType(typeId)}
              items={props.diagnosticTypes || []}
              label={props.t('Diagnostic Type')}
              value={props.diagnosticData.diagnostic_type}
            />
            <DatePicker
              label={props.t('Date')}
              name="availabilitylist_diag_date"
              value={props.diagnosticData.diagnostic_date}
              onDateChange={(date) => props.updateDiagnosticDate(date)}
              clearBtn
              orientation="vertical auto"
            />
          </div>
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--relevantIssues">
            <div className="athleteAvailabilityDiagnosticModal__relevantIssueContainer">
              <h6>{props.t('Relevant Injuries')}</h6>
              <div className="athleteAvailabilityDiagnosticModal__issueContainer checkboxGroup">
                {getRelevantIssues('INJURY')}
              </div>
            </div>
            <div className="athleteAvailabilityDiagnosticModal__relevantIssueContainer">
              <h6>{props.t('Relevant Illnesses')}</h6>
              <div className="athleteAvailabilityDiagnosticModal__issueContainer checkboxGroup">
                {getRelevantIssues('ILLNESS')}
              </div>
            </div>
          </div>
          {renderMedicalFormSection()}
          {window.featureFlags['covid-19-medical-diagnostic'] &&
            renderCovidFormSection()}
          {window.featureFlags['covid-19-medical-diagnostic'] &&
            renderCovidAntibodyFormSection()}
          {renderAnnotationFormSection()}
          <div className="athleteAvailabilityDiagnosticModal__row athleteAvailabilityDiagnosticModal__row--attachments">
            <h6>{props.t('Attach File(s) (jpg, png, pdf, mp4, mp3)')}</h6>
            {getUploadFields()}
            <div className="athleteAvailabilityDiagnosticModal__uploadFile">
              <InputFile
                value={null}
                onChange={(file) =>
                  props.uploadAttachments(file, props.attachments.length + 1)
                }
                name="file"
              />
            </div>
          </div>
          <div className="km-datagrid-modalFooter athleteAvailabilityDiagnosticModal__footer">
            <div className="athleteAvailabilityDiagnosticModal__footerBtnContainer">
              <TextButton
                onClick={() => {}}
                type="primary"
                text={props.t('Save')}
                isSubmit
              />
            </div>
          </div>
        </FormValidator>
      </div>
      <AppStatus />
    </Modal>
  );
};

export const AddDiagnosticInterventionModalTranslated = withNamespaces()(
  AddDiagnosticInterventionModal
);
export default AddDiagnosticInterventionModal;
