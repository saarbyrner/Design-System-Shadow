// @flow
import { useRef, useState, useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useFlexLayout } from 'react-table';

import { type CustomEvent } from '@kitman/common/src/types/Event';
import { AppStatus } from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout/index';
import DataTable from '@kitman/modules/src/Medical/shared/components/DataTable';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTableStyles } from '@kitman/modules/src/PlanningEvent/src/helpers/tableComponents';
import getStyles from '@kitman/common/src/styles/FileTable.styles';
import { type ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import useManageAthleteEventsGrid from '@kitman/modules/src/PlanningEvent/src/hooks/useManageAthleteEventsGrid';
import {
  type Params as UpdateEventAttributesParams,
  type AthleteParticipationDetails,
} from '@kitman/services/src/services/planning/updateEventAttributes';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import { transformFeRecurrenceRuleToFitBe } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { recurrenceChangeScopeEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/enumLikes';

import { createRows, createColumns } from '../utils/helpers';

type Props = {
  event: CustomEvent,
  participationLevels: Array<ParticipationLevel>,
  canEditEvent: boolean,
};

const AthletesTabTable = (props: I18nProps<Props>) => {
  const tableRef = useRef();
  const firstUpdate = useRef(true);
  const wasPreviouslyVirtualEvent = useRef(false);
  const dataTableStyles = getTableStyles(tableRef);
  const style = getStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);
  const [virtualEventAttendance, setVirtualEventAttendance] = useState<
    Array<AthleteParticipationDetails>
  >([]);
  const loadingText = `${props.t('Loading')}...`;
  const isVirtualEvent = !!useLocationSearch()?.get('original_start_time');
  const locationAssign = useLocationAssign();

  const {
    data,
    isError,
    isSuccess,
    resetAthleteEventsGrid,
    getNextAthleteEvents,
    updateAthleteAttendance,
  } = useManageAthleteEventsGrid(props.event.id);

  const attendedId = props.participationLevels.find(
    (participationLevel) =>
      participationLevel.canonical_participation_level === 'full'
  )?.id;
  const attendedAthletes =
    data?.athlete_events &&
    data.athlete_events
      .filter(
        // eslint-disable-next-line camelcase
        ({ participation_level }) => participation_level.id === attendedId
      )
      ?.map(({ athlete }) => ({
        id: athlete.id,
        // always attended participation_level, as this will copy the attendance of the
        // previous event, to the real event
        participation_level: attendedId,
      }));

  useEffect(() => {
    if (isVirtualEvent) {
      setVirtualEventAttendance(attendedAthletes);
    }
  }, [data]);

  const onToggle = async (input: UpdateEventAttributesParams) => {
    const hasParentToggleBeenClicked = !input.athleteId;

    if (hasParentToggleBeenClicked) {
      setIsLoading(true);
    }

    if (isVirtualEvent) {
      wasPreviouslyVirtualEvent.current = true;
      setIsLoading(true);
      saveEvent({
        event: {
          ...props.event,
          recurrence: {
            ...props.event.recurrence,
            rule: transformFeRecurrenceRuleToFitBe(
              props.event.recurrence?.rule
            ),
            scope: recurrenceChangeScopeEnumLike.This,
          },
        },
      })
        .then(async (eventResponse) => {
          const isParticipationTrue =
            input.attributes.participation_level === attendedId;
          const hasVirtualEventAttendance = virtualEventAttendance.length > 1;

          if (hasVirtualEventAttendance || isParticipationTrue) {
            await updateAthleteAttendance({
              ...input,
              eventId: eventResponse.id,
              athleteId: hasVirtualEventAttendance ? null : input.athleteId,
              attributes: {
                participation_level: attendedId,
              },
              ...(hasVirtualEventAttendance &&
                !hasParentToggleBeenClicked && {
                  athletes: isParticipationTrue
                    ? [
                        ...virtualEventAttendance,
                        // adding athleteId to virtual attendance as participation true
                        {
                          // $FlowIgnore athleteId will exist here
                          id: input.athleteId,
                          participation_level: attendedId,
                        },
                      ]
                    : virtualEventAttendance
                        // removing athlete as marked as participation false
                        .filter((athlete) => athlete.id !== input.athleteId),
                }),
            }).unwrap();
          }
          await resetAthleteEventsGrid();
          // redirect to newly created event
          const url = `/planning_hub/events/${eventResponse.id}`;
          locationAssign(url);
          setIsLoading(false);
        })
        .catch(() => setHasErrored(true));
    } else {
      try {
        await updateAthleteAttendance(input).unwrap();
        await resetAthleteEventsGrid();
        setIsLoading(false);
      } catch {
        setHasErrored(true);
      }
    }
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (!firstUpdate.current && wasPreviouslyVirtualEvent.current) {
      wasPreviouslyVirtualEvent.current = false;
      return;
    }

    // Triggers refresh when editing from side panel
    if (!isVirtualEvent) {
      (async () => {
        await onToggle({
          eventId: props.event.id,
          attributes: {},
          filters: {},
          tab: 'athletes_tab',
          disableGrid: true,
        });
      })();
    }
  }, [props.event]);

  const getAppStatus = () => {
    if (isError || hasErrored) {
      return <AppStatus status="error" />;
    }
    return <AppStatus message={loadingText} status="loading" />;
  };

  return (
    <>
      {(isError || hasErrored || isLoading) && getAppStatus()}
      {isSuccess && (
        <PlanningTab.TabContent>
          <div
            id="CustomEventsAthletesTable"
            ref={tableRef}
            css={
              data.athlete_events?.length === 0
                ? dataTableStyles.TableEmpty
                : dataTableStyles.Table
            }
          >
            <div css={style.documentsTable}>
              <InfiniteScroll
                dataLength={data.athlete_events?.length}
                next={() => {
                  getNextAthleteEvents(data.next_id);
                }}
                hasMore={data.next_id !== null}
                nextPage={data.next_id}
                loader={<div css={style.loadingText}>{loadingText}</div>}
                scrollableTarget="CustomEventsAthletesTable"
              >
                <DataTable
                  columns={createColumns(
                    props.t,
                    props.participationLevels,
                    props.event.id,
                    onToggle,
                    props.canEditEvent
                  )}
                  data={createRows(data?.athlete_events)}
                  useLayout={useFlexLayout}
                  isTableEmpty={data?.athlete_events?.length === 0}
                />
              </InfiniteScroll>
            </div>
          </div>
        </PlanningTab.TabContent>
      )}
    </>
  );
};

export const AthletesTabTableTranslated: ComponentType<Props> =
  withNamespaces()(AthletesTabTable);
export default AthletesTabTable;
