// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  SlidingPanelResponsive,
  Select,
  DatePicker,
  TextButton,
  FileUploadArea,
  InputTextField,
  RichTextEditor,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption as Option } from '@kitman/components/src/types';
import moment from 'moment';
import { saveMedicalNote, uploadFile } from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { AnnotationForm } from '@kitman/modules/src/Medical/shared/types';
import {
  checkInvalidFileTitles,
  transformFilesForUpload,
} from '@kitman/common/src/utils/fileHelper';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { isScannerIntegrationAllowed } from '@kitman/components/src/DocumentScanner/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '../../types';
import AthleteConstraints from '../AthleteConstraints';

import style, { uploadedFilesErrorStyle } from '../styles/forms';
// Whenever you delete all content from the RichTextEditor
// component this is the returned empty value
const emptyRichHTMLEditorValue: string = '<p><br></p>';

type Athlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  shortname: string,
  date_of_birth: string,
  avatar_url: string,
};
export type Squad = {
  id: number,
  name: string,
  owner_id: string,
  created_at: Date,
  updated_at: Date,
  athletes: Array<Athlete>,
};

type Props = {
  isPanelOpen: boolean,
  setIsPanelOpen: Function,
  playerOptions: Array<Option>,
  categoryOptions: Array<Option>,
  athleteId: number,
  issueId: string,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
  getDocuments?: Function,
  organisationAnnotationTypeId: number,
  athleteIssues: Array<Option>,
  fetchAthleteIssues: Function,
  squads: Array<Squad>,
  defaultAthleteSquadId: number,
};

