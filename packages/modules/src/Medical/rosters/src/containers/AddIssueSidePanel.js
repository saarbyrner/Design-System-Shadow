// @flow
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { formatISODate } from '@kitman/common/src/utils/dateFormatter';
import {
  useGetSidesQuery,
  useGetActivityGroupsQuery,
  useGetPositionGroupsQuery,
  useGetBamicGradesQuery,
  useGetSquadAthletesQuery,
  useGetInjuryStatusesQuery,
  useGetActiveSquadQuery,
  useGetPreliminarySchemaQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import {
  filterInactiveSides,
  isV2MultiCodingSystem,
} from '@kitman/modules/src/Medical/shared/utils';
import useSquadAthletesSelectOptions from '@kitman/modules/src/Medical/shared/hooks/useSquadAthletesSelectOptions';
import { AddIssueSidePanelTranslated as AddIssueSidePanel } from '../components/AddIssueSidePanel';
import {
  closeAddIssuePanel,
  fetchGameAndTrainingOptions,
  fetchGroupAndSelectCoding,
  fetchIssueDetails,
  selectActivity,
  selectAthlete,
  selectAthleteData,
  selectBamicGrade,
  selectBamicSite,
  selectDiagnosisDate,
  selectEvent,
  selectIssueType,
  selectOnset,
  selectPathology,
  selectPositionWhenInjured,
  selectPreviousIssue,
  selectContinuationIssue,
  selectSessionCompleted,
  selectSide,
  selectSquad,
  selectCoding,
  selectTimeOfInjury,
  updateInitialNote,
  updateStatusDate,
  setIssueTitle,
  selectReportedDate,
  selectExaminationDate,
  selectMechanismDescription,
  selectPresentationType,
  selectIssueContactType,
  selectInjuryMechanism,
  setPresentationTypeFreeText,
  updateInjuryMechanismFreetext,
  updatePrimaryMechanismFreetext,
  setChronicIssue,
  setIssueContactFreetext,
  setChronicConditionOnsetDate,
  selectSupplementalCoding,
  selectCodingSystemPathology,
} from '../redux/actions';
import {
  getAttachedConcussionAssessments,
  getInjuryMechanismFreeText,
  getIssueContactFreeText,
  getPrimaryMechanismFreeText,
  getSelectedAthlete,
  getSelectedBamicSite,
  getSelectedCoding,
  getSelectedDiagnosisDate,
  getSelectedExaminationDate,
  getSelectedIssueType,
  getSelectedOnset,
  getSelectedSide,
} from '../redux/selectors/addIssueSidePanel';

export default (props: any) => {
  const { organisation } = useOrganisation();
  const isV2CodingSystem = isV2MultiCodingSystem(
    organisation.coding_system_key
  );
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.addIssuePanel.isOpen);
  const {
    data: preliminarySchema = {},
    // error: preliminarySchemaError, USe in toast or something need ot ask product
    isLoading: isPreliminarySchemaLoading,
  } = useGetPreliminarySchemaQuery(
    {
      issue_type: 'new_injury',
      issue_occurrence_date: formatISODate(moment()),
    },
    {
      skip: !window.getFlag('pm-preliminary-ga') || !isOpen,
    }
  );

  const preliminarySchemaToPass = window.getFlag('pm-preliminary-ga')
    ? preliminarySchema
    : {};
  const shouldRestoreData = useSelector(
    (state) => state.addIssuePanel.shouldRestoreData
  );
  const currentPage = useSelector((state) => state.addIssuePanel.page);
  const title = useSelector((state) => state.addIssuePanel.title);
  const pathologyGroupRequestStatus = useSelector(
    (state) => state.addIssuePanel.pathologyGroupRequestStatus
  );
  const attachedConcussionAssessments = useSelector(
    getAttachedConcussionAssessments
  );
  const selectedAthlete = useSelector(getSelectedAthlete);
  const selectedBamicGrade = useSelector(getSelectedBamicSite);
  const selectedCoding = useSelector(getSelectedCoding);
  const selectedDiagnosisDate = useSelector(getSelectedDiagnosisDate);
  const selectedExaminationDate = useSelector(getSelectedExaminationDate);
  const selectedIssueType = useSelector(getSelectedIssueType);
  const selectedOnset = useSelector(getSelectedOnset);
  const selectedSide = useSelector(getSelectedSide);
  const gameOptions = useSelector(
    (state) => state.addIssuePanel.eventInfo.events.games
  );
  const otherEventOptions = useSelector(
    (state) => state.addIssuePanel.eventInfo.events.otherEventOptions
  );
  const selectedActivity = useSelector(
    (state) => state.addIssuePanel.eventInfo.activity
  );
  const selectedEvent = useSelector(
    (state) => state.addIssuePanel.eventInfo.event
  );
  const selectedEventType = useSelector(
    (state) => state.addIssuePanel.eventInfo.eventType
  );
  const selectedInitialAttachments = useSelector(
    (state) => state.addIssuePanel.initialInfo.attachments
  );
  const enteredInitialNote = useSelector(
    (state) => state.addIssuePanel.initialInfo.initialNote
  );
  const requestStatus = useSelector(
    (state) => state.addIssuePanel.requestStatus
  );
  const selectedPositionWhenInjured = useSelector(
    (state) => state.addIssuePanel.eventInfo.positionWhenInjured
  );
  const selectedIssue = useSelector(
    (state) => state.addIssuePanel.initialInfo.issueId
  );
  const selectedSessionCompleted = useSelector(
    (state) => state.addIssuePanel.eventInfo.sessionCompleted
  );
  const selectedSquadId = useSelector(
    (state) => state.addIssuePanel.initialInfo.squadId
  );
  const selectedTimeOfInjury = useSelector(
    (state) => state.addIssuePanel.eventInfo.timeOfInjury
  );
  const statuses = useSelector(
    (state) => state.addIssuePanel.diagnosisInfo.statuses
  );
  const trainingSessionOptions = useSelector(
    (state) => state.addIssuePanel.eventInfo.events.sessions
  );

  const isAthleteSelectable = useSelector(
    (state) => state.addIssuePanel.initialInfo.isAthleteSelectable
  );

  const bamicGradesOptions = useSelector(
    (state) => state.addIssuePanel.bamicGradesOptions
  );

  const selectedReportedDate = useSelector(
    (state) => state.addIssuePanel.initialInfo.reportedDate
  );
  const selectedMechanismDescription = useSelector(
    (state) => state.addIssuePanel.eventInfo.mechanismDescription
  );
  const selectedPresentationType = useSelector(
    (state) => state.addIssuePanel.eventInfo.presentationTypeId
  );
  const selectedPresentationTypeFreeText = useSelector(
    (state) => state.addIssuePanel.eventInfo.presentationTypeFreeText
  );
  const selectedIssueContactType = useSelector(
    (state) => state.addIssuePanel.eventInfo.issueContactType
  );
  const selectedInjuryMechanism = useSelector(
    (state) => state.addIssuePanel.eventInfo.injuryMechanismId
  );
  const selectedChronicIssue = useSelector(
    (state) => state.addIssuePanel.initialInfo.linkedChronicIssue
  );
  const chronicConditionOnsetDate = useSelector(
    (state) => state.addIssuePanel.initialInfo.chronicConditionOnsetDate
  );
  const selectedAnnotations = useSelector(
    (state) => state.addIssuePanel.additionalInfo.annotations
  );
  const injuryMechanismFreetext = useSelector(getInjuryMechanismFreeText);
  const primaryMechanismFreetext = useSelector(getPrimaryMechanismFreeText);
  const issueContactFreetext = useSelector(getIssueContactFreeText);

  const athleteData = useSelector(
    (state) => state.addIssuePanel.initialInfo.athleteData
  );

  const {
    data: activeSquad = {},
    error: activeSquadError,
    isLoading: isActiveSquadLoading,
  } = useGetActiveSquadQuery(null, { skip: !isOpen });

  const {
    data: sides = [],
    error: getSidesError,
    isLoading: areSidesLoading,
  } = useGetSidesQuery(null, { skip: !isOpen || isV2CodingSystem });

  const {
    data: activityGroups = [],
    error: getActivityGroupsError,
    isLoading: areActivityGroupsLoading,
  } = useGetActivityGroupsQuery(null, { skip: !isOpen });

  const {
    data: positionGroups = [],
    error: getPositionGroupsError,
    isLoading: arePositionGroupsLoading,
  } = useGetPositionGroupsQuery(null, { skip: !isOpen });

  const {
    data: bamicGrades = [],
    error: getBamicGradesError,
    isLoading: areBamicGradesLoading,
  } = useGetBamicGradesQuery(null, { skip: !isOpen });

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    {
      athleteList: true,
      minimalAthleteListData: true,
      includePreviousOrganisationInformation: true,
    },
    { skip: !isOpen }
  );

  const {
    data: injuryStatuses = [],
    error: injuryStatusesError,
    isLoading: isInjuryStatusesLoading,
  } = useGetInjuryStatusesQuery(true, { skip: !isOpen });

  const getInitialDataRequestStatus = () => {
    if (
      getSidesError ||
      getActivityGroupsError ||
      getPositionGroupsError ||
      getBamicGradesError ||
      squadAthletesError ||
      activeSquadError ||
      injuryStatusesError
    ) {
      return 'FAILURE';
    }
    if (
      areSidesLoading ||
      areActivityGroupsLoading ||
      arePositionGroupsLoading ||
      areBamicGradesLoading ||
      isSquadAthletesLoading ||
      isActiveSquadLoading ||
      isInjuryStatusesLoading ||
      isPreliminarySchemaLoading
    ) {
      return 'PENDING';
    }
    return null;
  };

  const squadAthletesOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
    withPreviousOrganisation: true,
  });

  return (
    <AddIssueSidePanel
      preliminarySchema={preliminarySchemaToPass}
      activityGroups={activityGroups}
      activeSquad={activeSquad}
      athleteData={athleteData}
      attachedConcussionAssessments={attachedConcussionAssessments}
      bamicGradesOptions={bamicGradesOptions}
      currentPage={currentPage}
      enteredInitialNote={enteredInitialNote}
      fetchGameAndTrainingOptions={() => {
        dispatch(fetchGameAndTrainingOptions(true, true));
      }}
      gameOptions={gameOptions}
      otherEventOptions={otherEventOptions}
      grades={bamicGrades}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      isAthleteSelectable={isAthleteSelectable}
      isOpen={isOpen}
      shouldRestoreData={shouldRestoreData}
      onClose={() => dispatch(closeAddIssuePanel())}
      onSelectActivity={(activity) => {
        dispatch(selectActivity(activity));
      }}
      onUpdatePrimaryMechanismFreetext={(freeText) => {
        dispatch(updatePrimaryMechanismFreetext(freeText));
      }}
      onAthleteDataFetchSuccess={(fetchedAthleteData) =>
        dispatch(selectAthleteData(fetchedAthleteData))
      }
      onSelectAthlete={(athleteId) => dispatch(selectAthlete(athleteId))}
      onSelectBamicGrade={(grade) => dispatch(selectBamicGrade(grade))}
      onSelectBamicSite={(site) => dispatch(selectBamicSite(site))}
      onSelectDiagnosisDate={(date) => {
        dispatch(selectDiagnosisDate(date));
        dispatch(fetchGameAndTrainingOptions(true, true));
      }}
      onSelectSupplementalCoding={(coding) => {
        dispatch(selectSupplementalCoding(coding));
      }}
      onSelectCoding={(coding) => {
        if (window.featureFlags['concussion-web-iteration-2']) {
          dispatch(
            fetchGroupAndSelectCoding(coding, organisation.coding_system)
          );
        } else {
          dispatch(selectCoding(coding));
        }
      }}
      onSelectEvent={(eventId, eventType) => {
        dispatch(selectEvent(eventId, eventType));
        // Adding feature flag for release safety
        // If a different event is selected the activity should reset as the possible activities are linked to the event type
        if (window.featureFlags['medical-additional-event-info-events']) {
          dispatch(selectActivity(null));
        }
      }}
      onSelectIssueType={(issueType) => dispatch(selectIssueType(issueType))}
      onSelectOnset={(onset) => dispatch(selectOnset(onset))}
      onSelectPathology={(pathologyId) => {
        dispatch(selectPathology(pathologyId));
        dispatch(fetchIssueDetails(pathologyId));
      }}
      onSelectCodingSystemPathology={(pathology) => {
        dispatch(selectCodingSystemPathology(pathology));
      }}
      onSelectPositionWhenInjured={(positionWhenInjured) => {
        dispatch(selectPositionWhenInjured(positionWhenInjured));
      }}
      onSelectPreviousIssue={(issueId, previousIssueId) =>
        dispatch(selectPreviousIssue(issueId, previousIssueId))
      }
      onSelectContinuationIssue={(issue) =>
        dispatch(selectContinuationIssue(issue))
      }
      onSelectSessionCompleted={(sessionCompleted) =>
        dispatch(selectSessionCompleted(sessionCompleted))
      }
      onSelectSide={(codingSystem, side) =>
        dispatch(selectSide(codingSystem, side))
      }
      onSelectTimeOfInjury={(injuryTime) =>
        dispatch(selectTimeOfInjury(injuryTime))
      }
      onUpdateInitialNote={(note) => dispatch(updateInitialNote(note))}
      onUpdateStatusDate={(index, date) =>
        dispatch(updateStatusDate(index, date))
      }
      onSetTitle={(newTitle) => {
        dispatch(setIssueTitle(newTitle));
      }}
      onSelectReportedDate={(date) => {
        dispatch(selectReportedDate(date));
      }}
      onSelectExaminationDate={(date) => {
        dispatch(selectExaminationDate(date));
      }}
      onSelectSquad={(squadId) => {
        dispatch(selectSquad(squadId));
      }}
      onSelectMechanismDescription={(mechanismDescription) => {
        dispatch(selectMechanismDescription(mechanismDescription));
      }}
      onSelectPresentationType={(presentationType) => {
        dispatch(selectPresentationType(presentationType));
      }}
      onUpdatePresentationFreeText={(freeText) => {
        dispatch(setPresentationTypeFreeText(freeText));
      }}
      onSelectIssueContactType={(issueContactType) => {
        dispatch(selectIssueContactType(issueContactType));
      }}
      onSelectInjuryMechanismId={(injuryMechanismId) => {
        dispatch(selectInjuryMechanism(injuryMechanismId));
      }}
      onUpdateInjuryMechanismFreetext={(freeText) => {
        dispatch(updateInjuryMechanismFreetext(freeText));
      }}
      onUpdateIssueContactFreetext={(freeText) => {
        dispatch(setIssueContactFreetext(freeText));
      }}
      onSelectChronicIssue={(issues) => {
        dispatch(setChronicIssue(issues));
      }}
      onChronicConditionOnsetDate={(date) => {
        dispatch(setChronicConditionOnsetDate(date));
      }}
      chronicConditionOnsetDate={chronicConditionOnsetDate}
      selectedChronicIssue={selectedChronicIssue}
      title={title}
      positionGroups={positionGroups}
      requestStatus={requestStatus}
      pathologyGroupRequestStatus={pathologyGroupRequestStatus}
      selectedActivity={selectedActivity}
      selectedAnnotations={selectedAnnotations}
      selectedAthlete={selectedAthlete}
      selectedBamicGrade={selectedBamicGrade}
      selectedCoding={selectedCoding}
      selectedDiagnosisDate={selectedDiagnosisDate}
      selectedEvent={selectedEvent}
      selectedEventType={selectedEventType}
      selectedExaminationDate={selectedExaminationDate}
      selectedInitialAttachments={selectedInitialAttachments}
      selectedIssueType={selectedIssueType}
      selectedOnset={selectedOnset}
      selectedPositionWhenInjured={selectedPositionWhenInjured}
      selectedIssue={selectedIssue}
      selectedSessionCompleted={selectedSessionCompleted}
      selectedSide={selectedSide}
      selectedSquadId={selectedSquadId}
      selectedTimeOfInjury={selectedTimeOfInjury}
      selectedReportedDate={selectedReportedDate}
      sides={filterInactiveSides(sides)}
      squadAthletesOptions={squadAthletesOptions}
      statuses={statuses}
      trainingSessionOptions={trainingSessionOptions}
      injuryStatuses={injuryStatuses}
      selectedMechanismDescription={selectedMechanismDescription}
      selectedPresentationType={selectedPresentationType}
      selectedPresentationTypeFreeText={selectedPresentationTypeFreeText}
      selectedIssueContactType={selectedIssueContactType}
      issueContactFreetext={issueContactFreetext}
      selectedInjuryMechanism={selectedInjuryMechanism}
      injuryMechanismFreetext={injuryMechanismFreetext}
      primaryMechanismFreetext={primaryMechanismFreetext}
      {...props}
    />
  );
};
