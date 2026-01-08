// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { ViewMountArg } from '@fullcalendar/core';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { CalendarHeaderTranslated as CalendarHeader } from './CalendarHeader';
import { CalendarFiltersTranslated as CalendarFilters } from './CalendarFilters';
import { CalendarSettingsTranslated as CalendarSettings } from './CalendarSettings';
import { FullCalendarComponentTranslated as FullCalendarComponent } from './FullCalendarComponent';
import styles from './utils/styles';
import { getFilters } from './CalendarFilters/redux/selectors/filters';
import type {
  FullCalendarDrilledDownProps,
  CalendarViewOption,
  EventClickObject,
  GetAddEventMenuItems,
} from './utils/types';
import type { Filters } from './CalendarFilters/redux/types';

type Props = {
  handleEventClick: (eventObject: EventClickObject) => void,
  selectedCalendarView: CalendarViewOption,
  onViewChange: (view: ViewMountArg) => void,
  forwardedRef: any,
  getAddEventMenuItems: GetAddEventMenuItems,
} & FullCalendarDrilledDownProps;

type TranslatedProps = I18nProps<Props>;

const Calendar = ({
  handleEventClick,
  onViewChange,
  selectedCalendarView,
  t,
  forwardedRef,
  getAddEventMenuItems,
  ...restFullCalendarProps
}: TranslatedProps) => {
  const [currentCalendarView, setCurrentCalendarView] =
    useState(selectedCalendarView);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const filters: Filters = useSelector(getFilters);
  const numberOfActiveFilters = Object.values(filters).filter(
    // $FlowIgnore[incompatible-use] It's always an array
    (filterValue) => filterValue.length > 0
  ).length;

  return (
    <div css={styles.pageContainer}>
      {!window.featureFlags['hide-calendar-settings-cog'] && (
        <CalendarSettings
          isPanelOpen={isSettingsPanelOpen}
          togglePanel={() => setIsSettingsPanelOpen(false)}
        />
      )}
      {window.featureFlags['optimized-calendar'] && (
        <>
          <div css={styles.calendarHeaderContainer}>
            <CalendarHeader
              calendarRef={forwardedRef}
              getAddEventMenuItems={getAddEventMenuItems}
              initialView={currentCalendarView || 'dayGridMonth'}
              openSettingsPanel={() => setIsSettingsPanelOpen(true)}
              setIsFiltersPanelOpen={setIsFiltersPanelOpen}
              isFiltersPanelOpen={isFiltersPanelOpen}
              numberOfActiveFilters={numberOfActiveFilters}
            />
          </div>
        </>
      )}
      <div css={styles.calendarWrapper}>
        {window.featureFlags['optimized-calendar'] && (
          <CalendarFilters
            isPanelOpen={isFiltersPanelOpen}
            togglePanel={() => setIsFiltersPanelOpen(false)}
          />
        )}
        <FullCalendarComponent
          onViewDidMount={(info) => {
            onViewChange(info);
            setCurrentCalendarView(info.view.type);
          }}
          forwardedRef={forwardedRef}
          handleEventClick={handleEventClick}
          currentCalendarView={currentCalendarView}
          {...restFullCalendarProps}
        />
      </div>
    </div>
  );
};

export const CalendarTranslated: ComponentType<Props> =
  withNamespaces()(Calendar);
export default Calendar;
