// @flow
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import _isNil from 'lodash/isNil';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import { colors } from '@kitman/common/src/variables';
import { AppStatus, LineLoader } from '@kitman/components';
import type { ActivityGroups } from '@kitman/services/src/services/medical/getActivityGroups';
import type { PositionGroups } from '@kitman/services/src/services/getPositionGroups';
import type { EventType } from '@kitman/common/src/types/Event';
import type { PresentationTypes } from '@kitman/services/src/services/medical/getPresentationTypes';
import type {
  IssueOccurrenceRequested,
  FreeTextComponent,
} from '@kitman/common/src/types/Issues';
import type { GameAndTrainingOptions } from '@kitman/services/src/services/medical/getGameAndTrainingOptions';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { InjuryMechanisms } from '@kitman/services/src/services/medical/getInjuryMechanisms';
import type { IssueContactTypes } from '@kitman/services/src/services/medical/getIssueContactTypes';
import getIssueContactTypes from '@kitman/services/src/services/medical/getIssueContactTypes';
import getInjuryMechanisms from '@kitman/services/src/services/medical/getInjuryMechanisms';
import {
  getGameAndTrainingOptions,
  saveIssue,
  getActivityGroups,
  getPositionGroups,
  getPresentationTypes,
} from '@kitman/services';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { getEventId } from '@kitman/modules/src/Medical/issues/src/components/EventDetails/Utils';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { HeaderTranslated as Header } from './Header';
import { PresentationViewTranslated as PresentationView } from './PresentationView';
import { EditViewTranslated as EditView } from './EditView';
import type { RequestStatus } from '../../../../shared/types';
import type { ViewType } from '../../types';
import useIssueFields from '../../../../shared/hooks/useIssueFields';
import {
  getFreetextValue,
  isInfoEvent,
  updateFreetextComponentResults,
} from '../../../../shared/utils';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';

export type Details = {
  issueDate: string,
  reportedDate: string | null,
  eventId?: number | string | null,
  eventType: EventType,
  mechanismId: ?number,
  mechanismFreetext?: string,
  mechanismDescription: ?string,
  positionId: number,
  sessionStatus: string,
  injuryTime: number | string,
  presentationTypeId: ?number,
  presentationTypeFreeText?: string,
  issueContactType: ?number | ?string,
  issueContactFreetext?: string,
  injuryMechanism: ?number | ?number,
  injuryMechanismFreetext?: string,
  freeTextComponent: FreeTextComponent[],
};

const style = {
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
};

const getInitialDetails = (issue: IssueOccurrenceRequested): Details => {
  return {
    issueDate: issue.occurrence_date,
    reportedDate: issue.reported_date,
    eventId: getEventId(issue),
    eventType: issue.activity_type,
    mechanismId: issue.activity_id,
    mechanismFreetext: getFreetextValue(issue, 'primary_mechanisms'),
    mechanismDescription: issue.mechanism_description,
    positionId: issue.position_when_injured_id,
    sessionStatus: issue.session_completed ? 'yes' : 'no',
    injuryTime: window.featureFlags['injury-onset-time-selector']
      ? issue.occurrence_date
      : issue.occurrence_min,
    presentationTypeId: issue.presentation_type?.id || null,
    presentationTypeFreeText: getFreetextValue(issue, 'presentation_types'),
    issueContactType: issue.issue_contact_type?.id || null,
    issueContactFreetext: getFreetextValue(issue, 'issue_contact_types'),
    injuryMechanism: issue.injury_mechanism_id || null,
    injuryMechanismFreetext: getFreetextValue(issue, 'injury_mechanisms'),
    freeTextComponent: issue.freetext_components || [],
  };
};

type Props = {
  athleteData: AthleteData,
  editActionDisabled?: boolean,
  onEnterEditMode: (section: ?string) => null,
  organisation: Organisation,
};