const AddMedicalDocumentSidePanel = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [selectedAthlete, setSelectedAthlete] = useState<number>(
    props.athleteId
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Array<number>>(
    []
  );
  const [unUploadedFiles, setUnUploadedFiles] = useState<Array<AttachedFile>>(
    []
  );
  const [showNoteSection, setShowNoteSection] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [selectedIssues, setSelectedIssues] = useState<Array<string>>(
    props.issueId ? [props.issueId] : []
  );
  const [selectedVisibility, setSelectedVisibility] =
    useState<string>('DEFAULT');
  const [validateForm, setValidateForm] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [athleteSquadId, setAthleteSquadId] = useState<number>(
    props.defaultAthleteSquadId
  );

  const onAthleteChange = () => {
    props.fetchAthleteIssues(selectedAthlete);
  };

  const uploadFiles = (unConfirmedFiles) => {
    unConfirmedFiles.forEach((unConfirmedFile, index) => {
      const unUploadedFile = unUploadedFiles[index].file;
      const fileName = unUploadedFile.name;
      const fileSize = fileSizeLabel(unUploadedFile.size, true);
      const fileId = unConfirmedFile.id;

      props.onFileUploadStart(fileName, fileSize, fileId);

      uploadFile(
        unUploadedFiles[index].file,
        unConfirmedFile.id,
        unConfirmedFile.presigned_post
      )
        .then(() => props.onFileUploadSuccess(fileId))
        .catch(() => props.onFileUploadFailure(fileId));
    });
  };

  const convertIssueIdToNumber = (issue) => {
    return +issue.replace(/\D/g, '');
  };

  const resetForm = () => {
    props.setIsPanelOpen(false);
    setSelectedAthlete(props.athleteId);
    setSelectedDate(null);
    setSelectedCategories([]);
    setUnUploadedFiles([]);
    setShowNoteSection(false);
    setNoteTitle('');
    setNoteContent('');
    setSelectedIssues(props.issueId ? [props.issueId] : []);
    setSelectedVisibility('DEFAULT');
    setValidateForm(false);
  };

  const onSave = () => {
    setValidateForm(true);

    const requiredFields: Array<mixed> = [
      selectedAthlete,
      selectedDate,
      selectedCategories,
      selectedVisibility,
      unUploadedFiles,
    ];

    if (noteTitle.length > 0) {
      requiredFields.push(noteContent);
    }

    if (noteContent.length > 0) {
      requiredFields.push(noteTitle);
    }

    const allRequiredFieldsAreValid: boolean = requiredFields.every(
      (item) => item
    );

    if (
      !allRequiredFieldsAreValid ||
      unUploadedFiles.length === 0 ||
      checkInvalidFileTitles(unUploadedFiles)
    ) {
      return;
    }

    const transformedAttachments = transformFilesForUpload(unUploadedFiles);

    const illnessIds: Array<number> = [];
    const injuryIds: Array<number> = [];
    const chronicIds: Array<number> = [];

    if (selectedIssues.length > 0) {
      selectedIssues.forEach((issue) => {
        const parsedIssue = convertIssueIdToNumber(issue);
        if (issue.includes('Illness_') && issue.charAt(0) === 'I') {
          illnessIds.push(parsedIssue);
        } else if (issue.includes('Injury_') && issue.charAt(0) === 'I') {
          injuryIds.push(parsedIssue);
        } else if (
          issue.includes('ChronicInjury_') ||
          issue.includes('ChronicIllness')
        ) {
          chronicIds.push(parsedIssue);
        }
      });
    }

    setRequestStatus('PENDING');

    const params: AnnotationForm = {
      athlete_id: selectedAthlete,
      annotation_date: selectedDate?.toString(),
      document_note_category_ids: selectedCategories,
      title: noteTitle,
      content: noteContent,
      annotationable_type: 'Athlete',
      attachments_attributes: transformedAttachments,
      restricted_to_doc: selectedVisibility === 'DOCTORS',
      restricted_to_psych: selectedVisibility === 'PSYCH_TEAM',
      illness_occurrence_ids: illnessIds,
      injury_occurrence_ids: injuryIds,
      chronic_issue_ids: chronicIds,
      organisation_annotation_type_id: props.organisationAnnotationTypeId,
      annotationable_id: selectedAthlete,
      annotation_actions_attributes: [],
      squad_id: athleteSquadId,
    };

    saveMedicalNote(params)
      .then((response) => {
        const unConfirmedFiles = response.attachments.filter(
          (file) => file.confirmed === false
        );
        if (unConfirmedFiles.length > 0) {
          uploadFiles(unConfirmedFiles);
        }
        setRequestStatus(null);
        resetForm();
        if (props.getDocuments) {
          props.getDocuments();
        }
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const togglePanel = () => {
    props.setIsPanelOpen(!props.isPanelOpen);
    resetForm();
  };

  const onKeyDown = (event) => {
    const ENTER_KEY_CODE = 13;
    const ESC_KEY_CODE = 27;
    const { keyCode } = event;

    if (!props.isPanelOpen) {
      return;
    }

    if (keyCode === ENTER_KEY_CODE) {
      onSave();
    }

    if (keyCode === ESC_KEY_CODE) {
      togglePanel();
    }
  };

  useEffect(() => {
    if (selectedAthlete) onAthleteChange();

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedAthlete]);

  useEffect(() => {
    if (noteContent === emptyRichHTMLEditorValue) setNoteContent('');
  }, [noteTitle, noteContent]);

  const showPlayerMovementDatePicker = () => {
    return (
      window.featureFlags['player-movement-entity-medical-documents'] &&
      window.featureFlags['player-movement-aware-datepicker']
    );
  };

  const renderDatePickerNew = () => {
    return (
      <MovementAwareDatePicker
        athleteId={selectedAthlete}
        value={selectedDate}
        onChange={(date) =>
          setSelectedDate(
            moment(date).startOf('day').format(dateTransferFormat)
          )
        }
        inputLabel={props.t('Date of document')}
        disabled={requestStatus === 'PENDING' || selectedAthlete === null}
        isInvalid={validateForm && selectedDate === null}
        kitmanDesignSystem
      />
    );
  };

  return (
    <div css={style.sidePanel} data-testid="AddMedicalDocumentSidePanel|Parent">
      <SlidingPanelResponsive
        isOpen={props.isPanelOpen}
        title="Add documents"
        onClose={() => togglePanel()}
        width={659}
      >
        <div css={style.section}>
          <div
            css={[style.row, style['row--dualFields']]}
            data-testid="AddMedicalDocumentSidePanel|TopRow"
          >
            <Select
              label={props.t('Athlete')}
              onChange={(id) => {
                const selectedPlayerSquad = props.squads.find((squad) => {
                  return squad.athletes.find((athlete) => athlete.id === id);
                });
                if (selectedPlayerSquad) {
                  setAthleteSquadId(selectedPlayerSquad.id);
                }
                setSelectedAthlete(id);
                setSelectedIssues([]);
              }}
              value={selectedAthlete}
              options={props.playerOptions}
              isDisabled={
                props.athleteId !== null || requestStatus === 'PENDING'
              }
              invalid={validateForm && selectedAthlete === null}
            />
            {!showPlayerMovementDatePicker() && (
              <AthleteConstraints athleteId={selectedAthlete}>
                {({ lastActivePeriod }) => {
                  return (
                    <DatePicker
                      label={props.t('Date of document')}
                      value={selectedDate}
                      onDateChange={(date) =>
                        setSelectedDate(moment(date).format(dateTransferFormat))
                      }
                      maxDate={lastActivePeriod.end}
                      minDate={
                        window.featureFlags[
                          'player-movement-entity-medical-documents'
                        ] && lastActivePeriod.start
                      }
                      kitmanDesignSystem
                      invalid={validateForm && selectedDate === null}
                      disabled={
                        requestStatus === 'PENDING' || selectedAthlete === null
                      }
                    />
                  );
                }}
              </AthleteConstraints>
            )}
            {showPlayerMovementDatePicker() && renderDatePickerNew()}
          </div>
          <div
            css={style.row}
            data-testid="AddMedicalDocumentSidePanel|Categories"
          >
            <Select
              label={props.t('Categories')}
              onChange={(values) => {
                setSelectedCategories(values);
              }}
              options={props.categoryOptions}
              value={selectedCategories}
              isMulti
              appendToBody
              invalid={validateForm && selectedCategories.length === 0}
              isDisabled={requestStatus === 'PENDING'}
            />
          </div>
          <FileUploadArea
            showActionButton={false}
            areaTitle={props.t('Attach file(s)')}
            attachedFiles={unUploadedFiles}
            updateFiles={setUnUploadedFiles}
            removeFiles={props.isPanelOpen}
            isFileError={validateForm && unUploadedFiles.length === 0}
            testIdPrefix="AddMedicalDocumentSidePanel"
            documentScanner={isScannerIntegrationAllowed()}
          />
          {showNoteSection ? (
            <>
              <hr css={style.hr} />
              <div css={style.attachmentsHeader}>
                <h3 className="kitmanHeading--L3">{props.t('Add note')}</h3>
                <div css={style.copyNoteButton}>
                  <TextButton
                    onClick={() => {
                      setShowNoteSection(false);
                      setNoteTitle('');
                      setNoteContent('');
                    }}
                    iconBefore="icon-bin"
                    type="subtle"
                    kitmanDesignSystem
                    isDisabled={requestStatus === 'PENDING'}
                  />
                </div>
              </div>
              <div
                css={[style.row, style['row--dualFields']]}
                data-testid="AddMedicalDocumentSidePanel|NoteTitle"
              >
                <InputTextField
                  label={props.t('Title')}
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  invalid={
                    validateForm &&
                    showNoteSection &&
                    noteTitle.length === 0 &&
                    noteContent.length > 0
                  }
                  kitmanDesignSystem
                />
              </div>

              <div
                css={style.row}
                data-testid="AddMedicalDocumentSidePanel|NoteInput"
              >
                <div
                  css={uploadedFilesErrorStyle(
                    validateForm &&
                      showNoteSection &&
                      noteTitle.length > 0 &&
                      noteContent.length === 0
                  )}
                >
                  <RichTextEditor
                    onChange={(content) => {
                      setNoteContent(content);
                    }}
                    value={noteContent}
                    kitmanDesignSystem
                  />
                </div>
              </div>
            </>
          ) : (
            <TextButton
              onClick={() => setShowNoteSection(true)}
              text={props.t('Add note')}
              type="secondary"
              kitmanDesignSystem
            />
          )}
          <hr css={style.hr} />
          <div
            css={style.row}
            data-testid="AddMedicalDocumentSidePanel|Injuries"
          >
            <Select
              label={props.t('Associated injury/illness')}
              onChange={(ids) => {
                setSelectedIssues(ids);
              }}
              options={props.athleteIssues}
              value={selectedIssues}
              isDisabled={
                selectedAthlete === null || requestStatus === 'PENDING'
              }
              appendToBody
              optional={props.issueId === null}
              isMulti
            />
          </div>
          <div
            css={[style.row, style['row--dualFields']]}
            data-testid="AddMedicalDocumentSidePanel|Visibility"
          >
            <Select
              label={props.t('Visibility')}
              onChange={(value) => setSelectedVisibility(value)}
              value={selectedVisibility}
              options={[
                { value: 'DEFAULT', label: props.t('Default visibility') },
                { value: 'DOCTORS', label: props.t('Doctors') },
                ...(window.featureFlags['mls-emr-psych-notes']
                  ? [{ value: 'PSYCH_TEAM', label: props.t('Psych Team') }]
                  : []),
              ]}
              isDisabled={requestStatus === 'PENDING'}
              appendToBody
            />
          </div>
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={() => onSave()}
            text={props.t('Save')}
            type="primary"
            isDisabled={!permissions.medical.documents.canCreate}
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddMedicalDocumentSidePanelTranslated = withNamespaces()(
  AddMedicalDocumentSidePanel
);
export default AddMedicalDocumentSidePanel;
