// @flow
import { useState, useEffect } from 'react';
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';
import Tippy from '@tippyjs/react';

import {
  AppStatus,
  DatePicker,
  Dropdown,
  FormValidator,
  GroupedDropdown,
  InputFile,
  InputText,
  LegacyModal as Modal,
  Textarea,
  TextButton,
  Checkbox,
} from '@kitman/components';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { GroupedDropdownItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { NoteData } from './types';
import { RelevantIssueListTranslated as RelevantIssueList } from './RelevantIssueList';

type Props = {
  isOpen: boolean,
  closeModal: Function,
  athleteId: ?number,
  athleteFullName: string,
  athleteInjuries: Array<?IssueOccurrenceRequested>,
  athleteIllnesses: Array<?IssueOccurrenceRequested>,
  attachments: Array<?File>,
  noteData: NoteData,
  injuryOsicsPathologies: Array<{ id: string, name: string }>,
  illnessOsicsPathologies: Array<{ id: string, name: string }>,
  sides: Array<{ id: number, name: string }>,
  noteMedicalTypeOptions: Array<GroupedDropdownItem>,
  injuryStatuses: InjuryStatuses,
  updateNoteDate: Function,
  updateNoteType: Function,
  updateRelevantNoteInjuries: Function,
  updateRelevantNoteIllnesses: Function,
  updateNote: Function,
  updateIsRestricted: Function,
  updatePsychOnly: Function,
  saveNote: Function,
  updateNoteMedicalType: Function,
  updateNoteMedicalTypeName: Function,
  updateNoteAttachments: Function,
  updateNoteExpDate: Function,
  updateNoteBatchNumber: Function,
  updateNoteRenewalDate: Function,
  getLastNote: Function,
  uploadAttachments: Function,
  appStatus: ?string,
  appStatusMessage: ?string,
  closeAppStatus: Function,
  populateAthleteIssuesForNote: Function,
  requestStatus: { status: ?string, message: ?string },
  hideRequestStatus: Function,
};

const AddNoteModal = (props: I18nProps<Props>) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (props.athleteId) {
      props.populateAthleteIssuesForNote(props.athleteId);
    }
  }, [props.athleteId]);

  const renderNameField = () => {
    const displayNameField =
      props.noteData.medical_type === 'Allergy' ||
      props.noteData.medical_type === 'TUE' ||
      props.noteData.medical_type === 'Vaccination';
    return displayNameField ? (
      <div className="athleteProfileAddNoteModal__input">
        <InputText
          value={props.noteData.medical_name || ''}
          label={props.t('Name')}
          maxLength={128}
          required={false}
          showRemainingChars={false}
          onValidation={(input) => props.updateNoteMedicalTypeName(input.value)}
          t={props.t}
        />
      </div>
    ) : null;
  };

  const renderMedicalForm = () =>
    props.noteData.note_type === 3 ? (
      <>
        <div className="athleteProfileAddNoteModal__row">
          <div className="athleteProfileAddNoteModal__input athleteProfileAddNoteModal__input--medicalType">
            <GroupedDropdown
              customClass="athleteProfileAddNoteModal__medicalTypeSelect"
              label={props.t('Medical Type')}
              options={props.noteMedicalTypeOptions}
              onChange={(item) => props.updateNoteMedicalType(item.key_name)}
              value={props.noteData.medical_type}
            />
          </div>
          {renderNameField()}
        </div>
      </>
    ) : null;

  const getUploadFields = () => {
    return props.attachments.map((attachment, index) => (
      <div
        className="athleteProfileAddNoteModal__uploadFile"
        key={`attachment_${index}`} // eslint-disable-line react/no-array-index-key
      >
        <InputFile
          value={attachment}
          onChange={(file) => props.updateNoteAttachments(file, index)}
          name="file"
        />
      </div>
    ));
  };

  const renderUploadFile = () =>
    props.noteData.note_type === 3 &&
    props.noteData.medical_type &&
    props.noteData.medical_type !== 'Allergy' ? (
      <div className="athleteProfileAddNoteModal__row athleteProfileAddNoteModal__row--upload">
        <h6>{props.t('Attach File(s) (jpg, png, pdf, mp4, mp3)')}</h6>
        {getUploadFields()}
        <div className="athleteProfileAddNoteModal__uploadFile">
          <InputFile
            value={null}
            onChange={(file) =>
              props.uploadAttachments(file, props.attachments.length + 1)
            }
            name="file"
          />
        </div>
      </div>
    ) : null;

  const renderMedicationInfo = () => {
    const renderVaccinationInfo = () =>
      props.noteData.medical_type === 'Vaccination' ? (
        <>
          <div className="athleteProfileAddNoteModal__input athleteProfileAddNoteModal__input--batch">
            <InputText
              value={props.noteData.batch_number || ''}
              onValidation={(input) => props.updateNoteBatchNumber(input.value)}
              label={props.t('Batch Number')}
              maxLength={128}
              required={false}
              showRemainingChars={false}
              t={props.t}
            />
          </div>
          <div className="athleteProfileAddNoteModal__input athleteProfileAddNoteModal__input--renewalDate">
            <DatePicker
              label={props.t('Renewal Date')}
              name="availabilitylist_renewal_date"
              value={props.noteData.renewal_date}
              onDateChange={(value) => props.updateNoteRenewalDate(value)}
            />
          </div>
        </>
      ) : null;

    return props.noteData.note_type === 3 &&
      (props.noteData.medical_type === 'Vaccination' ||
        props.noteData.medical_type === 'TUE') ? (
      <div className="athleteProfileAddNoteModal__row">
        <div className="athleteProfileAddNoteModal__input athleteProfileAddNoteModal__input--expDate">
          <DatePicker
            label={props.t('Expiration Date')}
            name="availabilitylist_expiration_date"
            value={props.noteData.expiration_date}
            onDateChange={(value) => props.updateNoteExpDate(value)}
          />
        </div>
        {renderVaccinationInfo()}
      </div>
    ) : null;
  };

  const validateRelevantIssues = (input: Object) => {
    const $currentInput = input[0];

    if (
      $($currentInput).hasClass('reactCheckbox') &&
      props.noteData.note_type !== 3
    ) {
      const parentGroup = $($currentInput).parents(
        '.athleteNoteRelevantIssues'
      );
      const inputsInGroup = parentGroup.find('.reactCheckbox');
      let isOneCheckboxChecked = false;

      // as soon as we find one checkbox checked, the form is valid
      for (let i = 0; i < inputsInGroup.length; i++) {
        if ($(inputsInGroup[i]).hasClass('reactCheckbox--checked')) {
          isOneCheckboxChecked = true;
          break;
        }
      }

      return isOneCheckboxChecked;
    }
    return true;
  };

  const getVisibilityDropdownValue = () => {
    if (props.noteData.restricted) {
      return 'isRestricted';
    }

    if (props.noteData.psych_only) {
      return 'psychOnly';
    }

    return 'all';
  };

  const soapTemplate = 'Subjective:\n\nObjective:\n\nAssessment:\n\nPlan:\n';
  const posturalTemplate =
    'Head:\n\nShoulders:\n\nThoracic Spine:\n\nLumbar Spine:\n\nPelvis:\n\nHips:\n\nKnees:\n';
  const kneeTemplate = `Passive Knee Extension:\n\nPassive Knee Flexion:\n\nActive Knee Extension:\n\nActive Knee Flexion:\n\nPatellar Tap:\n\nSweep Test:\n\nAnterior Drawer Test:\n\nPosterior Drawer Test::\n\nLachman’s Test:\n`;

  const templateItems = [
    {
      id: 'soap',
      title: props.t('SOAP'),
    },
    {
      id: 'postural',
      title: props.t('Postural assessment'),
    },
    {
      id: 'knee',
      title: props.t('Knee assessment'),
    },
  ];

  const handleChangeTemplate = (templateId: string) => {
    let newNote;

    switch (templateId) {
      case 'soap':
        newNote = soapTemplate;
        break;
      case 'postural':
        newNote = posturalTemplate;
        break;
      case 'knee':
        newNote = kneeTemplate;
        break;
      default:
        newNote = '';
        break;
    }

    props.updateNote(newNote);
    setSelectedTemplate(templateId);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      close={() => {
        props.hideRequestStatus();
        props.closeModal();
      }}
    >
      <div className="modalContent athleteProfileAddNoteModal">
        <h5 className="athleteProfileAddNoteModal__title">
          {props.athleteId ? `${props.athleteFullName}` : null}
          <span>&nbsp;</span>
          <span>{props.t('Add Note')}</span>
        </h5>
        <FormValidator
          successAction={() => {
            if (props.athleteId) {
              props.saveNote(props.athleteId, props.noteData);
            }
          }}
          inputNamesToIgnore={[
            'file',
            'athleteProfileAddNoteModal__isRestricted',
            'athleteProfileAddNoteModal__psychOnly',
            'athleteProfileAddNoteModal__templates',
          ]}
          customValidation={validateRelevantIssues}
        >
          <div className="athleteProfileAddNoteModal__row">
            <div className="athleteProfileAddNoteModal__input">
              <DatePicker
                label={props.t('Date')}
                name="availabilitylist_add_note_date"
                value={props.noteData.note_date}
                onDateChange={(value) => props.updateNoteDate(value)}
                minDate={
                  window.featureFlags[
                    'player-movement-entity-emr-annotations'
                  ] && props.noteData.min_date
                }
                maxDate={
                  window.featureFlags[
                    'player-movement-entity-emr-annotations'
                  ] && props.noteData.max_date
                }
              />
            </div>
          </div>
          {renderMedicalForm()}
          <RelevantIssueList
            type={props.noteData.note_type}
            injuries={props.athleteInjuries}
            illnesses={props.athleteIllnesses}
            injuryOsicsPathologies={props.injuryOsicsPathologies}
            illnessOsicsPathologies={props.illnessOsicsPathologies}
            updateRelevantInjuries={props.updateRelevantNoteInjuries}
            updateRelevantIllnesses={props.updateRelevantNoteIllnesses}
            relevantInjuryIds={props.noteData.injury_ids}
            relevantIllnessIds={props.noteData.illness_ids}
            injuryStatuses={props.injuryStatuses}
            sides={props.sides}
          />
          <div className="athleteProfileAddNoteModal__row">
            <div className="athleteProfileAddNoteModal__note">
              {props.requestStatus.status === 'error' ? (
                <Tippy
                  placement="top"
                  content={
                    <div className="athleteProfileAddNoteModal__errorMsg">
                      {props.t('No note to copy')}
                      <i
                        className="icon-close athleteProfileAddNoteModal__closeErrorMsg"
                        onClick={() => props.hideRequestStatus()}
                      />
                    </div>
                  }
                  theme="neutral-tooltip"
                  trigger="manual"
                  showOnCreate
                  interactive
                >
                  <span
                    className="athleteProfileAddNoteModal__copyLastNote"
                    onClick={() =>
                      props.athleteId ? props.getLastNote(props.athleteId) : {}
                    }
                  >
                    {props.t('Copy last note')}
                  </span>
                </Tippy>
              ) : (
                <span
                  className="athleteProfileAddNoteModal__copyLastNote"
                  onClick={() =>
                    props.athleteId ? props.getLastNote(props.athleteId) : {}
                  }
                >
                  {props.t('Copy last note')}
                </span>
              )}

              <Textarea
                label={props.t('Notes')}
                value={props.noteData.note}
                onChange={(note) => props.updateNote(note)}
                name="athleteProfileAddNoteModal_textarea"
                minLimit={1}
                t={props.t}
              />
            </div>
          </div>
          <div className="athleteProfileAddNoteModal__row">
            {window.featureFlags['mls-emr-psych-notes'] ? (
              <div className="athleteProfileAddNoteModal__visibility">
                <Dropdown
                  onChange={(visibility) => {
                    if (visibility === 'isRestricted') {
                      props.updateIsRestricted(true);
                      props.updatePsychOnly(false);
                    } else if (visibility === 'psychOnly') {
                      props.updateIsRestricted(false);
                      props.updatePsychOnly(true);
                    } else {
                      props.updateIsRestricted(false);
                      props.updatePsychOnly(false);
                    }
                  }}
                  items={[
                    {
                      id: 'all',
                      title: props.t('Default Visibility'),
                    },
                    {
                      id: 'isRestricted',
                      title: props.t('Doctors'),
                    },
                    {
                      id: 'psychOnly',
                      title: props.t('Psych Team'),
                    },
                  ]}
                  label={props.t('Restrict access to')}
                  value={getVisibilityDropdownValue()}
                />
              </div>
            ) : (
              <div className="athleteProfileAddNoteModal__checkbox">
                <Checkbox
                  label={props.t('Restrict note to Doctors')}
                  id="isRestricted"
                  name="athleteProfileAddNoteModal__isRestricted"
                  isChecked={props.noteData.restricted}
                  toggle={(checkbox) =>
                    props.updateIsRestricted(checkbox.checked)
                  }
                />
              </div>
            )}
            {window.featureFlags['note-templates'] && (
              <div className="athleteProfileAddNoteModal__templates">
                <Dropdown
                  label={props.t('Template')}
                  name="athleteProfileAddNoteModal__templates"
                  items={templateItems}
                  selectedTemplate
                  onChange={handleChangeTemplate}
                  value={selectedTemplate}
                  clearBtn
                  onClickClear={() => {
                    props.updateNote('');
                    setSelectedTemplate(null);
                  }}
                />
              </div>
            )}
          </div>
          {renderMedicationInfo()}
          {renderUploadFile()}
          <div className="km-datagrid-modalFooter athleteProfileAddNoteModal__footer">
            <div className="athleteProfileAddNoteModal__footerBtnContainer">
              <TextButton
                onClick={() => {}}
                type="primary"
                text={props.t('Save')}
              />
            </div>
          </div>
        </FormValidator>
      </div>
      <AppStatus
        status={props.appStatus}
        message={props.appStatusMessage}
        close={props.closeAppStatus}
      />
    </Modal>
  );
};

export const AddNoteModalTranslated = withNamespaces()(AddNoteModal);
export default AddNoteModal;
