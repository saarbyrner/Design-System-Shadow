// @flow
import { useState, useEffect, useRef, useCallback } from 'react';
import { colors } from '@kitman/common/src/variables';
import type { Coding } from '@kitman/common/src/types/Coding';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import moment from 'moment';
import { formatISODate } from '@kitman/common/src/utils/dateFormatter';
import { withNamespaces } from 'react-i18next';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import {
  EditorState,
  // $FlowFixMe Draft JS issue with flow https://github.com/facebook/draft-js/issues/1974
} from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { AppStatus, SlidingPanelResponsive } from '@kitman/components';
import {
  getAthleteChronicIssues,
  getAthleteData,
  getAthleteIssue,
  getAthleteIssues,
  getAthleteContinuationIssues,
} from '@kitman/services';
import type { ActivityGroup } from '@kitman/services/src/services/medical/getActivityGroups';
import type { Grade } from '@kitman/services/src/services/medical/getGrades';
import type { Side } from '@kitman/services/src/services/medical/getSides';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { ChronicIssues } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import type { Squad } from '@kitman/services/src/services/getActiveSquad';
import type { AthleteIssues } from '@kitman/modules/src/Medical/shared/types/medical';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getActivityGroupOptions,
  getGameAndTrainingGroupedOptions,
  getSortedEventOptions,
  getPositionOptions,
  isChronicIssue,
  getAdditionalEventOptions,
  isInfoEvent,
  getEventValue,
  isV2MultiCodingSystem,
} from '@kitman/modules/src/Medical/shared/utils';
import type {
  OtherEventOption,
  DetailedGameEventOption,
  DetailedTrainingSessionEventOption,
  RequestStatus,
} from '@kitman/modules/src/Medical/shared/types';
import useIssueFields from '@kitman/modules/src/Medical/shared/hooks/useIssueFields';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import PanelActions from '@kitman/modules/src/Medical/rosters/src/containers/PanelActions';
import type {
  IssueAttachments,
  PreliminarySchema,
} from '@kitman/modules/src/Medical/rosters/types';
import DiagnosisInformation from '@kitman/modules/src/Medical/rosters/src/containers/DiagnosisInformation';
import AdditionalQuestions from '@kitman/modules/src/Medical/rosters/src/containers/AdditionalQuestions';
import AddIssueProgressTracker from '@kitman/modules/src/Medical/rosters/src/containers/AddIssueProgressTracker';
import style from './AddIssueSidePanelStyle';
import { InitialInformationTranslated as InitialInformation } from './components/InitialInformation';
import { EventInformationTranslated as EventInformation } from './components/EventInformation';

type Props = {
  preliminarySchema: PreliminarySchema,
  athleteData: AthleteData,
  activityGroups: Array<ActivityGroup>,
  activeSquad: Squad,
  attachedConcussionAssessments: Array<number>,
  currentPage: number,
  enteredInitialNote: string,
  fetchGameAndTrainingOptions: Function,
  gameOptions: Array<DetailedGameEventOption>,
  otherEventOptions: Array<OtherEventOption>,
  grades: Array<Grade>,
  initialDataRequestStatus: RequestStatus,
  isAthleteSelectable: boolean,
  isOpen: boolean,
  shouldRestoreData: boolean,
  onClose: Function,
  onAthleteDataFetchSuccess: Function,
  onSelectActivity: Function,
  onSelectAthlete: Function,
  onSelectBamicGrade: Function,
  onSelectBamicSite: Function,
  onSelectContinuationIssue: Function,
  onSelectDiagnosisDate: Function,
  onSelectExaminationDate: Function,
  onSelectEvent: Function,
  onSelectIssueType: Function,
  onSelectOnset: Function,
  onSelectPathology: Function,
  onSelectPositionWhenInjured: Function,
  onSelectPreviousIssue: Function,
  onSelectSessionCompleted: Function,
  onSelectSide: Function,
  onSelectSquad: Function,
  onSelectTimeOfInjury: Function,
  onUpdateInitialNote: Function,
  onUpdateStatusDate: Function,
  onSelectCoding: Function,
  onSetTitle: Function,
  onSelectReportedDate: Function,
  onSelectSquad: (squadId: ?number) => void,
  onSelectMechanismDescription: Function,
  onSelectPresentationType: Function,
  onUpdatePresentationFreeText: Function,
  onSelectIssueContactType: Function,
  onUpdateIssueContactFreetext: Function,
  onSelectInjuryMechanismId: Function,
  onUpdateInjuryMechanismFreetext: (string) => void,
  onUpdatePrimaryMechanismFreetext: (string) => void,
  onSelectChronicIssue: Function,
  onSelectCodingSystemPathology: Function,
  onChronicConditionOnsetDate: Function,
  selectedChronicIssue: number | string,
  chronicConditionOnsetDate: string,
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },
  positionGroups: Array<PositionGroup>,
  requestStatus: RequestStatus,
  pathologyGroupRequestStatus: RequestStatus,
  title: string,
  selectedActivity: number,
  selectedAnnotations: Array<IssueAttachments>,
  selectedAthlete: number,
  selectedCoding: Coding,
  selectedDiagnosisDate: string,
  selectedEvent: string,
  selectedEventType: string,
  selectedExaminationDate: string,
  selectedIssueType: string,
  selectedOnset: string,
  selectedPositionWhenInjured: number,
  selectedIssue: number,
  selectedSessionCompleted: string,
  selectedSide: string,
  selectedTimeOfInjury: ?moment,
  selectedReportedDate: string,
  selectedSquadId: number,
  sides: Array<Side>,
  squadAthletesOptions: Array<{
    ...Option,
    options?: Array<{
      label: string,
      value: any,
      isDisabled?: boolean,
      requiresText?: boolean,
      previous_organisation: {
        has_open_illnesses: boolean,
        has_open_injuries: boolean,
      },
    }>,
    squad_id?: number,
  }>,
  statuses: Array<{ status: string, date: string }>,
  trainingSessionOptions: Array<DetailedTrainingSessionEventOption>,
  injuryStatuses: InjuryStatuses,
  selectedMechanismDescription: string,
  selectedPresentationType: string,
  selectedPresentationTypeFreeText: string,
  selectedIssueContactType: number,
  issueContactFreetext: string,
  selectedInjuryMechanism: number,
  injuryMechanismFreetext: string,
  primaryMechanismFreetext: string,
};

