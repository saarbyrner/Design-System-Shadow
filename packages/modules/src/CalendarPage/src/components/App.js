// @flow
import { Fragment, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';
import _isEqual from 'lodash/isEqual';

import { getSport } from '@kitman/services';
import { EditEventPanelTranslated as EventSidePanel } from '@kitman/modules/src/PlanningEventSidePanel';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import {
  AthleteSelector,
  Checkbox,
  DelayedLoadingFeedback,
  MultiSelectDropdown,
  TextButton,
  TooltipMenu,
} from '@kitman/components';
import { eventTypeFilterEnumLike } from '@kitman/components/src/Calendar/CalendarFilters/utils/enum-likes';
import type {
  MultiSelectDropdownItem,
  SquadAthletes,
  SquadAthletesSelection,
  TooltipItem,
} from '@kitman/components/src/types';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getCalendarFilterData } from '@kitman/common/src/utils/TrackingData/src/data/calendar/getCalendarEventData';
import {
  useEventTracking,
  usePrevious,
  useBrowserTabTitle,
  useIsMountedCheck,
} from '@kitman/common/src/hooks';
import type { FullCalendarRef } from '@kitman/modules/src/CalendarPage/src/types';

import Calendar from '../containers/Calendar';
import AppStatus from '../containers/AppStatus';
import CalendarEventsPanel from '../containers/CalendarEventsPanel';
import EventTooltip from '../containers/EventTooltip';

type Props = {
  calendarFilters: {
    squadSessionsFilter: boolean,
    individualSessionsFilter: boolean,
    gamesFilter: boolean,
    treatmentsFilter: boolean,
    rehabFilter: boolean,
    customEventsFilter: boolean,
  },
  calendarDates: {
    startDate: ?string,
    endDate: ?string,
  },
  updateCalendarFilters: Function,
  fetchEvents: Function,
  isGameModalOpen: boolean,
  isSessionModalOpen: boolean,
  isCustomEventModalOpen: boolean,
  isEventsPanelOpen: boolean,
  openGameModal: Function,
  openSessionModal: Function,
  openCustomEventModal: Function,
  closeGameModal: Function,
  closeSessionModal: Function,
  closeCustomEventModal: Function,
  orgTimeZone: string,
  userLocale: string,
  canShowTreatments: boolean,
  canShowRehab: boolean,
  canManageWorkload: boolean,
  squadAthletes: SquadAthletes,
  squadSelection: SquadAthletesSelection,
  updateSquadSelection: Function,
  openEventsPanel: Function, // Unused for now
  onInitialDataLoadFailure: Function,
  eventConditions: EventConditions,
  canCreateGames: boolean,
  canCreateCustomEvents: boolean,
  onSaveEventSuccess: Function,
};

export type TranslatedProps = I18nProps<Props>;

const defaultEventDuration = 60;

