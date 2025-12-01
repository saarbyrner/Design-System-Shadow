// @flow
import { useEffect, useState, useRef } from 'react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { withNamespaces } from 'react-i18next';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import moment from 'moment';
import { saveMedicalNote, uploadFile, getLastNote } from '@kitman/services';
import {
  AppStatus,
  DatePicker,
  FileUploadArea,
  InputTextField,
  SlidingPanelResponsive,
  RichTextEditorAlt,
  Select,
  TextButton,
  TooltipMenu,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import SquadSelector from '@kitman/modules/src/Medical/shared/components/SquadSelector';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { OrganisationStatus } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import {
  checkInvalidFileTitles,
  transformFilesForUpload,
} from '@kitman/common/src/utils/fileHelper';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { isCanceledError } from '@kitman/common/src/utils/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import useAthletesIssues from '../../hooks/useAthletesIssues';
import useMedicalNoteForm from './hooks/useMedicalNoteForm';
import { useIssue } from '../../contexts/IssueContext';
import { useProcedure } from '../../contexts/ProcedureContext';
import { useDiagnostic } from '../../contexts/DiagnosticContext';
import useDiagnostics from '../../hooks/useDiagnostics';
import useProcedures from '../../hooks/useProcedures';
import {
  getIssueIds,
  getFormattedIssueIds,
  getRestricVisibilityValue,
  emptyHTMLeditorAltContent,
  getDefaultDiagnosticFilters,
  getDefaultProceduresFilters,
  getAnnotationableRequiredField,
} from '../../utils';
import type {
  RequestStatus,
  DiagnosticFilter,
  ProceduresFilter,
} from '../../types';
import type { StaffUserSelectOption } from '../../types/medical/StaffUsers';
import style from '../styles/forms';
import AthleteConstraints from '../AthleteConstraints';
import {
  handleNoteVisibilityAllowList,
  handleNoteVisibilityChange,
  transformNoteVisibilityOptions,
} from '../MedicalNotesTab/components/MedicalNoteCard/ConfidentialNotesVisibility/utils';

type Props = {
  currentUser?: CurrentUserData,
  athleteConstraints?: { organisationStatus: OrganisationStatus },
  isOpen: boolean,
  isAthleteSelectable: boolean,
  annotationTypes: Array<Option>,
  squadAthletes: Array<Option>,
  staffUsers: Array<StaffUserSelectOption>,
  defaultAnnotationType: number,
  athleteId?: ?number,
  isDuplicatingNote: boolean,
  duplicateNote: MedicalNote,
  initialDataRequestStatus: RequestStatus,
  onClose: Function,
  onSaveNote: Function,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
  documentCategoryOptions: Array<number>,
  rehabSessionIds?: ?Array<number>,
  annotationDate?: string, // If you need the date picker to default to a specific date
  disableMaxAnnotationDate?: boolean,
  setAthleteId: (athleteId: number) => void,
};

type Visibility = 'DOCTORS' | 'PSYCH_TEAM' | 'DEFAULT';

const AddMedicalNoteSidePanel = (props: I18nProps<Props>) => {
  const editorRef = useRef(null);
  const { permissions } = usePermissions();
  const { issue, issueType, isChronicIssue } = useIssue();
  const { id: issueId } = issue;
  const { procedures, fetchProcedures } = useProcedures();
  const { procedure: singleProcedure } = useProcedure();
  const { diagnostics, fetchDiagnostics } = useDiagnostics();
  const { diagnostic: singleDiagnostic } = useDiagnostic();
  const shouldInheritNoteName =
    window.featureFlags['medical-note-inherit-name'];

  const [diagnosticFilters, setDiagnosticFilters] = useState<DiagnosticFilter>(
    getDefaultDiagnosticFilters({
      athleteId: props.athleteId || null,
      issueType: issueType || null,
      issueId: issueId || null,
    })
  );
  const [procedureFilters, setProcedureFilters] = useState<ProceduresFilter>(
    getDefaultProceduresFilters({
      athleteId: props.athleteId || null,
      issueType: issueType || null,
      issueId: issueId || null,
    })
  );

  const diagnosticAnnotationableID = props.annotationTypes
    ? props.annotationTypes?.find((annotationType) => {
        return (
          annotationType.type === 'OrganisationAnnotationTypes::Diagnostic'
        );
      })?.value
    : null;

  const procedureAnnotationableID = props.annotationTypes
    ? props.annotationTypes?.find((annotationType) => {
        return annotationType.type === 'OrganisationAnnotationTypes::Procedure';
      })?.value
    : null;

  const rehabSessionAnnotationID = props.annotationTypes
    ? props.annotationTypes?.find((annotationType) => {
        return (
          annotationType.type === 'OrganisationAnnotationTypes::RehabSession'
        );
      })?.value
    : null;

  const [shownFileAttachmentSections, setShownFileAttachmentSections] =
    useState<Array<'FILE'>>([]);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const [copyLastNoteRequestStatus, setCopyLastNoteRequestStatus] =
    useState<RequestStatus>(null);
  const [copyLastNoteFeedbackText, setCopyLastNoteFeedbackText] =
    useState(null);

  const [unUploadedFiles, setUnUploadedFiles] = useState<Array<AttachedFile>>(
    []
  );
  const [isSelectedNoteTypeDocument, setIsSelectedNoteTypeDocument] =
    useState(false);
  const [isCustomTitle, setIsCustomTitle] = useState(false);
  const { trackEvent } = useEventTracking();

  const getDocumentNoteTypeId = props.annotationTypes
    ? props.annotationTypes.find(
        (annotationType) =>
          annotationType.type === 'OrganisationAnnotationTypes::Document'
      )?.value
    : null;

  const { athleteIssues, fetchAthleteIssues } = useAthletesIssues(
    props.isOpen ? props.athleteId : null
  );

  const handleAnnotationableId = () => {
    return props.duplicateNote?.annotationable_type === 'Diagnostic'
      ? props.duplicateNote.annotationable.athlete.id
      : props.duplicateNote.annotationable.id;
  };

  const getVisibility = (): Visibility => {
    if (props.duplicateNote.restricted_to_doc) return 'DOCTORS';
    if (props.duplicateNote.restricted_to_psych) return 'PSYCH_TEAM';
    return 'DEFAULT';
  };

  const getMedicalNoteType = (typeId: number) =>
    props.annotationTypes.find((type) => type.value === typeId);

  const defaultFormValues = {
    medicalNoteType:
      props.duplicateNote?.organisation_annotation_type?.id ||
      props.defaultAnnotationType,
    athlete_id: props.duplicateNote?.annotationable
      ? props.duplicateNote.annotationable.id
      : props.athleteId,
    diagnostic_id: props.duplicateNote?.diagnostic?.id || null,
    annotationable_id: props.duplicateNote?.id || props.athleteId || null,
    title: props.duplicateNote?.title || '',
    annotationDate: props.annotationDate, // NOTE: date from props.duplicateNote is not used
    noteContent: props.duplicateNote?.content || emptyHTMLeditorAltContent,
    visibility: props.duplicateNote ? getVisibility() : 'DEFAULT',
    illnessIds:
      props.duplicateNote?.illness_occurrences.map((illness) => illness.id) ||
      [],
    injuryIds:
      props.duplicateNote?.injury_occurrences.map((injury) => injury.id) || [],
    chronicIds: [],
    attachments: [],
    rehabSessionIds: props.rehabSessionIds,
    author_id: null,
    note_visibility_ids: [],
    squad_id: null,
  };

  const { formState, dispatch } = useMedicalNoteForm(defaultFormValues);

  const allowConfidentialNote =
    permissions.medical.privateNotes.canCreate &&
    window.featureFlags['confidential-notes'] &&
    formState.annotationable_type !== 'Diagnostic';

  useEffect(() => {
    /**
     * Preload the Associated injury/ illness drop-down with
     * issue that it has been toggled open from. Github issue: #18660
     */
    if (props.isOpen && issue.id && issueType) {
      const issueIds = [issue.id];
      if (props.duplicateNote?.annotationable_type === 'Diagnostic') {
        fetchDiagnostics(
          { ...diagnosticFilters, athlete_id: props.athleteId },
          true
        )
          .then(() => {
            setRequestStatus('SUCCESS');
          })
          .catch((error) =>
            isCanceledError(error)
              ? setRequestStatus('PENDING')
              : setRequestStatus('FAILURE')
          );
      }
      if (isChronicIssue) {
        dispatch({ type: 'SET_CHRONIC_IDS', chronicIds: issueIds });
      } else if (issueType === 'Injury') {
        dispatch({ type: 'SET_INJURY_IDS', injuryIds: issueIds });
      } else if (issueType === 'Illness') {
        dispatch({ type: 'SET_ILLNESS_IDS', illnessIds: issueIds });
      }
      return;
    }

    if (
      props.isOpen &&
      allowConfidentialNote &&
      !props.duplicateNote &&
      !formState.note_visibility_ids?.length
    ) {
      dispatch({
        type: 'SET_NOTE_VISIBILITY_IDS',
        noteVisibilityIds: [{ label: props.t('All'), value: null }],
      });
    }

    // Default <DatePicker /> to today's date for current athletes, on initial open
    if (
      props.isOpen &&
      props.athleteConstraints?.organisationStatus === 'CURRENT_ATHLETE'
    ) {
      dispatch({
        type: 'SET_DATE',
        date: moment().format(dateTransferFormat),
      });

      return;
    }

    setIsValidationCheckAllowed(false);
    setCopyLastNoteRequestStatus(null);
    setUnUploadedFiles([]);
    editorRef.current?.setContent('');
    dispatch({
      type: 'CLEAR_FORM',
      defaultFormValues,
    });
  }, [props.isOpen]);

  useEffect(() => {
    if (props.athleteId) {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: props.athleteId,
      });
      return;
    }
    dispatch({
      type: 'CLEAR_FORM',
      defaultFormValues,
    });
  }, [props.athleteId]);

  useEffect(() => {
    dispatch({
      type: 'CLEAR_FORM',
      defaultFormValues,
    });
  }, [props.rehabSessionIds, props.annotationDate]);

  useEffect(() => {
    const medicalNoteTypeId =
      props.duplicateNote?.organisation_annotation_type?.id ||
      formState.organisation_annotation_type_id ||
      props.defaultAnnotationType;
    const medicalNoteType = getMedicalNoteType(medicalNoteTypeId);

    dispatch({
      type: 'SET_MEDICAL_NOTE_TYPE_ID',
      medicalNoteTypeId,
    });

    if (medicalNoteType && shouldInheritNoteName) {
      dispatch({
        type: 'SET_TITLE',
        title: medicalNoteType.label,
      });
    }
  }, [props.annotationTypes, props.defaultAnnotationType, props.duplicateNote]);

  // Prepopulate note fields specific to Procedures & Diagnostics
  useEffect(() => {
    if (
      props.isOpen &&
      props.athleteId &&
      singleDiagnostic.id &&
      diagnosticAnnotationableID
    ) {
      dispatch({
        type: 'SET_ANNOTATIONABLE_TYPE',
        annotationableType: 'Diagnostic',
      });

      dispatch({
        type: 'SET_MEDICAL_NOTE_TYPE_ID',
        medicalNoteTypeId: diagnosticAnnotationableID,
      });

      fetchDiagnostics({ ...diagnosticFilters }, true)
        .then(() => setRequestStatus('SUCCESS'))
        .catch((error) =>
          isCanceledError(error)
            ? setRequestStatus('PENDING')
            : setRequestStatus('FAILURE')
        );

      dispatch({
        type: 'SET_DIAGNOSTIC_ID',
        diagnosticId: singleDiagnostic?.id,
      });
    }

    if (
      props.isOpen &&
      props.athleteId &&
      singleProcedure.id &&
      procedureAnnotationableID
    ) {
      dispatch({
        type: 'SET_ANNOTATIONABLE_TYPE',
        annotationableType: 'Emr::Private::Models::Procedure',
      });

      dispatch({
        type: 'SET_MEDICAL_NOTE_TYPE_ID',
        medicalNoteTypeId: procedureAnnotationableID,
      });

      fetchProcedures({ ...procedureFilters }, true)
        .then(() => setRequestStatus('SUCCESS'))
        .catch(() => setRequestStatus('FAILURE'));

      dispatch({
        type: 'SET_PROCEDURE_ID',
        procedureId: singleProcedure?.id,
      });
    }
  }, [
    props.isOpen,
    props.athleteId,
    props.annotationTypes,
    procedureAnnotationableID,
    diagnosticAnnotationableID,
    singleProcedure,
    singleDiagnostic,
  ]);

  useEffect(() => {
    if (
      (formState.annotationable_type !== 'Diagnostic' ||
        !formState.diagnostic_id ||
        !diagnostics.length) &&
      (formState.annotationable_type !== 'Emr::Private::Models::Procedure' ||
        !formState.procedure_id ||
        !procedures.length)
    ) {
      return;
    }

    let entity = [];
    if (formState.diagnostic_id) {
      entity = diagnostics.filter(
        (diag) => diag.id === formState.diagnostic_id
      );
    } else if (formState.procedure_id) {
      entity = procedures.filter((proc) => proc.id === formState.procedure_id);
    }

    dispatch({
      type: 'SET_CHRONIC_IDS',
      chronicIds:
        entity[0]?.chronic_issues?.map((chronicIssue) => chronicIssue.id) || [],
    });

    const injuryIssuesIds =
      entity[0]?.issue_occurrences
        ?.filter((issueOccurence) => issueOccurence.issue_type === 'Injury')
        .map((i) => i.id) || [];

    dispatch({
      type: 'SET_INJURY_IDS',
      injuryIds: injuryIssuesIds,
    });

    const illnessIssuesIds =
      entity[0]?.issue_occurrences
        ?.filter((issueOccurence) => issueOccurence.issue_type === 'Illness')
        .map((i) => i.id) || [];

    dispatch({
      type: 'SET_ILLNESS_IDS',
      illnessIds: illnessIssuesIds,
    });
  }, [
    formState.diagnostic_id,
    diagnostics,
    formState.procedure_id,
    procedures,
  ]);

  const onAthleteChange = (athleteId: number) => {
    // Abort if the user has selected the same athlete
    if (formState.athlete_id === athleteId) {
      return;
    }

    setDiagnosticFilters({ ...diagnosticFilters, athlete_id: athleteId });
    setProcedureFilters({ ...procedureFilters, athlete_ids: [athleteId] });

    dispatch({ type: 'SET_ATHLETE_ID', athleteId });

    props.setAthleteId(athleteId);

    setRequestIssuesStatus('PENDING');

    fetchDiagnostics(
      { ...diagnosticFilters, athlete_id: athleteId || null },
      true
    )
      .then(() => {
        setRequestStatus('SUCCESS');
      })
      .catch((error) =>
        isCanceledError(error)
          ? setRequestStatus('PENDING')
          : setRequestStatus('FAILURE')
      );
    fetchProcedures(
      { ...procedureFilters, athlete_ids: [athleteId || null] },
      true
    )
      .then(() => {
        setRequestStatus('SUCCESS');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });

    fetchAthleteIssues(athleteId)
      .then(() => {
        setRequestIssuesStatus(null);
      })
      .catch(() => {
        setRequestIssuesStatus('FAILURE');
      });
  };

  const injectDuplicateNote = () => {
    dispatch({
      type: 'SET_ATHLETE_ID',
      athleteId: handleAnnotationableId(),
    });
    dispatch({ type: 'SET_CONTENT', content: props.duplicateNote.content });

    dispatch({
      type: 'SET_MEDICAL_NOTE_TYPE_ID',
      medicalNoteTypeId: props.duplicateNote?.organisation_annotation_type?.id,
    });
    dispatch({
      type: 'SET_ANNOTATIONABLE_TYPE',
      annotationableType: props.duplicateNote?.annotationable_type,
    });

    if (allowConfidentialNote && props.currentUser) {
      dispatch({
        type: 'SET_NOTE_VISIBILITY_IDS',
        noteVisibilityIds: handleNoteVisibilityAllowList(
          props.duplicateNote,
          props.currentUser
        ),
      });
    }

    if (props.duplicateNote?.annotationable_type === 'Diagnostic') {
      fetchDiagnostics(
        { ...diagnosticFilters, athlete_id: props.athleteId },
        true
      )
        .then(() => {
          setRequestStatus('SUCCESS');
        })
        .catch((error) =>
          isCanceledError(error)
            ? setRequestStatus('PENDING')
            : setRequestStatus('FAILURE')
        );
      dispatch({
        type: 'SET_DIAGNOSTIC_ID',
        diagnosticId: props.duplicateNote?.annotationable.id,
      });
    }
    onAthleteChange(handleAnnotationableId());
    editorRef.current?.setContent(props.duplicateNote.content);
  };

  useEffect(() => {
    if (props.duplicateNote && props.isOpen) {
      injectDuplicateNote();
    }
  }, [props.duplicateNote, props.isOpen]);

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

  /**
   * Filter and map staff for lastname first, selection
   */
  const filteredStaff = (
    staffList: Array<StaffUserSelectOption>
  ): Array<Option> => {
    return (
      staffList
        .filter((item) => item.value !== props.currentUser?.id)
        .map(({ value, firstname, lastname }) => ({
          value,
          label: `${lastname}, ${firstname}`,
        }))
        .sort((a, b) => {
          return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
        }) || []
    );
  };

  const onSave = () => {
    setIsValidationCheckAllowed(true);
    const requiredFields = [
      formState.title,
      formState.annotation_date,
      formState.squad_id,
      getAnnotationableRequiredField(formState),
    ];

    const isMedicalNoteInvalid =
      formState.content === emptyHTMLeditorAltContent;

    const isDocumentCategoriesInvalid =
      isSelectedNoteTypeDocument &&
      formState.document_note_category_ids?.length === 0;

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    if (
      !allRequiredFieldsAreValid ||
      isMedicalNoteInvalid ||
      isDocumentCategoriesInvalid ||
      (shownFileAttachmentSections.includes('FILE') &&
        checkInvalidFileTitles(unUploadedFiles))
    ) {
      return;
    }

    const transformedAttachments = transformFilesForUpload(unUploadedFiles);

    setRequestStatus('PENDING');

    saveMedicalNote({
      ...formState,
      annotation_date: formState.annotation_date,
      athlete_active_period: formState.lastActivePeriod
        ? formState.lastActivePeriod
        : null,
      annotationable_id:
        // eslint-disable-next-line no-nested-ternary
        formState.annotationable_type === 'Diagnostic'
          ? formState.diagnostic_id
          : formState.annotationable_type === 'Emr::Private::Models::Procedure'
          ? formState.procedure_id
          : formState.athlete_id,
      attachments_attributes: transformedAttachments,
      ...(allowConfidentialNote &&
        formState.note_visibility_ids?.filter((allowed) => allowed.value)
          .length && {
          allow_list: formState.note_visibility_ids?.map(
            (allowed) => allowed.value
          ),
        }),
      squad_id: formState.squad_id,
    })
      .then((response) => {
        trackEvent(
          props.isDuplicatingNote
            ? performanceMedicineEventNames.duplicatedMedicalNote
            : performanceMedicineEventNames.createdMedicalNote,
          determineMedicalLevelAndTab()
        );

        const unConfirmedFiles =
          response.attachments?.filter((file) => file.confirmed === false) ||
          [];
        if (unConfirmedFiles.length > 0) {
          uploadFiles(unConfirmedFiles);
        }
        setRequestStatus(null);
        props.onSaveNote();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const copyLastNote = () => {
    if (!formState.annotationable_id) return;

    setCopyLastNoteRequestStatus('PENDING');
    getLastNote(
      // $FlowFixMe formState.annotationable_id exists at this point
      formState.annotationable_id,
      formState.organisation_annotation_type_id
    )
      .then((lastNote) => {
        setCopyLastNoteRequestStatus(null);

        if (lastNote) {
          const LastNoteMeta = props.t('Copied from note: {{date}}', {
            date: DateFormatter.formatStandard({
              date: moment(lastNote.annotation_date),
            }),
          });
          const note = `[${LastNoteMeta}] ${lastNote.content}`;

          dispatch({ type: 'SET_CONTENT', content: note });
          editorRef.current?.setContent(note);

          setCopyLastNoteFeedbackText(props.t('Previous note copied'));
        } else {
          setCopyLastNoteFeedbackText(props.t('No previous note found'));
        }

        // Reset the feedback text after a few seconds
        setTimeout(() => {
          setCopyLastNoteFeedbackText(null);
        }, 2000);
      })
      .catch(() => setCopyLastNoteRequestStatus('FAILURE'));
  };

  const getFormTitle = () => {
    return props.isDuplicatingNote
      ? props.t('Duplicate medical note')
      : props.t('Add medical note');
  };

  const getDiagnosticOptions = (diagnosticOptions) => {
    return diagnosticOptions.map((diagnostic) => ({
      value: diagnostic.id,
      label: `${DateFormatter.formatStandard({
        date: moment(diagnostic.diagnostic_date),
      })} - ${diagnostic.type} - ${
        diagnostic?.location?.name
          ? diagnostic?.location?.name
          : 'no affiliated location'
      } - ${
        diagnostic?.issue_occurrences?.length > 0
          ? `${
              diagnostic?.diagnostic_reason?.name
            }: ${diagnostic.issue_occurrences
              .map((diagnosticIssue) => {
                return ` ${diagnosticIssue.full_pathology}`;
              })
              .toString()}`
          : diagnostic?.diagnostic_reason?.name
      } `,
    }));
  };

  const getProceduresOptions = (procedureOptions) => {
    return procedureOptions.map((procedure) => {
      return {
        value: procedure.id,
        label: `${DateFormatter.formatStandard({
          date: moment(procedure.order_date),
        })} - ${procedure.procedure_type.name} - ${
          procedure?.location?.name
            ? procedure?.location?.name
            : 'no affiliated location'
        } - ${
          procedure?.issue_occurrences?.length > 0
            ? `${
                procedure?.procedure_reason?.name
              }: ${procedure.issue_occurrences
                .map((procedureIssue) => {
                  return ` ${procedureIssue.full_pathology}`;
                })
                .toString()}`
            : procedure?.procedure_reason?.name
        } `,
      };
    });
  };

  const getAssociatedInjuryIllnessValues = () => {
    const chronicIssueIds = formState.chronic_issue_ids || [];
    return getFormattedIssueIds(
      formState.injury_occurrence_ids,
      formState.illness_occurrence_ids,
      chronicIssueIds
    );
  };

  const renderPlayerSelector = () => {
    return (
      <AthleteConstraints athleteId={formState.athlete_id}>
        {({ organisationStatus, athleteSelector, isLoading }) => (
          <Select
            label={props.t('Athlete')}
            onChange={onAthleteChange}
            value={formState.athlete_id}
            options={
              organisationStatus === 'PAST_ATHLETE'
                ? athleteSelector
                : props.squadAthletes
            }
            isDisabled={
              (!props.isAthleteSelectable && !!props.athleteId) ||
              isLoading ||
              requestStatus === 'PENDING'
            }
            invalid={isValidationCheckAllowed && !formState.athlete_id}
          />
        )}
      </AthleteConstraints>
    );
  };

  const renderSquadSelector = () => (
    <SquadSelector
      label={props.t('Occurred in Squad')}
      athleteId={formState.athlete_id}
      fetchData={props.isOpen}
      value={formState.squad_id}
      onChange={(squadId) => {
        dispatch({
          type: 'SET_SQUAD_ID',
          squadId,
        });
      }}
      isInvalid={isValidationCheckAllowed && !formState.squad_id}
      isOpen={props.isOpen}
      requestStatus={requestStatus}
      prePopulate
    />
  );

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const getMaxDate = (endDate) => {
    return endDate;
  };
  const getMinDate = (startDate) => {
    return startDate;
  };

  const renderDatePicker = () => {
    return (
      <AthleteConstraints
        athleteId={formState.athlete_id}
        disableMaxDate={
          props.disableMaxAnnotationDate ||
          formState.organisation_annotation_type_id === rehabSessionAnnotationID
        }
      >
        {({ lastActivePeriod, isLoading }) => (
          <div data-testid="AddMedicalNoteSidePanel|MedicalNoteDate">
            <DatePicker
              label={props.t('Date')}
              value={formState.annotation_date}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_DATE',
                  date: moment(date).format(dateTransferFormat),
                });
              }}
              maxDate={getMaxDate(lastActivePeriod.end)}
              minDate={getMinDate(lastActivePeriod.start)}
              disabled={requestStatus === 'PENDING' || isLoading}
              invalid={isValidationCheckAllowed && !formState.annotation_date}
              kitmanDesignSystem
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderDatePickerNew = () => {
    return (
      <div data-testid="AddMedicalNoteSidePanel|MedicalNoteDate">
        <MovementAwareDatePicker
          athleteId={formState.athlete_id || undefined}
          value={moment(formState.annotation_date)}
          onChange={(date) => {
            dispatch({
              type: 'SET_DATE',
              date: moment(date).format(dateTransferFormat),
            });
          }}
          inputLabel={props.t('Date')}
          isInvalid={isValidationCheckAllowed && !formState.annotation_date}
          disableFuture
          kitmanDesignSystem
        />
      </div>
    );
  };

  return (
    <div css={style.sidePanel} data-testid="AddMedicalNoteSidePanel|Parent">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={getFormTitle()}
        onClose={() => props.onClose()}
        width={659}
      >
        <div css={style.section}>
          <div
            css={[style.row, style['row--dualFields']]}
            data-testid="AddMedicalNoteSidePanel|TopRow"
          >
            <Select
              label={props.t('Type')}
              onChange={(id) => {
                const medicalNoteType = getMedicalNoteType(id);
                dispatch({
                  type: 'SET_MEDICAL_NOTE_TYPE_ID',
                  medicalNoteTypeId: id,
                });
                dispatch({
                  type: 'SET_ANNOTATIONABLE_TYPE',
                  annotationableType:
                    // eslint-disable-next-line no-nested-ternary
                    id === diagnosticAnnotationableID
                      ? 'Diagnostic'
                      : id === procedureAnnotationableID
                      ? 'Emr::Private::Models::Procedure'
                      : 'Athlete',
                });
                if (
                  id === diagnosticAnnotationableID &&
                  (props.athleteId || formState.athlete_id)
                ) {
                  fetchDiagnostics({ ...diagnosticFilters }, true)
                    .then(() => {
                      setRequestStatus('SUCCESS');
                    })
                    .catch((error) =>
                      isCanceledError(error)
                        ? setRequestStatus('PENDING')
                        : setRequestStatus('FAILURE')
                    );
                }
                if (
                  id === procedureAnnotationableID &&
                  (props.athleteId || formState.athlete_id)
                ) {
                  fetchProcedures({ ...procedureFilters }, true)
                    .then(() => {
                      setRequestStatus('SUCCESS');
                    })
                    .catch(() => {
                      setRequestStatus('FAILURE');
                    });
                }
                if (id === getDocumentNoteTypeId) {
                  setIsSelectedNoteTypeDocument(true);
                } else {
                  setIsSelectedNoteTypeDocument(false);
                }
                if (
                  !isCustomTitle &&
                  shouldInheritNoteName &&
                  medicalNoteType
                ) {
                  dispatch({
                    type: 'SET_TITLE',
                    title: medicalNoteType.label,
                  });
                }
              }}
              options={props.annotationTypes}
              value={formState.organisation_annotation_type_id}
              isDisabled={
                requestStatus === 'PENDING' ||
                props.initialDataRequestStatus === 'PENDING'
              }
            />
            {renderPlayerSelector()}
          </div>
          {isSelectedNoteTypeDocument && (
            <div
              css={style.row}
              data-testid="AddMedicalNoteSidePanel|DocumentNoteTypeRow"
            >
              <Select
                label={props.t('Categories')}
                onChange={(categoryIds) => {
                  dispatch({
                    type: 'SET_DOCUMENT_NOTE_CATEGORY_IDS',
                    categoryIds,
                  });
                }}
                value={formState.document_note_category_ids}
                options={props.documentCategoryOptions}
                isMulti
                invalid={
                  isValidationCheckAllowed &&
                  isSelectedNoteTypeDocument &&
                  formState.document_note_category_ids?.length === 0
                }
              />
            </div>
          )}
          <div
            css={[style.row, style['row--dualFields']]}
            data-testid="AddMedicalNoteSidePanel|SecondRow"
          >
            <InputTextField
              label={props.t('Title')}
              value={formState.title}
              onChange={(e) => {
                dispatch({ type: 'SET_TITLE', title: e.target.value });
                setIsCustomTitle(true);
              }}
              invalid={isValidationCheckAllowed && !formState.title}
              disabled={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />

            {showPlayerMovementDatePicker()
              ? renderDatePickerNew()
              : renderDatePicker()}
          </div>
          {window.featureFlags['note-author-field'] && (
            <div
              css={[style.row, style['row--dualFields']]}
              data-testid="AddMedicalNoteSidePanel|ThirdRow"
            >
              <Select
                label={props.t('On behalf of')}
                onChange={(userId) =>
                  dispatch({
                    type: 'SET_AUTHOR_ID',
                    userId,
                  })
                }
                value={formState.author_id}
                options={props.staffUsers}
                isDisabled={requestStatus === 'PENDING'}
                optional
              />
            </div>
          )}
          <div
            css={[style.row, style['row--dualFields']]}
            data-testid="AddMedicalNoteSidePanel|FourthRow"
          >
            {renderSquadSelector()}
          </div>
          <div css={style.row} data-testid="AddMedicalNoteSidePanel|NoteInput">
            <div css={style.copyNoteButton}>
              <TextButton
                onClick={() => copyLastNote()}
                text={copyLastNoteFeedbackText || props.t('Copy last note')}
                type="link"
                disabled={
                  requestStatus === 'PENDING' ||
                  copyLastNoteRequestStatus === 'PENDING' ||
                  copyLastNoteFeedbackText ||
                  !formState.annotationable_id
                }
                kitmanDesignSystem
              />
            </div>
            <RichTextEditorAlt
              forwardedRef={editorRef}
              label={props.t('S.O.A.P notes')}
              onChange={(content) => dispatch({ type: 'SET_CONTENT', content })}
              isInvalid={
                isValidationCheckAllowed &&
                (!formState.content ||
                  formState.content === emptyHTMLeditorAltContent)
              }
              isDisabled={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
          </div>
          {formState.annotationable_type !== 'Diagnostic' &&
            formState.annotationable_type !==
              'Emr::Private::Models::Procedure' && (
              <div css={style.row} data-testid="AddMedicalNoteSidePanel|Issues">
                <Select
                  label={props.t('Associated injury/ illness')}
                  onChange={(ids) => {
                    const illnessIds = getIssueIds('Illness', ids);
                    const injuryIds = getIssueIds('Injury', ids);
                    const chronicIds = getIssueIds('ChronicInjury', ids);

                    dispatch({ type: 'SET_ILLNESS_IDS', illnessIds });
                    dispatch({ type: 'SET_INJURY_IDS', injuryIds });
                    dispatch({ type: 'SET_CHRONIC_IDS', chronicIds });
                  }}
                  options={athleteIssues}
                  value={getAssociatedInjuryIllnessValues()}
                  isDisabled={
                    !formState.athlete_id ||
                    requestStatus === 'PENDING' ||
                    requestIssuesStatus === 'PENDING'
                  }
                  optional
                  isMulti
                  appendToBody
                />
              </div>
            )}
          {formState.annotationable_type === 'Diagnostic' && (
            <div
              css={style.row}
              data-testid="AddMedicalNoteSidePanel|Diagnostic"
            >
              <Select
                label={props.t('Associated diagnostic')}
                onChange={(id) => {
                  dispatch({ type: 'SET_DIAGNOSTIC_ID', diagnosticId: id });
                }}
                options={getDiagnosticOptions(diagnostics)}
                value={formState.diagnostic_id}
                isDisabled={
                  !formState.athlete_id ||
                  formState.annotationable_type !== 'Diagnostic' ||
                  requestStatus === 'PENDING' ||
                  requestIssuesStatus === 'PENDING'
                }
                invalid={isValidationCheckAllowed && !formState.diagnostic_id}
              />
            </div>
          )}
          {formState.annotationable_type ===
            'Emr::Private::Models::Procedure' && (
            <div
              css={style.row}
              data-testid="AddMedicalNoteSidePanel|Procedure"
            >
              <Select
                label={props.t('Associated procedure')}
                onChange={(id) => {
                  dispatch({ type: 'SET_PROCEDURE_ID', procedureId: id });
                }}
                options={getProceduresOptions(procedures)}
                value={formState.procedure_id}
                isDisabled={
                  !formState.athlete_id ||
                  formState.annotationable_type !==
                    'Emr::Private::Models::Procedure' ||
                  requestStatus === 'PENDING' ||
                  requestIssuesStatus === 'PENDING'
                }
                invalid={isValidationCheckAllowed && !formState.procedure_id}
              />
            </div>
          )}
          <div css={style.row}>
            {allowConfidentialNote ? (
              <div data-testid="AddMedicalNoteSidePanel|ConfidentialNotesVisibility">
                <Select
                  label={props.t('Visibility')}
                  onChange={(value) => {
                    dispatch({
                      type: 'SET_NOTE_VISIBILITY_IDS',
                      noteVisibilityIds: handleNoteVisibilityChange(
                        value,
                        props.currentUser
                      ),
                    });
                  }}
                  value={formState.note_visibility_ids || []}
                  options={transformNoteVisibilityOptions(
                    props.currentUser,
                    filteredStaff(props.staffUsers)
                  )}
                  appendToBody
                  closeMenuOnScroll
                  groupBy="submenu"
                  menuPlacement="top"
                  isDisabled={
                    requestStatus === 'PENDING' ||
                    props.initialDataRequestStatus === 'PENDING'
                  }
                  multiSelectSubMenu
                  showSubmenuActions
                  allowClearAll
                  allowSelectAll
                />
              </div>
            ) : (
              <Select
                label={props.t('Visibility')}
                onChange={(visibilityId) =>
                  dispatch({ type: 'SET_VISIBILITY', visibilityId })
                }
                options={[
                  { value: 'DEFAULT', label: props.t('Default visibility') },
                  { value: 'DOCTORS', label: props.t('Doctors') },
                  ...(window.featureFlags['mls-emr-psych-notes']
                    ? [{ value: 'PSYCH_TEAM', label: props.t('Psych Team') }]
                    : []),
                ]}
                value={getRestricVisibilityValue(
                  formState.restricted_to_doc,
                  formState.restricted_to_psych
                )}
                isDisabled={
                  requestStatus === 'PENDING' ||
                  props.initialDataRequestStatus === 'PENDING'
                }
                appendToBody
              />
            )}
          </div>
          <hr css={style.hr} />
          {shownFileAttachmentSections.includes('FILE') && (
            <>
              <FileUploadArea
                showActionButton
                areaTitle={props.t('Attach file(s)')}
                actionIcon="icon-bin"
                attachedFiles={unUploadedFiles}
                updateFiles={setUnUploadedFiles}
                removeFiles={props.isOpen}
                testIdPrefix="AddMedicalNoteSidePanel"
                isFileError={false}
                onClickActionButton={() => {
                  dispatch({ type: 'RESET_ATTACHMENTS' });
                  setShownFileAttachmentSections(
                    (prevShownFileAttachmentSection) =>
                      prevShownFileAttachmentSection.filter(
                        (section) => section !== 'FILE'
                      )
                  );
                }}
              />
              <hr css={style.hr} />
            </>
          )}
          <div
            css={style.row}
            data-testid="AddMedicalNoteSidePanel|Attachments"
          >
            <TooltipMenu
              tooltipTriggerElement={
                <TextButton
                  text={props.t('Add')}
                  type="secondary"
                  iconAfter="icon-chevron-down"
                  kitmanDesignSystem
                />
              }
              menuItems={[
                {
                  description: props.t('File'),
                  onClick: () =>
                    setShownFileAttachmentSections(
                      (prevShownFileAttachmentSection) => [
                        ...prevShownFileAttachmentSection,
                        'FILE',
                      ]
                    ),
                },
              ]}
              placement="bottom-start"
              appendToParent
              kitmanDesignSystem
            />
          </div>
        </div>

        <div css={style.actions}>
          <TextButton
            onClick={onSave}
            text={props.t('Save')}
            type="primary"
            isDisabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </div>
        {(requestStatus === 'FAILURE' ||
          props.initialDataRequestStatus === 'FAILURE' ||
          requestIssuesStatus === 'FAILURE' ||
          copyLastNoteRequestStatus === 'FAILURE') && (
          <AppStatus status="error" />
        )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddMedicalNoteSidePanelTranslated = withNamespaces()(
  AddMedicalNoteSidePanel
);
export default AddMedicalNoteSidePanel;