const panelActionStyles = (currentPage) => ({
  alignItems: 'center',
  background: colors.p06,
  borderTop: `1px solid ${colors.neutral_300}`,
  bottom: 0,
  display: 'flex',
  height: '80px',
  justifyContent: currentPage === 1 ? 'flex-end' : 'space-between',
  padding: '24px',
  position: 'absolute',
  textAlign: 'center',
  width: '100%',
  zIndex: 1000,
});

const getEditorStateFromValue = (value) =>
  EditorState.createWithContent(stateFromHTML(value));

const useChronicIssues = (athleteId) => {
  const [chronicIssues, setChronicIssues] = useState<ChronicIssues>([]);

  useEffect(() => {
    if (athleteId != null) {
      getAthleteChronicIssues({ athleteId }).then(
        (fetchedIssues) => {
          // $FlowFixMe Flow(prop-missing)
          setChronicIssues(fetchedIssues);
        },
        () => {
          // TODO: EMR team to add error state
        }
      );
    }
  }, [athleteId]);

  return { chronicIssues };
};

const AddIssueSidePanel = (props: I18nProps<Props>) => {
  const editorRef = useRef(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const [athletePreviousIssues, setAthletePreviousIssues] =
    useState<AthleteIssues>({});
  const [
    athletePreviousOrganisationIssues,
    setAthletePreviousOrganisationIssues,
  ] = useState<AthleteIssues>({});
  const [
    isRecurrenceOutsideSystemEnabled,
    setIsRecurrenceOutsideSystemEnabled,
  ] = useState<boolean>(false);
  const [
    isContinuationOutsideSystemEnabled,
    setIsContinuationOutsideSystemEnabled,
  ] = useState<boolean>(false);
  const [previousIssuesFullyLoaded, setPreviousIssuesFullyLoaded] =
    useState(false);
  const [
    previousOrganisationIssuesFullyLoaded,
    setPreviousOrganisationIssuesFullyLoaded,
  ] = useState(true);
  const [isIssueDetailsLoading, setIsIssueDetailsLoading] = useState(false);
  const [gameAndTrainingOptions, setGameAndTrainingOptions] = useState([]);
  const [availableSquadOptions, setAvailableSquadOptions] = useState([]);
  const [showAssessmentReportSelector, setShowAssessmentReportSelector] =
    useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  const [athleteIssuesRequestStatus, setAthleteIssuesRequestStatus] =
    useState<RequestStatus>(null);
  const [
    athleteContinuationIssuesRequestStatus,
    setAthleteContinuationIssuesRequestStatus,
  ] = useState<RequestStatus>(null);

  const [uploadQueuedAttachments, setuploadQueuedAttachments] = useState(false);
  const [allowCreateIssue, setAllowCreateIssue] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const { organisation } = useOrganisation();

  const isChronicCondition = props.selectedIssueType === 'CHRONIC_INJURY';

  const issueIsAnInjury = useCallback(() => {
    return !!(
      props.selectedIssueType && props.selectedIssueType.includes('INJURY')
    );
  }, [props.selectedIssueType]);

  const issueIsAnIllness = () => {
    return !!(
      props.selectedIssueType && props.selectedIssueType.includes('ILLNESS')
    );
  };

  const issueIsARecurrence = useCallback(() => {
    return !!(
      props.selectedIssueType && props.selectedIssueType.includes('RECURRENCE')
    );
  }, [props.selectedIssueType]);

  const issueIsAContinuation = useCallback(() => {
    return !!(
      props.selectedIssueType &&
      props.selectedIssueType.includes('CONTINUATION')
    );
  }, [props.selectedIssueType]);

  const isNoPriorChronicRecorded =
    props.selectedChronicIssue === 'NoPriorChronicRecorded';

  const {
    validate: validateIssueFields,
    getFieldLabel,
    getFieldLabelByType,
    isFieldVisible,
    isFieldVisibleByType,
    fieldConfigRequestStatus,
  } = useIssueFields({
    issueType: issueIsAnInjury() ? 'injury' : 'illness',
    skip: !props.isOpen,
    serverConfig: props.preliminarySchema,
  });

  const { chronicIssues } = useChronicIssues(props.selectedAthlete);

  useEffect(() => {
    setShowAssessmentReportSelector(false);
  }, [props.isOpen]);

  useEffect(() => {
    if (props.selectedAthlete) {
      props.fetchGameAndTrainingOptions(props.selectedAthlete);
    }
  }, [props.selectedAthlete]);

  useEffect(() => {
    if (!props.selectedAthlete) return;

    if (issueIsARecurrence()) {
      setAthleteIssuesRequestStatus('PENDING');
      const type = issueIsAnInjury() ? 'injury' : 'illness';
      getAthleteIssues({
        athleteId: props.selectedAthlete,
        grouped: true,
        includeIssue: true,
        issueStatus: 'closed',
        issueType: type,
        isReccurence: true,
        limitToCurrOrg: !window.featureFlags['allow-prior-club-recurrence'],
      })
        .then((fetchedAthleteIssues) => {
          setAthletePreviousIssues(fetchedAthleteIssues);
          setIsRecurrenceOutsideSystemEnabled(
            fetchedAthleteIssues.recurrence_outside_system
          );
          setPreviousIssuesFullyLoaded(true);
          setAthleteIssuesRequestStatus('SUCCESS');
        })
        .catch(() => {
          setAthleteIssuesRequestStatus('FAILURE');
        });
    }

    if (issueIsAContinuation()) {
      setAthleteContinuationIssuesRequestStatus('PENDING');
      setPreviousOrganisationIssuesFullyLoaded(false);
      const type = issueIsAnInjury() ? 'injury' : 'illness';
      if (window.featureFlags['athlete-continuation-issues-endpoint']) {
        getAthleteContinuationIssues({
          athleteId: props.selectedAthlete,
          issueType: type,
        })
          .then((fetchedAthleteContinuationIssues) => {
            setAthletePreviousOrganisationIssues(
              fetchedAthleteContinuationIssues
            );
            setIsContinuationOutsideSystemEnabled(
              fetchedAthleteContinuationIssues.continuation_outside_system
            );
            setPreviousOrganisationIssuesFullyLoaded(true);
            setAthleteContinuationIssuesRequestStatus('SUCCESS');
          })
          .catch(() => {
            setAthleteContinuationIssuesRequestStatus('FAILURE');
          });
      } else {
        getAthleteIssues({
          athleteId: props.selectedAthlete,
          issueStatus: 'open',
          grouped: true,
          includePreviousOrganisation: true,
          issueType: type,
          limitToCurrOrg: false,
        })
          .then((fetchedAthleteIssues) => {
            setAthletePreviousOrganisationIssues(fetchedAthleteIssues);
            setIsContinuationOutsideSystemEnabled(
              fetchedAthleteIssues.continuation_outside_system
            );
            setPreviousOrganisationIssuesFullyLoaded(true);
            setAthleteContinuationIssuesRequestStatus('SUCCESS');
          })
          .catch(() => {
            setAthleteContinuationIssuesRequestStatus('FAILURE');
          });
      }
    }
  }, [
    props.selectedIssueType,
    props.selectedAthlete,
    issueIsARecurrence,
    issueIsAContinuation,
    issueIsAnInjury,
  ]);

  useEffect(() => {
    setInvalidFields([]);
    editorRef.current?.update(
      getEditorStateFromValue(
        props.shouldRestoreData ? props.enteredInitialNote : ''
      )
    );
  }, [props.isOpen]);

  useEffect(() => {
    // Filter any entries that don't have a date
    // NOTE: This will remove "Other", "Unlisted Game" and "Unlisted Training Session" entries
    const groupedOptions = getSortedEventOptions(
      getGameAndTrainingGroupedOptions({
        gameAndTrainingOptions: {
          games: props.gameOptions.filter((game) => game.game_date),
          training_sessions: props.trainingSessionOptions.filter(
            (session) => session.training_date
          ),
        },
        isChronic: isChronicIssue(props.selectedIssueType),
      })
    );

    // Add other items manually, since they don't have a date property
    groupedOptions.push({
      label: props.t('Other'),
      options: [...getAdditionalEventOptions(props.otherEventOptions || [])],
    });

    let currentEventId = null;

    currentEventId =
      [...groupedOptions.flatMap((group) => group.options || [])].find(
        (option) =>
          option.value ===
          getEventValue(props.selectedEvent, props.selectedEventType)
      )?.value || null;

    if (props.selectedEvent && currentEventId === null) {
      props.onSelectEvent(null, '');
    }

    setGameAndTrainingOptions(groupedOptions);
  }, [
    props.gameOptions,
    props.selectedDiagnosisDate,
    props.selectedEvent,
    props.trainingSessionOptions,
    props.otherEventOptions,
  ]);

  useEffect(() => {
    setAvailableSquadOptions(props.squadAthletesOptions);
  }, [props.squadAthletesOptions, props.selectedIssueType, props.athleteData]);

  // Note: 'other' is being accepted here as truthy for isInfoEvent
  const isGameOrTrainingInjury = !!(
    issueIsAnInjury() &&
    props.selectedEventType &&
    isInfoEvent(props.selectedEventType)
  );

  const checkIfFieldShouldBeValidatedAndHasValidValue = (
    value,
    field,
    subField
  ) => {
    // Check preliminarySchema for validation requirement
    if (!field || !(field in props.preliminarySchema)) {
      return true;
    }

    const fieldConfig = props.preliminarySchema[field];
    let validationRequirement = null;

    // Check if nested fields such as Event with id and type
    if (typeof fieldConfig === 'object' && subField) {
      validationRequirement = fieldConfig[subField];
    } else {
      validationRequirement = fieldConfig;
    }

    // Needs to be validated for creation flow
    if (validationRequirement === 'mandatory') {
      return value !== null && value !== '' ? value : null;
    }

    // If not mandatory, return the original value
    return true;
  };

  const formValidation = (validation) => {
    let fieldsWithError = [];
    if (props.currentPage === 1) {
      let fields = {
        issue_type: props.selectedIssueType,
        athlete_id: window.getFlag('pm-preliminary-ga')
          ? checkIfFieldShouldBeValidatedAndHasValidValue(
              props.selectedAthlete,
              'athlete',
              'id'
            )
          : props.selectedAthlete,
        occurrence_date: window.getFlag('pm-preliminary-ga')
          ? checkIfFieldShouldBeValidatedAndHasValidValue(
              props.selectedDiagnosisDate,
              'occurrence_date'
            )
          : props.selectedDiagnosisDate,
        reported_date: props.selectedReportedDate,
        ...(!isChronicCondition && {
          squad: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                props.selectedSquadId,
                'squad',
                'id'
              )
            : props.selectedSquadId,
        }),
      };

      if (
        window.featureFlags['pm-editing-examination-and-date-of-injury'] &&
        organisation.coding_system_key !== codingSystemKeys.CLINICAL_IMPRESSIONS
      ) {
        fields = {
          ...fields,
          examination_date_basic: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                props.selectedExaminationDate,
                'examination_date_basic'
              )
            : props.selectedExaminationDate,
        };
      }
      if (props.selectedIssueType === 'CHRONIC_INJURY_OCCURRENCE') {
        fields = {
          ...fields,
          linked_chronic_issues: props.selectedChronicIssue,
        };
        if (isNoPriorChronicRecorded) {
          fields = {
            ...fields,
            chronic_issue_onset_date: props.chronicConditionOnsetDate,
          };
        }
      }

      if (issueIsARecurrence()) {
        fields = {
          ...fields,
          reccurrence_id: props.selectedIssue,
        };
      }

      if (issueIsAContinuation()) {
        fields = {
          ...fields,
          continuation_issue_id: props.selectedIssue,
        };
      }

      fieldsWithError = [...validateIssueFields(fields, validation)];
    }

    if (props.currentPage === 2) {
      // NOTE: not adding key injury_type_id here as issue_occurrence_onset_id will be evaluated against the validation config
      let pageTwoFields = issueIsAnIllness()
        ? {
            illness_onset_id: window.getFlag('pm-preliminary-ga')
              ? checkIfFieldShouldBeValidatedAndHasValidValue(
                  props.selectedOnset,
                  'issue_occurrence_onset_id'
                )
              : props.selectedOnset,
          }
        : {
            issue_occurrence_onset_id: window.getFlag('pm-preliminary-ga')
              ? checkIfFieldShouldBeValidatedAndHasValidValue(
                  props.selectedOnset,
                  'issue_occurrence_onset_id'
                )
              : props.selectedOnset,
          };

      if (organisation.coding_system_key === codingSystemKeys.OSICS_10) {
        pageTwoFields = {
          ...pageTwoFields,
          primary_pathology_id: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                props.selectedCoding[codingSystemKeys.OSICS_10]
                  ?.osics_pathology_id,
                'primary_pathology',
                'id'
              )
            : props.selectedCoding[codingSystemKeys.OSICS_10]
                ?.osics_pathology_id,
          side_id: props.selectedSide,
        };
      }
      if (organisation.coding_system_key === codingSystemKeys.ICD) {
        pageTwoFields = {
          ...pageTwoFields,
          primary_pathology_id: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                props.selectedCoding[codingSystemKeys.ICD],
                'primary_pathology',
                'id'
              )
            : props.selectedCoding[codingSystemKeys.ICD],
        };
      }

      if (organisation.coding_system_key === codingSystemKeys.DATALYS) {
        pageTwoFields = {
          ...pageTwoFields,
          primary_pathology_id: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                props.selectedCoding[codingSystemKeys.DATALYS],
                'primary_pathology',
                'id'
              )
            : props.selectedCoding[codingSystemKeys.DATALYS],
        };
      }

      if (
        organisation.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS
      ) {
        const currentCodingInfo =
          props.selectedCoding[codingSystemKeys.CLINICAL_IMPRESSIONS];
        const pathologyValue =
          currentCodingInfo && Object.keys(currentCodingInfo).length === 1
            ? undefined
            : currentCodingInfo;
        pageTwoFields = {
          ...pageTwoFields,
          primary_pathology_id: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                pathologyValue,
                'primary_pathology',
                'id'
              )
            : pathologyValue,
          side_id: props.selectedSide,
        };
      }

      if (isV2MultiCodingSystem(organisation.coding_system_key)) {
        const primaryPathology = props.selectedCoding.pathologies?.[0] ?? null;

        pageTwoFields = {
          ...pageTwoFields,
          primary_pathology_id: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                primaryPathology?.id ?? null,
                'primary_pathology',
                'id'
              )
            : primaryPathology?.id ?? null,
          // NOTE: this side id will be the generic side_id when creating a chronic condition
          coding_system_side_id:
            primaryPathology?.coding_system_side_id ??
            primaryPathology?.coding_system_side?.coding_system_side_id ??
            null,
        };
      }

      if (!isChronicIssue(props.selectedIssueType)) {
        pageTwoFields = {
          ...pageTwoFields,
          events: window.getFlag('pm-preliminary-ga')
            ? checkIfFieldShouldBeValidatedAndHasValidValue(
                props.statuses,
                'statuses'
              )
            : props.statuses,
        };
      }

      if (
        issueIsAnInjury() &&
        window.featureFlags['concussion-medical-area'] &&
        showAssessmentReportSelector
      ) {
        pageTwoFields = {
          ...pageTwoFields,
          concussion_assessments: props.attachedConcussionAssessments,
        };
      }

      fieldsWithError = [...validateIssueFields(pageTwoFields, validation)];
    }

    if (props.currentPage === 3) {
      let pageThreeFields = {
        examination_date: {
          diagnosisDate: props.selectedDiagnosisDate,
          examinationDate: props.selectedExaminationDate,
        },
      };

      // Event (game_id or activity_id or training_session_id)
      if (
        !window.getFlag('pm-preliminary-ga') &&
        issueIsAnInjury() &&
        !isChronicIssue(props.selectedIssueType) &&
        !isNoPriorChronicRecorded
      ) {
        const eventField = {};
        if (!props.selectedEventType) {
          eventField.game_id = null;
        } else if (props.selectedEventType === 'game') {
          eventField.game_id = props.selectedEvent;
        } else if (props.selectedEventType === 'training') {
          eventField.training_session_id = props.selectedEvent;
        }

        const doLessValidation =
          window.featureFlags['medical-additional-event-info-events'];

        if (
          window.featureFlags['nfl-injury-flow-fields'] ||
          !doLessValidation
        ) {
          // Ensure maintain behaviour for NFL
          pageThreeFields = {
            ...pageThreeFields,
            ...eventField,
            activity_id: props.selectedActivity,
            position_when_injured_id: props.selectedPositionWhenInjured,
            presentation_type: props.selectedPresentationType,
          };
        } else if (isGameOrTrainingInjury) {
          // doLessValidation must be on
          const selectedOther = props.selectedEvent === 'other';
          pageThreeFields = {
            ...pageThreeFields,
            ...eventField,
            ...(selectedOther
              ? {
                  activity_id: props.selectedActivity,
                }
              : {
                  activity_id: props.selectedActivity,
                  position_when_injured_id: props.selectedPositionWhenInjured,
                }),
          };
        } else {
          // doLessValidation must be on
          pageThreeFields = {
            ...pageThreeFields,
            ...eventField,
          };
        }
      }

      // Event for new Preliminary Schema GA flow
      if (window.getFlag('pm-preliminary-ga')) {
        const gameId =
          props.selectedEventType === 'game' ? props.selectedEvent : true;
        const trainingSessionId =
          props.selectedEventType === 'training' ? props.selectedEvent : true;
        const gameIdField = checkIfFieldShouldBeValidatedAndHasValidValue(
          gameId,
          'game_id'
        );

        pageThreeFields = {
          ...pageThreeFields,
          game_id: gameIdField,
          training_session_id: trainingSessionId,
          activity_id: checkIfFieldShouldBeValidatedAndHasValidValue(
            props.selectedActivity,
            'activity',
            'id'
          ),
        };
      }
      fieldsWithError = [...validateIssueFields(pageThreeFields, validation)];
    }

    if (props.currentPage === 4) {
      const pageFourthFields = {
        annotations: props.selectedAnnotations,
      };

      fieldsWithError = [...validateIssueFields(pageFourthFields, validation)];
    }

    setInvalidFields(fieldsWithError);
    return fieldsWithError.length === 0;
  };

  const getAthleteOptions = (organisationStatus, athleteSelector) =>
    organisationStatus === 'PAST_ATHLETE'
      ? [
          {
            label: athleteSelector[0].label,
            value: props.selectedAthlete,
            squad_id: props.activeSquad.id,
          },
        ]
      : availableSquadOptions;

  const renderPageContentOne = () => {
    const athleteValue = props.selectedAthlete || null;

    return (
      <AthleteConstraints athleteId={props.selectedAthlete}>
        {({ lastActivePeriod, organisationStatus, athleteSelector }) => (
          <InitialInformation
            isPastAthlete={organisationStatus === 'PAST_ATHLETE'}
            issueIsARecurrence={issueIsARecurrence()}
            issueIsAContinuation={issueIsAContinuation()}
            selectedAthlete={props.selectedAthlete}
            chronicIssuesProps={{
              chronicIssues,
              onSelectChronicIssue: props.onSelectChronicIssue,
              selectedChronicIssue: props.selectedChronicIssue,
              fieldLabel: getFieldLabel('linked_chronic_issues'),
              isInvalid: invalidFields.includes('linked_chronic_issues'),
              isOnsetDateInvalid: invalidFields.includes(
                'chronic_issue_onset_date'
              ),
              chronicConditionOnsetDate: props.chronicConditionOnsetDate,
              onChronicConditionOnsetDate: (date) => {
                props.onChronicConditionOnsetDate(
                  moment(date).format('YYYY-MM-DD')
                );
              },
            }}
            issueTypeProps={{
              selectedIssueType: props.selectedIssueType,
              onSelectIssueType: props.onSelectIssueType,
              isInvalid: invalidFields.includes('issue_type'),
              fieldLabel: getFieldLabel('issue_type'),
              isVisible: isFieldVisible('issue_type'),
            }}
            permissions={props.permissions}
            athleteIDProps={{
              squadAthletesOptions: getAthleteOptions(
                organisationStatus,
                athleteSelector
              ),
              onAthleteChange: (athleteId) => {
                props.onSelectAthlete(athleteId);
                getAthleteData(athleteId).then((fetchedAthleteData) => {
                  props.onAthleteDataFetchSuccess(fetchedAthleteData);
                  props.onSelectPositionWhenInjured(
                    fetchedAthleteData.position_id
                  );
                });
              },
              value: parseInt(athleteValue, 10),
              isDisabled: !props.isAthleteSelectable && !!props.selectedAthlete,
              isInvalid: invalidFields.includes('athlete_id'),
              fieldLabel: getFieldLabel('athlete_id'),
              isVisible: isFieldVisible('athlete_id'),
            }}
            issueTitleProps={{
              setIsFocused: setIsTitleFocused,
              value: props.title || '',
              isFocused: isTitleFocused,
              onSetTitle: props.onSetTitle,
            }}
            onSelectExaminationDate={(examinationDate) => {
              props.onSelectExaminationDate(formatISODate(examinationDate));
            }}
            occurrenceDateProps={{
              isInvalid: invalidFields.includes('occurrence_date'),
              fieldLabel: getFieldLabel(
                'occurrence_date',
                issueIsAContinuation()
              ),
              isVisible: isFieldVisible('occurrence_date'),
              selectedDiagnosisDate: props.selectedDiagnosisDate,
              selectedExaminationDate: props.selectedExaminationDate,
              maxPermittedOnsetDate: lastActivePeriod.end,
              earliestPermittedOnsetDate: lastActivePeriod.start,
              onSelectOccurrenceDate: (diagnosisDate) => {
                props.onSelectDiagnosisDate(
                  moment(diagnosisDate).format('YYYY-MM-DD')
                );
                // need to update the first status date to match the onset date
                props.onUpdateStatusDate(
                  0,
                  moment(diagnosisDate).format('YYYY-MM-DD')
                );
                props.onSelectReportedDate(
                  moment(diagnosisDate).isAfter(
                    moment(props.selectedReportedDate)
                  )
                    ? moment(diagnosisDate).format('YYYY-MM-DD')
                    : props.selectedReportedDate
                );
                props.onChronicConditionOnsetDate(
                  moment(diagnosisDate).isBefore(
                    moment(props.chronicConditionOnsetDate)
                  )
                    ? moment(diagnosisDate).format('YYYY-MM-DD')
                    : props.chronicConditionOnsetDate
                );
              },
            }}
            examinationDateProps={{
              isInvalid: invalidFields.includes('examination_date_basic'),
            }}
            previousIssueProps={{
              value: props.selectedIssue,
              isLoading: !previousIssuesFullyLoaded,
              selectedIssueType: props.selectedIssueType,
              athletePreviousIssues: props.isOpen ? athletePreviousIssues : [],
              isRecurrenceOutsideSystemEnabled,
              onSelectPreviousIssue: (value) => {
                const isNoPriorInjurySelected = value === -1;

                if (isNoPriorInjurySelected) {
                  props.onSelectPreviousIssue(value, value);
                } else {
                  const selectedIssue = athletePreviousIssues.closed_issues
                    ? athletePreviousIssues.closed_issues.find(
                        (issue) => issue.id === value
                      )
                    : null;

                  props.onSelectPreviousIssue(
                    selectedIssue?.id,
                    selectedIssue?.issue?.id
                  );
                  props.onSelectBamicGrade(
                    selectedIssue?.issue?.bamic_grade_id
                  );
                  props.onSelectBamicSite(selectedIssue?.issue?.bamic_site_id);
                  props.onSelectOnset(
                    selectedIssue?.issue?.issue_occurrence_onset_id ||
                      selectedIssue?.issue?.injury_type_id ||
                      selectedIssue?.issue?.illness_onset_id
                  );

                  if ('pathologies' in (selectedIssue?.issue?.coding ?? {})) {
                    props.onSelectCodingSystemPathology(
                      selectedIssue?.issue?.coding?.pathologies?.[0]
                    );
                    return;
                  }

                  // When 'emr-multiple-coding-systems' if off injuries have an osics_pathology_id value not an object
                  const pathologyId =
                    selectedIssue?.issue?.osics?.pathology?.id ??
                    selectedIssue?.issue?.osics?.osics_pathology_id;

                  props.onSelectPathology(pathologyId);
                  props.onSelectSide(
                    organisation.coding_system_key,
                    selectedIssue?.issue?.side_id
                  );
                }
              },
              isInvalid: invalidFields.includes('reccurrence_id'),
              fieldLabel: getFieldLabel(
                'reccurrence_id',
                props.selectedIssueType
              ),
              isVisible: isFieldVisible('reccurrence_id'),
            }}
            continuationIssueProps={{
              value: props.selectedIssue,
              isLoading: !previousOrganisationIssuesFullyLoaded,
              isIssueDetailsLoading,
              isContinuationOutsideSystemEnabled,
              athletePreviousOrganisationIssues: props.isOpen
                ? athletePreviousOrganisationIssues
                : [],

              onSelectContinuationIssue: (issueId) => {
                const isNoPriorInjurySelected = issueId === -1;
                setIsIssueDetailsLoading(true);
                const type = issueIsAnInjury() ? 'Injury' : 'Illness';
                if (!isNoPriorInjurySelected) {
                  getAthleteIssue(props.selectedAthlete, issueId, type).then(
                    (issue) => {
                      props.onSelectContinuationIssue(
                        issue,
                        type.toLowerCase()
                      );
                      setIsIssueDetailsLoading(false);
                    }
                  );
                } else {
                  props.onSelectContinuationIssue(
                    { id: issueId },
                    type.toLowerCase()
                  );
                }
              },

              isInvalid: invalidFields.includes('continuation_issue_id'),
              fieldLabel: getFieldLabel('continuation_issue_id'),
              isVisible: isFieldVisible('continuation_issue_id'),
            }}
            noteEditorProps={{
              onUpdateNote: props.onUpdateInitialNote,
              ref: editorRef,
              value: props.enteredInitialNote,
            }}
            reportedDateProps={{
              isInvalid: invalidFields.includes('reported_date'),
              fieldLabel: getFieldLabel('reported_date'),
              isVisible: isFieldVisible('reported_date'),
              reportedDate: props.selectedReportedDate,
              onSelectReportedDate: (reportedDate) => {
                props.onSelectReportedDate(
                  moment(reportedDate).format('YYYY-MM-DD')
                );
              },
            }}
            squadProps={{
              squadId: props.selectedSquadId,
              onSelectSquad: (squadId) => {
                props.onSelectSquad(squadId);
              },
              isInvalid: invalidFields.includes('squad'),
            }}
          />
        )}
      </AthleteConstraints>
    );
  };

  const renderPageContentTwo = () => {
    const isNoPriorInjurySelected = props.selectedIssue === -1;

    return (
      <AthleteConstraints athleteId={props.selectedAthlete}>
        {({ lastActivePeriod, organisationStatus }) => (
          <DiagnosisInformation
            sides={props.sides}
            athleteData={props.athleteData}
            grades={props.grades}
            injuryStatuses={props.injuryStatuses}
            statuses={props.statuses}
            permissions={props.permissions}
            isFieldVisible={isFieldVisible}
            getFieldLabel={getFieldLabel}
            invalidFields={invalidFields}
            isFieldVisibleByType={isFieldVisibleByType}
            getFieldLabelByType={getFieldLabelByType}
            issueIsARecurrence={issueIsARecurrence()}
            issueIsAnIllness={issueIsAnIllness()}
            issueIsAnInjury={issueIsAnInjury()}
            isChronicCondition={isChronicCondition}
            maxPermittedExaminationDate={
              organisationStatus === 'PAST_ATHLETE'
                ? lastActivePeriod.end
                : props.selectedExaminationDate
            }
            isPastAthlete={organisationStatus === 'PAST_ATHLETE'}
            issueIsAContinuation={
              issueIsAContinuation() && !isNoPriorInjurySelected
            }
            currentPage={props.currentPage}
          />
        )}
      </AthleteConstraints>
    );
  };

  const renderPageContentThree = () => {
    const athleteValue = props.selectedAthlete || null;

    return (
      <AthleteConstraints athleteId={props.selectedAthlete}>
        {({ lastActivePeriod }) => (
          <EventInformation
            selectedEvent={props.selectedEvent}
            eventType={props.selectedEventType}
            isGameOrTraining={isGameOrTrainingInjury}
            athleteIDProps={{
              value: parseInt(athleteValue, 10),
            }}
            occurrenceDateProps={{
              isVisible: isFieldVisible('occurrence_date'),
              isInvalid: invalidFields.includes('occurrence_date'),
              fieldLabel: getFieldLabel(
                'occurrence_date',
                issueIsAContinuation()
              ),
              selectedDiagnosisDate: props.selectedDiagnosisDate,
              examinationDate: props.selectedExaminationDate,
              onSelectDiagnosisDate: (diagnosisDate) => {
                props.onSelectDiagnosisDate(
                  moment(diagnosisDate).format('YYYY-MM-DD')
                );
                // need to update the first status date to match the onset date
                props.onUpdateStatusDate(
                  0,
                  moment(diagnosisDate).format('YYYY-MM-DD')
                );
              },
            }}
            gameIDProps={{
              isOptional: !!issueIsAnIllness(),
              isDisabled: !props.selectedAthlete,
              isVisible:
                isFieldVisible('game_id') ||
                isFieldVisible('training_session_id'),
              fieldLabel: getFieldLabel('game_id'),
              isInvalid:
                invalidFields.includes('game_id') ||
                invalidFields.includes('training_session_id'),
              options: gameAndTrainingOptions,
              gameOptions: props.gameOptions,
              trainingOptions: props.trainingSessionOptions,
              value: getEventValue(
                props.selectedEvent,
                props.selectedEventType
              ),
              onSelectEvent: (value) => {
                const [id, type] = value.split('_');
                props.onSelectEvent(id, type);
                // props.gameOptions can contain games from up to 8 weeks before the diagnosis date
                // so if the type is game we need to set the diagnosis date to be the same as the selected game's date
                if (type === 'game') {
                  const gameDate = props.gameOptions.find(
                    (game) => game.value === parseInt(id, 10)
                  )?.game_date;
                  // if the game is unlisted it wont have a gameDate
                  if (gameDate) {
                    props.onSelectDiagnosisDate(
                      moment(gameDate).format('YYYY-MM-DD')
                    );
                  }
                }
                if (type === 'other') {
                  props.onSelectActivity(
                    ...getActivityGroupOptions(props.activityGroups, id).map(
                      (activity) => activity.value
                    )
                  );
                }
              },
            }}
            activityIDProps={{
              isOtherVisible:
                issueIsAnInjury() &&
                props.selectedEvent === 'other' &&
                isFieldVisible('activity_id'),
              isVisible: isFieldVisible('activity_id'),
              isInvalid: invalidFields.includes('activity_id'),
              fieldLabel: getFieldLabel('activity_id'),
              value: props.selectedActivity,
              options: getActivityGroupOptions(
                props.activityGroups,
                props.selectedEventType
              ),
              onSelectActivity: (value) => {
                props.onSelectActivity(value);
              },
              freeText: props.primaryMechanismFreetext,
              onFreetextChange: props.onUpdatePrimaryMechanismFreetext,
              textareaLabel: props.t('If Other Mechanism, Specify:'),
            }}
            positionWhenInjuredProps={{
              isVisible: isFieldVisible('position_when_injured_id'),
              isInvalid: invalidFields.includes('position_when_injured_id'),
              fieldLabel: getFieldLabel('position_when_injured_id'),
              value: props.selectedPositionWhenInjured,
              options: getPositionOptions(props.positionGroups),
              onSelectPositionWhenInjured: (value) => {
                props.onSelectPositionWhenInjured(value);
              },
            }}
            sessionCompletedProps={{
              isVisible: isFieldVisible('session_completed'),
              isInvalid: invalidFields.includes('session_completed'),
              fieldLabel: getFieldLabel('session_completed'),
              selectedSessionCompleted: props.selectedSessionCompleted,
              onSelect: (buttonId) => props.onSelectSessionCompleted(buttonId),
            }}
            timeOfInjuryProps={{
              isVisible: true,
              fieldLabel: props.t('Time of injury'),
              timeOfInjury: props.selectedTimeOfInjury || '',
              onSetTimeOfInjury: (value) => props.onSelectTimeOfInjury(value),
            }}
            mechanismDescriptionProps={{
              onChange: props.onSelectMechanismDescription,
              value: props.selectedMechanismDescription,
            }}
            presentationTypeProps={{
              isVisible: isFieldVisible('presentation_type'),
              isInvalid: invalidFields.includes('presentation_type'),
              fieldLabel: getFieldLabel('presentation_type'),
              onSelect: (presentationTypeId) =>
                props.onSelectPresentationType(presentationTypeId),
              value: props.selectedPresentationType,
              onUpdateFreeText: props.onUpdatePresentationFreeText,
              selectedPresentationTypeFreeText:
                props.selectedPresentationTypeFreeText,
              textareaLabel: props.t('If Other Presentation, Specify:'),
            }}
            issueContactTypeProps={{
              isVisible:
                isFieldVisible('issue_contact_type') &&
                window.featureFlags['nfl-injury-flow-fields'],
              isInvalid: invalidFields.includes('issue_contact_type'),
              fieldLabel: getFieldLabel('issue_contact_type'),
              onSelect: (issueContactType) =>
                props.onSelectIssueContactType(issueContactType),
              value: props.selectedIssueContactType,
              onUpdateFreeText: props.onUpdateIssueContactFreetext,
              selectedIssueContactFreeText: props.issueContactFreetext,
              textareaLabel: props.t('If Contact With Other, Specify:'),
            }}
            injuryMechanismProps={{
              isVisible:
                isFieldVisible('injury_mechanism') &&
                window.featureFlags['nfl-injury-flow-fields'],
              isInvalid: invalidFields.includes('injury_mechanism'),
              fieldLabel: getFieldLabel('injury_mechanism'),
              onSelect: (injuryMechanismId) =>
                props.onSelectInjuryMechanismId(injuryMechanismId),
              value: props.selectedInjuryMechanism,
              freeText: props.injuryMechanismFreetext,
              onFreetextChange: props.onUpdateInjuryMechanismFreetext,
              textareaLabel: props.t('If Other Player Activity, Specify:'),
            }}
            isChronicIssue={isChronicIssue(props.selectedIssueType)}
            isChronicCondition={isChronicCondition}
            examinationDate={props.selectedExaminationDate}
            earliestPermittedOnsetDate={lastActivePeriod.start}
            issueIsAContinuation={issueIsAContinuation()}
            squadProps={{
              squadId: props.selectedSquadId,
              onSelectSquad: (squadId) => {
                props.onSelectSquad(squadId);
              },
              isInvalid: invalidFields.includes('squad'),
            }}
          />
        )}
      </AthleteConstraints>
    );
  };

  const renderPageContentFour = () => {
    return (
      <AthleteConstraints athleteId={props.selectedAthlete}>
        {({ organisationStatus }) => (
          <AdditionalQuestions
            isInfoEvent={isInfoEvent(props.selectedEventType)}
            isPastAthlete={organisationStatus === 'PAST_ATHLETE'}
            selectedIssueType={props.selectedIssueType}
            permissions={props.permissions}
            uploadQueuedAttachments={uploadQueuedAttachments}
            setAllowCreateIssue={setAllowCreateIssue}
            issueIsAContinuation={issueIsAContinuation()}
            attachedFiles={attachedFiles}
            setAttachedFiles={setAttachedFiles}
            areAnnotationsInvalid={invalidFields.includes('annotations')}
          />
        )}
      </AthleteConstraints>
    );
  };

  const isDataLoading = () => {
    return [
      fieldConfigRequestStatus,
      props.initialDataRequestStatus,
      props.requestStatus,
      props.pathologyGroupRequestStatus,
    ].some((status) => ['PENDING', 'loading'].includes(status));
  };

  const hasDataFailed = () => {
    return [
      fieldConfigRequestStatus,
      props.initialDataRequestStatus,
      props.requestStatus,
      athleteIssuesRequestStatus,
      athleteContinuationIssuesRequestStatus,
    ].some((status) => ['FAILURE', 'error'].includes(status));
  };

  const renderPanelContent = () => {
    if (isDataLoading()) {
      return (
        <AppStatus isEmbed status="loading" message={props.t('Loading...')} />
      );
    }
    if (hasDataFailed()) {
      return <AppStatus isEmbed status="error" />;
    }
    return (
      <>
        <div
          css={{
            padding: '8px 24px',
          }}
        >
          <AddIssueProgressTracker
            currentHeadingId={props.currentPage}
            headings={[
              { id: 1, name: props.t('Initial Information') },
              { id: 2, name: props.t('Diagnosis Information') },
              ...(!isChronicCondition ||
              !window.featureFlags['chronic-conditions-updated-fields']
                ? [
                    { id: 3, name: props.t('Event Information') },
                    { id: 4, name: props.t('Additional Information') },
                  ]
                : []),
            ]}
            formValidation={formValidation}
            issueType={props.selectedIssueType}
          />
        </div>
        <div css={style.contentContainer}>
          <div
            data-testid="AddIssueSidePanel|Page1"
            style={{ display: props.currentPage === 1 ? 'block' : 'none' }}
          >
            {renderPageContentOne()}
          </div>
          <div
            data-testid="AddIssueSidePanel|Page2"
            style={{ display: props.currentPage === 2 ? 'block' : 'none' }}
          >
            {renderPageContentTwo()}
          </div>
          {(!isChronicCondition ||
            !window.featureFlags['chronic-conditions-updated-fields']) && (
            <>
              <div
                data-testid="AddIssueSidePanel|Page3"
                style={{
                  display: props.currentPage === 3 ? 'block' : 'none',
                }}
              >
                {renderPageContentThree()}
              </div>
              {/*
               * Using CSS for hiding/showing page 4 is important as we store the files queue at the Attachement component level.
               * Using conditional rendering would wipe the queue as it would re-mount sub-components and reset their state. An alternative would be to
               * lift the files queue to this component.
               * The files queue is not stored at the Redux level with the rest of the form data because Redux does not
               * allow storing non-serializable values.
               */}
              <div
                data-testid="AddIssueSidePanel|Page4"
                style={{
                  display: props.currentPage === 4 ? 'block' : 'none',
                }}
              >
                {renderPageContentFour()}
              </div>
            </>
          )}
        </div>
        <div
          className="addIssueSidePanel__panelActionContainer"
          css={panelActionStyles(props.currentPage)}
        >
          <PanelActions
            selectedChronicIssue={props.selectedChronicIssue}
            formValidation={(validation) => formValidation(validation)}
            setuploadQueuedAttachments={setuploadQueuedAttachments}
            allowCreateIssue={allowCreateIssue}
            setAllowCreateIssue={setAllowCreateIssue}
            issueType={props.selectedIssueType}
          />
        </div>
      </>
    );
  };

  return (
    <div className="addIssueSidePanel">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        onClose={props.onClose}
        kitmanDesignSystem
        title={
          isChronicCondition
            ? props.t('Add chronic condition')
            : props.t('Add injury/ illness')
        }
        width={649}
        intercomTarget="Add injury - Sliding panel"
      >
        {renderPanelContent()}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddIssueSidePanelTranslated = withNamespaces()(AddIssueSidePanel);
export default AddIssueSidePanel;
