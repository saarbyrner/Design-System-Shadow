// @flow
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { useRef, useEffect } from 'react';
import moment from 'moment';
import { Virtuoso } from 'react-virtuoso';

import {
  SlidingPanel,
  TextLink,
  Select,
  DateRangePicker,
  AppStatus,
} from '@kitman/components';
import style from '@kitman/common/src/styles/LeftSidePanelStyle.style';
import {
  onUpdateFilters,
  onOpenEventSelect,
} from '@kitman/modules/src/EventSwitcherSidePanel/redux/slices/eventSwitchSlice';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';
import { createPlanningEventUrl } from '@kitman/modules/src/CalendarPage/src/components/EventTooltip/utils/helpers';
import { creatableEventTypeEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/enumLikes';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

import {
  useGetPlanningHubEventQuery,
  useGetEventsQuery,
} from './services/api/eventSwitchApi';

type Props = {
  isOpen: boolean,
  eventId: number,
  onClosePanel: () => {},
  width?: number | string,
  left?: number,
};

const EventSwitcherSidePanel = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { isEventSwitcherOpen, searchState } = useSelector(
    (state) => state.eventSwitcherSlice
  );
  const virtuosoRef = useRef(null);
  const hasOpenEventPanelParam = Boolean(
    useLocationSearch()?.get('open_event_switcher_panel')
  );

  const { data: initialFilters, isLoading: initialFiltersDataLoading } =
    useGetPlanningHubEventQuery(
      {
        eventId: props.eventId,
        includeRRuleInstance: true,
      },
      {
        skip: !(props.eventId && isEventSwitcherOpen),
      }
    );

  const shouldFetchingBeSkipped =
    initialFiltersDataLoading || !(props.eventId && isEventSwitcherOpen);

  const {
    isError,
    isFetching,
    data: eventData,
  } = useGetEventsQuery(
    {
      filters: searchState.filters,
      nextId: searchState.nextId,
    },
    {
      skip: shouldFetchingBeSkipped,
    }
  );

  const { events: surroundingEventsData = [], next_id: nextEventId } =
    eventData || {
      events: [],
      next_id: null,
    };

  useEffect(() => {
    dispatch(
      onUpdateFilters({
        filters: { ...initialFilters },
        nextId: null,
      })
    );
  }, [initialFiltersDataLoading, props.isOpen]);

  useEffect(() => {
    if (hasOpenEventPanelParam) {
      dispatch(onOpenEventSelect());
    }
  }, [hasOpenEventPanelParam]);

  const getHeaderContent = () => {
    return (
      <>
        <div css={style.headerContainer}>
          <h4 css={style.headerText}>{props.t('Select event')}</h4>
          <div css={style.headerActionButton}>
            <button
              type="button"
              onClick={props.onClosePanel}
              css={style.headerActionButton}
              className="icon-close"
            />
          </div>
        </div>
      </>
    );
  };

  const getItemContent = ({
    name,
    start_date: startDate,
    id: displayEventId,
    session_type: { name: sessionType } = { name: null },
    opponent_team: { name: opponent, owner_name: ownerName } = {
      name: '',
      owner_name: '',
    },
    venue_type: { name: venueType } = { name: '' },
    competition: { name: competitionName } = { name: '' },
    isVirtualEvent,
    type,
  }) => {
    const formattedId = isVirtualEvent
      ? displayEventId.split(VIRTUAL_EVENT_ID_SEPARATOR)[0]
      : displayEventId;
    const formattedDate = moment(startDate).format('ddd[, ]ll[ | ]LT');
    const gameName = `${
      opponent ? `${opponent} ${ownerName ?? ''}` : ''
    } (${venueType}), ${competitionName}`;
    const url = createPlanningEventUrl({
      id: displayEventId,
      start: startDate,
      url: `/planning_hub/events/${formattedId}`,
      extendedProps: { type },
      openEventSwitcherSidePanel:
        isVirtualEvent && type === creatableEventTypeEnumLike.Session,
    });

    return (
      <div
        css={[
          style.itemContainer,
          formattedId === props.eventId && style.selectedItem,
        ]}
      >
        <span css={style.sessionTitle}>
          <TextLink
            text={name ?? sessionType ?? gameName}
            href={url}
            kitmanDesignSystem
          />
        </span>
        <div css={style.sessionDate}>{formattedDate}</div>
      </div>
    );
  };

  const loadingMessage = (
    <div css={style.loadingText}>{`${props.t('Loading')}...`}</div>
  );

  const Header = () => {
    // display loading message as header when a new search
    if (isFetching && !nextEventId) {
      return loadingMessage;
    }
    if (surroundingEventsData.length === 0) {
      return (
        <span css={style.emptyText}>
          {props.t('No events scheduled for this period')}
        </span>
      );
    }
    return null;
  };

  const Footer = () => {
    // display loading message as footer when lazy loading
    if (isFetching && nextEventId) {
      return loadingMessage;
    }
    return null;
  };

  const getMainContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    return (
      <Virtuoso
        ref={virtuosoRef}
        data={surroundingEventsData}
        totalCount={surroundingEventsData.length}
        endReached={() => {
          if (!nextEventId) {
            return;
          }
          dispatch(
            onUpdateFilters({
              filters: { ...searchState.filters },
              nextId: nextEventId,
            })
          );
        }}
        itemContent={(index, option) =>
          getItemContent({
            ...option,
            opponent_team: option.opponent_team ?? {},
            venue_type: option.venue_type ?? {},
            competition: option.competition ?? {},
          })
        }
        components={{ Footer, Header }}
      />
    );
  };

  const getFilterContent = () => {
    return (
      <>
        <div css={style.filterContainer}>
          <div css={style.filters}>
            <Select
              options={[
                { value: 'game_event', label: props.t('Games') },
                { value: 'session_event', label: props.t('Sessions') },
                ...(window.featureFlags['custom-events']
                  ? [
                      {
                        value: 'custom_event',
                        label: props.t('Event'),
                      },
                    ]
                  : []),
              ]}
              onChange={(selectedEventTypes) => {
                dispatch(
                  onUpdateFilters({
                    filters: {
                      ...searchState.filters,
                      eventTypes: selectedEventTypes,
                    },
                    nextId: null,
                  })
                );
              }}
              value={searchState.filters.eventTypes}
              placeholder={props.t('Events')}
              isMulti
              showAutoWidthDropdown
            />
          </div>
          <div css={style.filters}>
            <DateRangePicker
              position="right"
              onChange={(selectedDateRange) => {
                dispatch(
                  onUpdateFilters({
                    filters: {
                      ...searchState.filters,
                      dateRange: selectedDateRange,
                    },
                    nextId: null,
                  })
                );
              }}
              value={searchState.filters.dateRange}
              turnaroundList={[]}
              allowFutureDate
              kitmanDesignSystem
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <SlidingPanel
      hideHeader
      align="left"
      leftMargin={props.left}
      removeFixedLeftMargin={typeof props.left !== 'number'}
      cssTop={50}
      isOpen={props.isOpen}
      kitmanDesignSystem
      width={props.width || 269}
      styles={style.sidePanelOverride}
    >
      {getHeaderContent()}
      {getFilterContent()}
      {getMainContent()}
    </SlidingPanel>
  );
};

export const EventSwitcherSidePanelTranslated = withNamespaces()(
  EventSwitcherSidePanel
);
export default EventSwitcherSidePanel;
