// @flow
import { useState, useEffect, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  SlidingPanelResponsive,
  Select,
  DatePicker as LegacyDatePicker,
  TextButton,
  InputTextField,
  RichTextEditor,
  FileUploadArea,
} from '@kitman/components';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type {
  SelectOption as Option,
  ToastDispatch,
  Toast,
} from '@kitman/components/src/types';
import moment from 'moment';
import { saveDocument, uploadFile } from '@kitman/services';
import updateMedicalDocument from '@kitman/services/src/services/medical/updateMedicalDocument';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type {
  AddDocument,
  AddDocuments,
  UpdateDocument,
} from '@kitman/modules/src/Medical/shared/types';
import type { OrganisationStatus } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import {
  checkInvalidFileTitles,
  transformFilesForUpload,
} from '@kitman/common/src/utils/fileHelper';
import { isScannerIntegrationAllowed } from '@kitman/components/src/DocumentScanner/utils';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { emptyHTMLeditorContent } from '../../utils';
import type { RequestStatus } from '../../types';
import type { MedicalFile } from '../../types/medical';
import AthleteConstraints from '../AthleteConstraints';

import style, {
  uploadedFilesErrorStyle,
} from '../AddMedicalDocumentSidePanel/styles';
import useMedicalFileForm from './hooks/useMedicalFileForm';

type Props = {
  athleteConstraints?: { organisationStatus: OrganisationStatus },
  isPanelOpen: boolean,
  setIsPanelOpen: Function,
  playerOptions: Array<Option>,
  categoryOptions: Array<Option>,
  athleteId: number,
  issueId: string,
  getDocuments?: Function,
  athleteIssues: Array<Option>,
  fetchAthleteIssues: Function,
  toastAction: ToastDispatch<ToastAction>,
  toasts: Array<Toast>,
  selectedFile: MedicalFile,
  clearSelectedFile: Function,
  isEditing: boolean,
};

type ResponseError = {
  type: 'date' | 'unknown',
  message: ?string,
};