const EventDetails = (props: Props) => {
  const { issue, issueType, updateIssue, isChronicIssue } = useIssue();
  const { updateIssueTabRequestStatus } = useIssueTabRequestStatus();
  const { trackEvent } = useEventTracking();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [viewType, setViewType] = useState<ViewType>('PRESENTATION');
  const [areActivityAndPositionsLoaded, setAreActivityAndPositionsLoaded] =
    useState(false);
  const [gameAndTrainingOptions, setGameAndTrainingOptions] =
    useState<GameAndTrainingOptions>({});
  const [activityGroups, setActivityGroups] = useState<ActivityGroups>([]);
  const [positionGroups, setPositionGroups] = useState<PositionGroups>([]);
  const [injuryMechanisms, setInjuryMechanisms] = useState<InjuryMechanisms>(
    []
  );
  const [issueContactTypes, setIssueContactTypes] = useState<IssueContactTypes>(
    []
  );
  const [presentationTypes, setPresentationTypes] = useState<PresentationTypes>(
    []
  );
  const [details, setDetails] = useState<Details>(getInitialDetails(issue));
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] = useState(
    window.featureFlags['incomplete-injury-fields']
  );

  const isInjury = issueType === 'Injury';
  const isRequestPending = requestStatus === 'PENDING';

  const { getFieldLabel, isFieldVisible } = useIssueFields({
    issueType: isInjury ? 'injury' : 'illness',
    skip: false,
  });

  useEffect(() => {
    setDetails(getInitialDetails(issue));
  }, [viewType]);

  useEffect(() => {
    const fetchNFLInjuryData = async () => {
      setRequestStatus('PENDING');
      const mechanisms = await getInjuryMechanisms();
      setInjuryMechanisms(mechanisms);
      const contactTypes = await getIssueContactTypes();
      setIssueContactTypes(contactTypes);
      const presTypes = await getPresentationTypes();
      setPresentationTypes(presTypes);
      setRequestStatus('SUCCESS');
    };

    if (
      window.featureFlags['nfl-injury-flow-fields'] &&
      issueType === 'Injury'
    ) {
      fetchNFLInjuryData().finally(() => setRequestStatus(null));
    }
  }, []);

  const fetchInjuryOptions = () => {
    setRequestStatus('PENDING');

    Promise.all([
      getGameAndTrainingOptions(
        issue.athlete_id,
        details.issueDate,
        !!'detailedView',
        true // Strict date match
      ),
      getActivityGroups(),
      getPositionGroups(),
    ]).then(
      ([
        fetchedGameAndTrainingOptions,
        fetchedActivityGroups,
        fetchedPositionGroups,
      ]) => {
        setGameAndTrainingOptions(fetchedGameAndTrainingOptions);
        setActivityGroups(fetchedActivityGroups);
        setPositionGroups(fetchedPositionGroups);
        setRequestStatus('SUCCESS');
        setAreActivityAndPositionsLoaded(true);
        setViewType('EDIT');
      },
      () => {
        setRequestStatus('FAILURE');
      }
    );
  };

  const fetchGameAndTrainingOptions = (date: string) => {
    setRequestStatus('PENDING');

    getGameAndTrainingOptions(issue.athlete_id, date, true, true).then(
      (fetchedGameAndTrainingOptions) => {
        setDetails((prevDetails) => ({
          ...prevDetails,
          issueDate: date,
        }));
        setGameAndTrainingOptions(fetchedGameAndTrainingOptions);
        setRequestStatus('SUCCESS');
        setAreActivityAndPositionsLoaded(true);
        setViewType('EDIT');

        const sessionOptions =
          details.eventType === 'game'
            ? fetchedGameAndTrainingOptions.games
            : fetchedGameAndTrainingOptions.training_sessions;
        const currentEventId =
          sessionOptions.find((option) => option.value === details.eventId)
            ?.value || null;

        if (currentEventId) {
          setDetails((prevDetails) => ({
            ...prevDetails,
            eventId: currentEventId,
          }));
        }
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const selectEditView = () => {
    props.onEnterEditMode();
    if ((isInjury && areActivityAndPositionsLoaded) || !isInjury) {
      fetchGameAndTrainingOptions(details.issueDate);
      return;
    }

    fetchInjuryOptions();
  };

  const resetValues = () => {
    if (!window.featureFlags['incomplete-injury-fields']) {
      setIsValidationCheckAllowed(false);
    }
    setViewType('PRESENTATION');
  };

  const saveEdit = () => {
    if (!window.featureFlags['preliminary-injury-illness']) {
      setIsValidationCheckAllowed(true);

      const selectedValues = isInjury
        ? [details.eventId, details.mechanismId, details.positionId]
        : [details.eventId];

      const allSelectedValuesAreValid = selectedValues.every(
        (item) => !_isNil(item)
      );

      if (!allSelectedValuesAreValid) {
        return;
      }
    }

    setRequestStatus('PENDING');
    updateIssueTabRequestStatus('PENDING');

    const upToDateFreeText = details.freeTextComponent;
    const freetextMapper = [
      { type: 'presentation_types', value: details.presentationTypeFreeText },
      { type: 'primary_mechanisms', value: details.mechanismFreetext },
      { type: 'injury_mechanisms', value: details.injuryMechanismFreetext },
      { type: 'issue_contact_types', value: details.issueContactFreetext },
    ];
    freetextMapper.forEach((freetext) =>
      updateFreetextComponentResults(
        upToDateFreeText,
        freetext.type,
        freetext.value
      )
    );

    const selectedOtherEvent = details.eventType;
    const selectedEventId = gameAndTrainingOptions.other_events?.find(
      (event) => event.shortname === selectedOtherEvent
    )?.id;
    const isNFLInjuryFlowFields = window.featureFlags['nfl-injury-flow-fields'];
    const shouldPersistOtherEventId =
      issue.occurrence_type === 'continuation' &&
      !isNFLInjuryFlowFields &&
      window.featureFlags['medical-additional-event-info-events'];

    let separateInjuryTime = issue.occurrence_min;
    if (
      details.injuryTime !== null &&
      !window.featureFlags['injury-onset-time-selector']
    ) {
      separateInjuryTime =
        details.injuryTime === '' ? null : +details.injuryTime;
    }

    const updatedParams = {
      occurrence_date: details.issueDate,
      activity_type: details.eventType,
      reported_date: details.reportedDate,
      presentation_type_id: details.presentationTypeId,
      freetext_components: upToDateFreeText,
      game_id:
        details.eventId && details.eventType === 'game' ? details.eventId : '',
      training_session_id:
        details.eventId && details.eventType === 'training'
          ? details.eventId
          : '',
      ...(isInjury && {
        activity_id: details.mechanismId,
        position_when_injured_id: details.positionId,
        session_completed: details.sessionStatus,
        issue_contact_type_id: details.issueContactType,
        injury_mechanism_id: details.injuryMechanism,
        mechanism_description: details.mechanismDescription,
        occurrence_min: separateInjuryTime,
      }),
      // $FlowFixMe - state is ready at this stage
      ...(shouldPersistOtherEventId && {
        other_event_id: selectedEventId,
      }),
    };

    saveIssue(issueType, issue, updatedParams, isChronicIssue)
      .then((updatedIssue) => {
        updateIssue(updatedIssue);
        setRequestStatus('SUCCESS');
        resetValues();
        updateIssueTabRequestStatus('DORMANT');
        trackEvent(
          performanceMedicineEventNames.editedInjuryIllnessEventDetails
        );
      })
      .finally(() => {
        props.onEnterEditMode();
        setRequestStatus(null);
        resetValues();
        updateIssueTabRequestStatus(null);
      });
  };

  const selectEvent = (eventId, eventType) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      eventId,
      eventType,
      /* When the selected event has no id (non listed event)
      or the selected event type is different from the previous one,
      it is required to reset the mechanism id */
      ...((!eventId || prevDetails.eventType !== eventType) && {
        mechanismId: null,
      }),
    }));
    if (!window.featureFlags['incomplete-injury-fields'])
      setIsValidationCheckAllowed(false);

    // If the event type is a game injury, the injury date coincides with the date of the selected game
    if (eventType !== 'game') {
      return;
    }

    const gameDate = gameAndTrainingOptions.games.find(
      (game) => game.value === eventId
    )?.game_date;

    // If the game is unlisted it will not have a gameDate
    if (gameDate) {
      setDetails((prevDetails) => ({
        ...prevDetails,
        issueDate: gameDate,
      }));
    }
  };

  const selectDetail = (detailType: string, detailValue: string | number) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [detailType]: detailValue,
    }));
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <section css={style.section} data-testid="EventDetails">
      <Header
        viewType={viewType}
        onEdit={selectEditView}
        onDiscardChanges={() => {
          resetValues();
          props.onEnterEditMode();
        }}
        isRequestPending={isRequestPending}
        onSave={() => {
          saveEdit();
        }}
        editActionDisabled={props.editActionDisabled}
      />
      {viewType === 'PRESENTATION' ? (
        <PresentationView
          organisation={props.organisation}
          issueDate={details.issueDate}
          reportedDate={details.reportedDate}
          isFieldVisible={isFieldVisible}
          getFieldLabel={getFieldLabel}
          injuryMechanisms={injuryMechanisms}
          issueContactTypes={issueContactTypes}
          highlightEmptyFields={window.featureFlags['incomplete-injury-fields']}
        />
      ) : (
        <EditView
          athleteData={props.athleteData}
          examinationDate={issue.examination_date}
          reportedDate={details.reportedDate}
          gameAndTrainingOptions={gameAndTrainingOptions}
          activityGroups={activityGroups}
          positionGroups={positionGroups}
          details={details}
          onSelectIssueDate={fetchGameAndTrainingOptions}
          onSelectEvent={selectEvent}
          onSelectDetail={selectDetail}
          organisation={props.organisation}
          isRequestPending={isRequestPending}
          isValidationCheckAllowed={isValidationCheckAllowed}
          isGameOrTraining={details.eventType && isInfoEvent(details.eventType)}
          isFieldVisible={isFieldVisible}
          injuryMechanisms={injuryMechanisms}
          getFieldLabel={getFieldLabel}
          issueContactTypes={issueContactTypes}
          presentationTypes={presentationTypes}
        />
      )}
      {requestStatus === 'PENDING' && (
        <div
          css={style.sectionLoader}
          data-testid="IssueDetailsLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
    </section>
  );
};

export const EventDetailsTranslated = withNamespaces()(EventDetails);
export default EventDetails;