const App = (props: TranslatedProps) => {
  const calendarRef: FullCalendarRef = useRef(null);
  const calendarViewTitle =
    calendarRef.current?.calendar?.currentData?.viewTitle;
  useBrowserTabTitle([props.t('Calendar'), calendarViewTitle ?? null]);

  const checkIsMounted = useIsMountedCheck();

  const { toasts, toastDispatch } = useToasts();

  const { trackEvent, hasLoaded } = useEventTracking();

  const [requestStatus, setRequestStatus] = useState<
    'PENDING' | 'SUCCESS' | 'FAILURE'
  >('PENDING');

  const [defaultGameDuration, setDefaultGameDuration] =
    useState<?number>(undefined);

  const optimizedCalendarFilters = useSelector(
    (state) => state.calendarFilters
  );

  const previousOptimizedCalendarFilters = usePrevious(
    optimizedCalendarFilters
  );

  useEffect(() => {
    // Fetch initial data
    getSport().then(
      (sport) => {
        if (!checkIsMounted()) return;
        setDefaultGameDuration(sport.duration);
        setRequestStatus('SUCCESS');
      },
      () => {
        if (!checkIsMounted()) return;
        setRequestStatus('FAILURE');
        props.onInitialDataLoadFailure();
      }
    );
  }, []);

  useEffect(() => {
    if (!window.featureFlags['calendar-back-button-in-events']) return;

    let searchParams;
    try {
      searchParams = new URLSearchParams(new URL(window.location.href).search);
    } catch {
      // Do nothing.
    }
    if (searchParams) {
      const date = searchParams.get('date');
      // The check for calendarViewTitle ensures a correct browser tab title
      // (document.title) will be used.
      if (!(date && calendarRef.current && calendarViewTitle)) return;
      calendarRef.current.getApi().gotoDate(date);
      window.history.pushState({}, document.title, '/calendar');
    }
  }, [calendarRef.current]);

  useEffect(() => {
    const token = $('meta[name=csrf-token]').attr('content');
    props.fetchEvents(
      token,
      props.calendarDates.startDate,
      props.calendarDates.endDate
    );
  }, [
    props.calendarFilters,
    props.calendarDates,
    props.squadSelection,
    optimizedCalendarFilters,
  ]);

  useEffect(() => {
    if (
      hasLoaded &&
      optimizedCalendarFilters &&
      !_isEqual(optimizedCalendarFilters, previousOptimizedCalendarFilters)
    ) {
      // Extract keys from optimizedCalendarFilters if they have been selected
      const selectedFilters = [];
      Object.entries(optimizedCalendarFilters).forEach(
        ([filterKey, filterValue]) =>
          // $FlowIgnore filterValue is array
          filterValue.length > 0 && selectedFilters.push(filterKey)
      );

      trackEvent('Filter calendar', getCalendarFilterData(selectedFilters));
    }
  }, [optimizedCalendarFilters, previousOptimizedCalendarFilters, hasLoaded]);

  const getAddEventMenuItems = (): Array<TooltipItem> => {
    const items = [
      ...(props.canCreateGames
        ? [
            {
              description: props.t('Game'),
              onClick: () => props.openGameModal(),
            },
          ]
        : []),
      {
        description: props.t('Session'),
        onClick: () => props.openSessionModal(),
      },
      ...(props.canCreateCustomEvents
        ? [
            {
              description: props.t('Event'),
              onClick: () => props.openCustomEventModal(),
            },
          ]
        : []),
    ];

    return items;
  };

  const getSessionFilters = () => {
    if (window.featureFlags['web-calendar-athlete-filter']) {
      const selectedItems: Array<string> = [];
      let filters: Array<MultiSelectDropdownItem> = [];
      if (window.featureFlags['calendar-hide-all-day-slot']) {
        filters = [
          {
            name: props.t('Training Sessions'),
            id: eventTypeFilterEnumLike.squadSessions,
          },
          {
            name: props.t('Games'),
            id: eventTypeFilterEnumLike.games,
          },
        ];

        if (props.calendarFilters.squadSessionsFilter) {
          selectedItems.push(eventTypeFilterEnumLike.squadSessions);
        }

        if (props.calendarFilters.gamesFilter) {
          selectedItems.push(eventTypeFilterEnumLike.games);
        }
      } else {
        filters = [
          {
            name: props.t('Squad Sessions'),
            id: eventTypeFilterEnumLike.squadSessions,
          },
          {
            name: props.t('Individual Sessions'),
            id: eventTypeFilterEnumLike.individualSessions,
          },
          {
            name: props.t('Games'),
            id: eventTypeFilterEnumLike.games,
          },
        ];

        if (props.canShowTreatments) {
          filters.push({
            name: props.t('Treatments'),
            id: eventTypeFilterEnumLike.treatments,
          });
        }

        if (props.canShowRehab) {
          filters.push({
            name: props.t('Rehab'),
            id: eventTypeFilterEnumLike.rehab,
          });
        }

        if (props.calendarFilters.squadSessionsFilter) {
          selectedItems.push(eventTypeFilterEnumLike.squadSessions);
        }

        if (props.calendarFilters.individualSessionsFilter) {
          selectedItems.push(eventTypeFilterEnumLike.individualSessions);
        }

        if (props.calendarFilters.gamesFilter) {
          selectedItems.push(eventTypeFilterEnumLike.games);
        }

        if (props.calendarFilters.treatmentsFilter) {
          selectedItems.push(eventTypeFilterEnumLike.treatments);
        }

        if (props.calendarFilters.rehabFilter) {
          selectedItems.push(eventTypeFilterEnumLike.rehab);
        }
      }

      if (window.featureFlags['custom-events']) {
        filters.push({
          name: props.t('Events'),
          id: eventTypeFilterEnumLike.customEvents,
        });

        if (props.calendarFilters.customEventsFilter) {
          selectedItems.push(eventTypeFilterEnumLike.customEvents);
        }
      }

      return (
        <Fragment>
          <div className="calendarPage__sessionFilters calendarPage__sessionFilters--dropdownFilterEvents">
            <MultiSelectDropdown
              hasSearch={false}
              invalid={false}
              isOptional={false}
              label=""
              dropdownTitle={
                selectedItems.length < 1
                  ? props.t('Select event type')
                  : undefined
              }
              listItems={filters}
              onItemSelect={(filter) => {
                props.updateCalendarFilters(filter);
              }}
              selectedItems={selectedItems}
            />
          </div>
          <div className="calendarPage__sessionFilters calendarPage__sessionFilters--dropdownFilterAthletes">
            <AthleteSelector
              squadAthletes={props.squadAthletes}
              selectedSquadAthletes={props.squadSelection}
              singleSelection={false}
              onSelectSquadAthletes={(squadAthletesSelection) => {
                props.updateSquadSelection(squadAthletesSelection);
              }}
              onlyAthletes
            />
          </div>
        </Fragment>
      );
    }

    return (
      <div className="calendarPage__sessionFilters">
        <div className="calendarPage__sessionFilterCheckbox">
          <Checkbox
            label={props.t('Squad Sessions')}
            id="squadSessionsFilter"
            isChecked={props.calendarFilters.squadSessionsFilter}
            toggle={(checkbox) => props.updateCalendarFilters(checkbox)}
            name="calendar_squad_sessions_filter"
          />
        </div>
        <div className="calendarPage__sessionFilterCheckbox">
          <Checkbox
            label={props.t('Individual Sessions')}
            id="individualSessionsFilter"
            isChecked={props.calendarFilters.individualSessionsFilter}
            toggle={(checkbox) => props.updateCalendarFilters(checkbox)}
            name="calendar_individual_sessions_filter"
          />
        </div>
        <div className="calendarPage__sessionFilterCheckbox">
          <Checkbox
            label={props.t('Games')}
            id="gamesFilter"
            isChecked={props.calendarFilters.gamesFilter}
            toggle={(checkbox) => props.updateCalendarFilters(checkbox)}
            name="calendar_games_filter"
          />
        </div>

        {props.canShowTreatments && (
          <div className="calendarPage__sessionFilterCheckbox">
            <Checkbox
              label={props.t('Treatments')}
              id="treatmentsFilter"
              isChecked={props.calendarFilters.treatmentsFilter}
              toggle={(checkbox) => props.updateCalendarFilters(checkbox)}
              name="calendar_treatments_filter"
            />
          </div>
        )}
        {props.canShowRehab && (
          <div className="calendarPage__sessionFilterCheckbox">
            <Checkbox
              label={props.t('Rehab')}
              id="rehabFilter"
              isChecked={props.calendarFilters.rehabFilter}
              toggle={(checkbox) => props.updateCalendarFilters(checkbox)}
              name="calendar_rehab_sessions_filter"
            />
          </div>
        )}
        {window.featureFlags['custom-events'] && (
          <div className="calendarPage__sessionFilterCheckbox">
            <Checkbox
              label={props.t('Events')}
              id="customEventsFilter"
              isChecked={props.calendarFilters.customEventsFilter}
              toggle={(checkbox) => props.updateCalendarFilters(checkbox)}
              name="calendar_custom_events_filter"
            />
          </div>
        )}
      </div>
    );
  };

  const calculateNewEventType = () => {
    if (props.isGameModalOpen) {
      return 'game_event';
    }
    if (props.isSessionModalOpen) {
      return 'session_event';
    }
    if (props.isCustomEventModalOpen) {
      return 'custom_event';
    }
    return '';
  };

  const closeModal = () => {
    if (props.isGameModalOpen) {
      props.closeGameModal();
    } else if (props.isSessionModalOpen) {
      props.closeSessionModal();
    } else {
      props.closeCustomEventModal();
    }
  };

  const onSaveEventSuccess = () => {
    props.onSaveEventSuccess();
    closeModal();
  };

  const fileUploadStart = (fileId, fileName) =>
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: fileId,
        title: `Uploading ${fileName}`,
        status: 'LOADING',
      },
    });

  const fileUploadSuccess = (fileName, fileId) =>
    toastDispatch({
      type: 'UPDATE_TOAST',
      toast: {
        id: fileId,
        title: `${fileName} uploaded successfully`,
        status: 'SUCCESS',
      },
    });

  const fileUploadFailure = (fileName, fileId) =>
    toastDispatch({
      type: 'UPDATE_TOAST',
      toast: {
        id: fileId,
        title: `${fileName} upload failed`,
        status: 'ERROR',
      },
    });

  return (
    <div className="calendarPage">
      {window.featureFlags['optimized-calendar'] ? null : (
        <div className="calendarPage__controls">
          <>
            {getSessionFilters()}
            <div className="calendarPage__addEventButtons">
              <TooltipMenu
                placement="bottom-start"
                offset={[0, 10]}
                tooltipTriggerElement={
                  <TextButton
                    text=""
                    size="small"
                    iconBefore="icon-add"
                    type="primary"
                    onClick={() => {}}
                  />
                }
                menuItems={getAddEventMenuItems()}
              />
            </div>
          </>
        </div>
      )}
      <Calendar
        ref={calendarRef}
        orgTimeZone={props.orgTimeZone}
        userLocale={props.userLocale}
        getAddEventMenuItems={() => getAddEventMenuItems()}
      />

      <>
        <div className="calendarPage__eventTooltip">
          {requestStatus === 'SUCCESS' && defaultGameDuration != null && (
            <EventTooltip
              orgTimeZone={props.orgTimeZone}
              defaultEventDuration={defaultEventDuration}
              defaultGameDuration={defaultGameDuration}
              calendarRef={calendarRef}
            />
          )}
        </div>

        <div className="calendarPage__slideout">
          {props.isEventsPanelOpen && requestStatus === 'PENDING' && (
            <DelayedLoadingFeedback />
          )}
          {requestStatus === 'SUCCESS' && defaultGameDuration != null && (
            <CalendarEventsPanel
              calendarRef={calendarRef}
              defaultEventDuration={defaultEventDuration}
              defaultGameDuration={defaultGameDuration}
              canManageWorkload={props.canManageWorkload}
              eventConditions={props.eventConditions}
              onFileUploadStart={fileUploadStart}
              onFileUploadSuccess={fileUploadSuccess}
              onFileUploadFailure={fileUploadFailure}
            />
          )}
        </div>
      </>
      <EventSidePanel
        isOpen={
          props.isGameModalOpen ||
          props.isSessionModalOpen ||
          props.isCustomEventModalOpen
        }
        panelType="SLIDING"
        panelMode="CREATE"
        createNewEventType={calculateNewEventType()}
        redirectToEventOnClose={!window.featureFlags['event-attachments']}
        onClose={closeModal}
        canManageWorkload={props.canManageWorkload}
        eventConditions={props.eventConditions}
        onSaveEventSuccess={() => {
          if (window.featureFlags['event-attachments']) {
            onSaveEventSuccess();
          }
        }}
        onFileUploadStart={fileUploadStart}
        onFileUploadSuccess={fileUploadSuccess}
        onFileUploadFailure={fileUploadFailure}
      />
      <ToastDialog
        toasts={toasts}
        onCloseToast={(id) => {
          toastDispatch({
            type: 'REMOVE_TOAST_BY_ID',
            id,
          });
        }}
      />
      <AppStatus />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