const AddMedicalFileSidePanel = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { formState, dispatch } = useMedicalFileForm();
  const { trackEvent } = useEventTracking();
  const [showNoteSection, setShowNoteSection] = useState<boolean>(false);
  const [validateForm, setValidateForm] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [responseErrors, setResponseErrors] = useState<Array<ResponseError>>(
    []
  );

  // Will hold state value (lastActivePeriod) when passed from within MovementAwareDatePicker
  const LastActivePeriodRef = useRef();

  const enhancedFilesFlow =
    window.featureFlags['medical-files-tab-enhancement'];

  const onAthleteChange = () => {
    if (!props.isEditing) {
      dispatch({
        type: 'SET_SELECTED_DATE',
        selectedDate: '',
      });

      if (
        props.isPanelOpen &&
        props.athleteConstraints?.organisationStatus === 'CURRENT_ATHLETE'
      ) {
        dispatch({
          type: 'SET_SELECTED_DATE',
          selectedDate: moment().format(dateTransferFormat),
        });
      }
    }
    props.fetchAthleteIssues(formState.selectedAthlete);
  };

  const uploadFiles = (unConfirmedFiles) => {
    unConfirmedFiles.forEach((unConfirmedFile, index) => {
      const unUploadedFile = formState.filesToUpload[index].file;
      const fileName = unUploadedFile.name;
      const fileId = unConfirmedFile.id;

      props.toastAction({
        type: 'CREATE_TOAST',
        toast: {
          id: fileId,
          title: `${props.t('Uploading')} ${fileName}`,
          status: 'LOADING',
        },
      });

      uploadFile(
        formState.filesToUpload[index].file,
        unConfirmedFile.id,
        unConfirmedFile.presigned_post
      )
        .then(() => {
          props.toastAction({
            type: 'UPDATE_TOAST',
            toast: {
              id: fileId,
              title: `${fileName} - ${props.t('uploaded successfully')}`,
              status: 'SUCCESS',
            },
          });
        })
        .catch(() => {
          props.toastAction({
            type: 'UPDATE_TOAST',
            toast: {
              id: fileId,
              title: `${fileName} - ${props.t('failed to upload')}`,
              status: 'ERROR',
            },
          });
        });
    });
  };

  const convertIssueIdToNumber = (issue) => {
    return +issue.replace(/\D/g, '');
  };

  const showPlayerMovementDatePicker = () => {
    return (
      window.featureFlags['player-movement-entity-medical-documents'] &&
      window.featureFlags['player-movement-aware-datepicker']
    );
  };

  const resetForm = (toggled: boolean = false) => {
    if (!toggled) {
      props.setIsPanelOpen(false);
    }
    if (props.clearSelectedFile) {
      props.clearSelectedFile();
    }
    dispatch({
      type: 'CLEAR_FORM',
    });

    setShowNoteSection(false);
    setValidateForm(false);
  };

  const validateFormFields = () => {
    setValidateForm(true);

    const requiredFields: Array<mixed> = [
      formState.selectedAthlete,
      formState.selectedDate,
      !!formState.selectedCategories.length,
    ];

    // if theres note content make sure a title goes with it
    if (formState.noteContent.length > 0) {
      requiredFields.push(formState.noteTitle.length > 0);
    }
    return requiredFields.every((item) => item);
  };

  const groupSelectedIssues = () => {
    const illnessIds: Array<number> = [];
    const injuryIds: Array<number> = [];
    const chronicIds: Array<number> = [];

    if (formState.selectedIssues.length > 0) {
      formState.selectedIssues.forEach((issue) => {
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

    return {
      illnessIds,
      injuryIds,
      chronicIds,
    };
  };

  const onEdit = async () => {
    const allRequiredFieldsAreValid = validateFormFields();
    const { illnessIds, injuryIds, chronicIds } = groupSelectedIssues();

    if (!allRequiredFieldsAreValid || !formState.updatedFileName) {
      return;
    }

    setRequestStatus('PENDING');

    const editedDocument: UpdateDocument = {
      document_category_ids: formState.selectedCategories,
      document_date: formState.selectedDate ? formState.selectedDate : null,
      athlete_active_period: formState.lastActivePeriod
        ? formState.lastActivePeriod
        : null,
      attachment: {
        name: formState.updatedFileName,
      },
      injury_occurrence_ids: injuryIds,
      illness_occurrence_ids: illnessIds,
      chronic_issue_ids: chronicIds,
      annotation: {
        title: formState.noteTitle,
        content: formState.noteContent,
      },
    };

    try {
      await updateMedicalDocument(props.selectedFile.id, editedDocument);

      props.toastAction({
        type: 'UPDATE_TOAST',
        toast: {
          id: props.selectedFile.id,
          title: `${formState.updatedFileName} - ${props.t(
            'edited successfully'
          )}`,
          status: 'SUCCESS',
        },
      });
      resetForm();

      if (props.getDocuments) {
        props.getDocuments();
      }
    } catch (err) {
      props.toastAction({
        type: 'UPDATE_TOAST',
        toast: {
          id: props.selectedFile.id,
          title: `${formState.updatedFileName} - ${props.t('failed to edit')}`,
          status: 'ERROR',
        },
      });
    }

    setRequestStatus(null);
    trackEvent(performanceMedicineEventNames.editMedicalDocument, {
      ...determineMedicalLevelAndTab(),
    });
  };

  const onSave = () => {
    setResponseErrors([]);
    const allRequiredFieldsAreValid = validateFormFields();

    if (
      !allRequiredFieldsAreValid ||
      !formState.filesToUpload.length ||
      checkInvalidFileTitles(formState.filesToUpload)
    ) {
      return;
    }

    const transformedAttachments = transformFilesForUpload(
      formState.filesToUpload
    );

    const { illnessIds, injuryIds, chronicIds } = groupSelectedIssues();

    setRequestStatus('PENDING');

    const parsedDocuments: Array<AddDocument> = transformedAttachments.map(
      (attachment) => {
        return {
          // $FlowIgnore selectedAthlete is a required field and breaks out before this runs if its not included
          athlete_id: formState.selectedAthlete,
          ...(!enhancedFilesFlow && {
            document_category_ids: formState.selectedCategories,
          }),
          document_date: formState.selectedDate ? formState.selectedDate : null,
          athlete_active_period: formState.lastActivePeriod
            ? formState.lastActivePeriod
            : null,
          attachment: {
            ...attachment,
            ...(enhancedFilesFlow && {
              medical_attachment_category_ids: formState.selectedCategories,
            }),
          },
          injury_occurrence_ids: injuryIds,
          illness_occurrence_ids: illnessIds,
          chronic_issue_ids: chronicIds,
          annotation: {
            title: formState.noteTitle,
            content: formState.noteContent,
          },
        };
      }
    );

    const requestBody: AddDocuments = {
      documents: parsedDocuments,
    };

    saveDocument(requestBody)
      .then((response) => {
        const responseFiles = response.documents.map((file) => {
          return file.attachment;
        });
        const unConfirmedFiles = responseFiles.filter(
          (attachment) => attachment.confirmed === false
        );

        if (unConfirmedFiles.length > 0) {
          uploadFiles(unConfirmedFiles);
        }

        setRequestStatus(null);
        resetForm();

        trackEvent(performanceMedicineEventNames.createdMedicalDocument, {
          ...determineMedicalLevelAndTab(),
        });

        if (props.getDocuments) {
          props.getDocuments();
        }
      })
      .catch((xhr) => {
        let message = xhr?.responseJSON?.errors || props.t('Unknown error');
        if (message === "a document_date can't be in the future") {
          message = props.t('A document date cannot be in the future');
          setResponseErrors([
            {
              type: 'date',
              message,
            },
          ]);
        } else {
          setResponseErrors([{ type: 'unknown', message }]);
        }
        props.toastAction({
          type: 'CREATE_TOAST',
          toast: {
            id: 'submit-medical-file',
            title: message,
            status: 'ERROR',
          },
        });

        setRequestStatus('FAILURE');
      });
  };

  const togglePanel = () => {
    props.setIsPanelOpen(!props.isPanelOpen);
    resetForm(true);
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

  const removeToast = (toastId) => {
    props.toastAction({
      type: 'REMOVE_TOAST_BY_ID',
      id: toastId,
    });
  };

  const getMaxDate = (endDate) => {
    const now = moment();

    if (endDate) {
      return moment(endDate).isAfter(now) ? now : endDate;
    }

    return now;
  };

  const getMinDate = (startDate) => {
    return startDate;
  };

  const renderDatePickerNew = () => {
    return (
      <MovementAwareDatePicker
        athleteId={formState.selectedAthlete ?? undefined}
        value={moment(formState.selectedDate)}
        onChange={(date) => {
          setResponseErrors((errors) =>
            errors.filter((error) => error.type !== 'date')
          );

          dispatch({
            type: 'SET_SELECTED_DATE',
            selectedDate: moment(date)
              .startOf('day')
              .format(dateTransferFormat),
          });
        }}
        lastActivePeriodCallback={(val) => {
          LastActivePeriodRef.current = val;
        }}
        inputLabel={props.t('Date of document')}
        disabled={
          requestStatus === 'PENDING' || formState.selectedAthlete === null
        }
        isInvalid={
          (validateForm && !formState.selectedDate) ||
          !!responseErrors.find((error) => error.type === 'date')
        }
        disableFuture
        kitmanDesignSystem
      />
    );
  };

  const populateSelectedFileFields = (selectedFile) => {
    const {
      annotation,
      athlete,
      attachment: { name },
      chronic_issues: chronics,
      document_categories: selectedFileCategories,
      document_date: selectedFileDate,
      illness_occurrences: illnesses,
      injury_occurrences: injuries,
    } = selectedFile;

    dispatch({
      type: 'AUTOPOPULATE_SELECTED_FILE',
      selectedAthlete: athlete.id,
      selectedDate: moment(selectedFileDate).format(dateTransferFormat),
      selectedCategories: selectedFileCategories.map((category) => category.id),
      updatedFileName: name,
      selectedIssues: [
        ...(illnesses
          ? illnesses.map((illness) => `Illness_${illness.id}`)
          : []),
        ...(injuries ? injuries.map((injury) => `Injury_${injury.id}`) : []),
        ...(chronics
          ? chronics.map((chronic) => `ChronicInjury_${chronic.id}`)
          : []),
      ],
    });

    if (annotation?.title) {
      setShowNoteSection(true);
      dispatch({
        type: 'SET_NOTE_SECTION',
        noteTitle: annotation.title,
        noteContent: annotation.content,
      });
    }
  };

  useEffect(() => {
    if (props.athleteId) {
      dispatch({
        type: 'SET_SELECTED_ATHLETE',
        selectedAthlete: props.athleteId,
      });
    }

    if (formState.selectedAthlete) onAthleteChange();

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [formState.selectedAthlete, props.athleteId]);

  useEffect(() => {
    if (formState.noteContent === emptyHTMLeditorContent) {
      dispatch({
        type: 'SET_NOTE_SECTION',
        noteTitle: formState.noteTitle,
        noteContent: '',
      });
    }
  }, [formState.noteContent]);

  useEffect(() => {
    if (
      props.isPanelOpen &&
      props.athleteConstraints?.organisationStatus === 'CURRENT_ATHLETE'
    ) {
      dispatch({
        type: 'SET_SELECTED_DATE',
        selectedDate: moment().format(dateTransferFormat),
      });
    }

    if (props.isPanelOpen && props.isEditing && props.selectedFile) {
      populateSelectedFileFields(props.selectedFile);
    }
  }, [props.isPanelOpen, props.isEditing]);

  return (
    <div css={style.sidePanel} data-testid="AddMedicalFileSidePanel|Parent">
      <SlidingPanelResponsive
        isOpen={props.isPanelOpen}
        title={props.isEditing ? 'Edit Document' : 'Add documents'}
        onClose={() => togglePanel()}
        width={659}
      >
        <div css={style.section}>
          <div
            css={[style.row, style['row--dualFields']]}
            data-testid="AddMedicalFileSidePanel|TopRow"
          >
            <AthleteConstraints athleteId={formState.selectedAthlete}>
              {({ organisationStatus, athleteSelector, isLoading }) => (
                <Select
                  label={props.t('Athlete')}
                  onChange={(id) => {
                    dispatch({
                      type: 'SET_SELECTED_ATHLETE',
                      selectedAthlete: id,
                    });

                    dispatch({
                      type: 'SET_SELECTED_ISSUES',
                      selectedIssues: [],
                    });
                  }}
                  value={formState.selectedAthlete}
                  options={
                    organisationStatus === 'PAST_ATHLETE'
                      ? athleteSelector
                      : props.playerOptions
                  }
                  isDisabled={
                    props.isEditing ||
                    props.athleteId !== null ||
                    requestStatus === 'PENDING' ||
                    isLoading
                  }
                  invalid={validateForm && formState.selectedAthlete === null}
                  data-testid="AthleteSelector"
                />
              )}
            </AthleteConstraints>
            {!showPlayerMovementDatePicker() && (
              <AthleteConstraints athleteId={formState.selectedAthlete}>
                {({ lastActivePeriod }) => (
                  <div>
                    <LegacyDatePicker
                      label={props.t('Date of document')}
                      value={formState.selectedDate}
                      invalid={validateForm && !formState.selectedDate}
                      disabled={
                        requestStatus === 'PENDING' ||
                        formState.selectedAthlete === null
                      }
                      onDateChange={(date) => {
                        dispatch({
                          type: 'SET_SELECTED_DATE',
                          selectedDate: moment(date).format(dateTransferFormat),
                        });
                      }}
                      maxDate={getMaxDate(lastActivePeriod.end)}
                      minDate={getMinDate(lastActivePeriod.start)}
                      data-testid="DocumentDateSelector"
                      kitmanDesignSystem
                    />
                  </div>
                )}
              </AthleteConstraints>
            )}

            {showPlayerMovementDatePicker() && renderDatePickerNew()}
          </div>

          <div css={style.row} data-testid="AddMedicalFileSidePanel|Categories">
            <Select
              label={props.t('Category')}
              onChange={(values) =>
                dispatch({
                  type: 'SET_SELECTED_CATEGORIES',
                  selectedCategories: values,
                })
              }
              options={props.categoryOptions}
              value={formState.selectedCategories}
              isMulti
              appendToBody
              invalid={
                validateForm && formState.selectedCategories.length === 0
              }
              isDisabled={requestStatus === 'PENDING'}
            />
          </div>

          {props.isEditing ? (
            <>
              <hr css={style.hr} />
              <div css={style.attachmentsHeader}>
                <h3 className="kitmanHeading--L3">
                  {props.t('Update Filename')}
                </h3>
              </div>
              <div
                css={[style.row, style['row--dualFields']]}
                data-testid="AddMedicalFileSidePanel|FileTitle"
              >
                <InputTextField
                  label={props.t('Title')}
                  value={formState.updatedFileName}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_UPDATED_FILENAME',
                      updatedFileName: e.target.value,
                    })
                  }
                  invalid={
                    validateForm && formState.updatedFileName.length === 0
                  }
                  kitmanDesignSystem
                />
              </div>
            </>
          ) : (
            <FileUploadArea
              showActionButton={false}
              areaTitle={props.t('Attach file(s)')}
              attachedFiles={formState.filesToUpload}
              updateFiles={(files) =>
                dispatch({
                  type: 'SET_FILES_TO_UPLOAD',
                  filesToUpload: files,
                })
              }
              removeFiles={props.isPanelOpen}
              isFileError={validateForm && !formState.filesToUpload.length}
              testIdPrefix="AddMedicalFileSidePanel"
              documentScanner={isScannerIntegrationAllowed()}
            />
          )}

          {showNoteSection ? (
            <>
              <hr css={style.hr} />
              <div css={style.attachmentsHeader}>
                <h3 className="kitmanHeading--L3">{props.t('Add note')}</h3>
                <div css={style.copyNoteButton}>
                  <TextButton
                    onClick={() => {
                      setShowNoteSection(false);
                      dispatch({
                        type: 'SET_NOTE_SECTION',
                        noteTitle: '',
                        noteContent: '',
                      });
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
                data-testid="AddMedicalFileSidePanel|NoteTitle"
              >
                <InputTextField
                  label={props.t('Title')}
                  value={formState.noteTitle}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_NOTE_SECTION',
                      noteTitle: e.target.value,
                      noteContent: formState.noteContent,
                    })
                  }
                  invalid={
                    validateForm &&
                    showNoteSection &&
                    !formState.noteTitle &&
                    !!formState.noteContent
                  }
                  kitmanDesignSystem
                />
              </div>

              <div
                css={style.row}
                data-testid="AddMedicalFileSidePanel|NoteInput"
              >
                <div
                  css={uploadedFilesErrorStyle(
                    validateForm &&
                      showNoteSection &&
                      !!formState.noteTitle &&
                      !formState.noteContent
                  )}
                >
                  <RichTextEditor
                    onChange={(content) =>
                      dispatch({
                        type: 'SET_NOTE_SECTION',
                        noteTitle: formState.noteTitle,
                        noteContent: content,
                      })
                    }
                    value={formState.noteContent}
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
          <div css={style.row} data-testid="AddMedicalFileSidePanel|Injuries">
            <Select
              label={props.t('Associated injury/illness')}
              onChange={(ids) =>
                dispatch({ type: 'SET_SELECTED_ISSUES', selectedIssues: ids })
              }
              options={props.athleteIssues}
              value={formState.selectedIssues}
              isDisabled={
                formState.selectedAthlete === null ||
                requestStatus === 'PENDING'
              }
              appendToBody
              optional={props.issueId === null}
              isMulti
            />
          </div>
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={() => (props.isEditing ? onEdit() : onSave())}
            text={props.isEditing ? props.t('Update') : props.t('Save')}
            type="primary"
            isDisabled={!permissions.medical.documents.canCreate}
            isLoading={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive>
      <ToastDialog toasts={props.toasts} onCloseToast={removeToast} />
    </div>
  );
};

export const AddMedicalFileSidePanelTranslated = withNamespaces()(
  AddMedicalFileSidePanel
);
export default AddMedicalFileSidePanel;
