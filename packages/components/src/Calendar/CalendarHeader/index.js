// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import type { ComponentType } from 'react';

import { Badge, DatePicker } from '@kitman/playbook/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import coreEngagementEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/coreEngagement';
import { TooltipMenu, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FullCalendarRef } from '@kitman/modules/src/CalendarPage/src/types';

import { ButtonDatePicker } from './ButtonDatePicker';
import ViewOptions from './ViewOptions';
import styles from './styles';
import type { GetAddEventMenuItems, CalendarViewOption } from '../utils/types';

const Separator = () => <div css={styles.separator} />;
export const settingsSidePanelButtonTestId =
  'CalendarHeader|settingsSidePanelButton';

export type Props = {
  calendarRef?: FullCalendarRef,
  getAddEventMenuItems: GetAddEventMenuItems,
  initialView: CalendarViewOption,
  openSettingsPanel: () => void,
  setIsFiltersPanelOpen: (isOpen: boolean) => void,
  isFiltersPanelOpen: boolean,
  numberOfActiveFilters: number,
};

type TranslatedProps = I18nProps<Props>;

export const CalendarHeader = ({
  calendarRef,
  getAddEventMenuItems,
  initialView,
  openSettingsPanel,
  setIsFiltersPanelOpen,
  isFiltersPanelOpen,
  numberOfActiveFilters,
  t,
}: TranslatedProps) => {
  const { trackEvent } = useEventTracking();
  const calApi = calendarRef?.current?.getApi();
  const [currentDate, setCurrentDate] = useState(
    calApi ? moment(calApi.getDate()) : null
  );
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const calApiDate = calApi?.getDate();

  useEffect(() => {
    if (calApi) {
      const newDate = moment(calApi.getDate());
      if (!newDate.isSame(currentDate, 'day')) {
        setCurrentDate(newDate);
      }
    }
  }, [calApi, calApiDate, currentDate]);

  const buttonRef = useCallback((node) => {
    if (node !== null) {
      setAnchorEl(node);
    }
  }, []);

  const handleDateChange = (date: 'prev' | 'today' | 'next' | Date): void => {
    if (!calApi) {
      return;
    }

    if (date === 'prev') {
      trackEvent(coreEngagementEventNames.calendarPreviousPeriodClicked, {
        Location: 'Calendar',
        'User Type': 'Staff',
      });
      calApi.prev();
    } else if (date === 'next') {
      trackEvent(coreEngagementEventNames.calendarNextPeriodClicked, {
        Location: 'Calendar',
        'User Type': 'Staff',
      });
      calApi.next();
    } else if (date === 'today') {
      trackEvent(coreEngagementEventNames.calendarTodayClicked, {
        Location: 'Calendar',
        'User Type': 'Staff',
      });
      calApi.today();
    } else {
      calApi.gotoDate(date);
      setCurrentDate(moment(date));
    }
  };

  const getDisplayTitle = useCallback(() => {
    if (calApi) {
      return calApi.currentData.viewTitle;
    }
    return '';
  }, [calApi]);

  const renderButtonField = useCallback(
    (props) => (
      <ButtonDatePicker
        {...props}
        ref={buttonRef}
        setOpen={(isOpen) => {
          if (isOpen)
            trackEvent(coreEngagementEventNames.calendarDatePickerClicked);
          setPickerOpen(isOpen);
        }}
      >
        {getDisplayTitle()}
      </ButtonDatePicker>
    ),
    [buttonRef, setPickerOpen, getDisplayTitle]
  );
  return (
    <div css={styles.container}>
      <div css={styles.leftSideContainer}>
        {window.featureFlags['optimized-calendar'] && (
          <Badge badgeContent={numberOfActiveFilters} color="primary">
            <TextButton
              className="show-filters-button"
              onClick={() => {
                trackEvent(coreEngagementEventNames.calendarFiltersClicked, {
                  Location: 'Calendar',
                  'User Type': 'Staff',
                });
                setIsFiltersPanelOpen(!isFiltersPanelOpen);
              }}
              text={t('Show Filters')}
              iconAfter="icon-filter"
              kitmanDesignSystem
              type="secondary"
            />
          </Badge>
        )}
        <TextButton
          text={t('Today')}
          onClick={() => handleDateChange('today')}
          type="secondary"
          kitmanDesignSystem
        />
        <TextButton
          onClick={() => handleDateChange('prev')}
          kitmanDesignSystem
          iconAfter="icon-next-left"
          type="secondary"
        />
        <TextButton
          onClick={() => handleDateChange('next')}
          kitmanDesignSystem
          iconAfter="icon-next-right"
          type="secondary"
        />
      </div>

      {window.getFlag('calendar-navigation-improvements') ? (
        <div css={[styles.titleContainer, { flex: 1 }]}>
          <DatePicker
            views={
              initialView === 'dayGridMonth'
                ? ['month', 'year']
                : ['day', 'month', 'year']
            }
            value={currentDate}
            open={isPickerOpen}
            onClose={() => {
              setPickerOpen(false);
            }}
            onChange={(date) => {
              trackEvent(coreEngagementEventNames.calendarDatePickerClicked, {
                Location: 'Calendar',
                'User Type': 'Staff',
              });
              if (calApi && calApi.gotoDate) {
                calApi.gotoDate(date.toDate());
              }
              setPickerOpen(false);
            }}
            slotProps={{
              popper: { anchorEl },
            }}
            slots={{
              field: renderButtonField,
            }}
          />
        </div>
      ) : (
        <div css={{ flex: 1, textAlign: 'center' }}>
          <h2 css={styles.pageTitle}>{getDisplayTitle()}</h2>
        </div>
      )}

      <div css={styles.viewOptionsContainer}>
        {!window.featureFlags['hide-calendar-settings-cog'] && (
          <>
            <Separator />
            <TextButton
              kitmanDesignSystem
              iconAfter="icon-settings"
              type="link"
              onClick={openSettingsPanel}
              testId={settingsSidePanelButtonTestId}
            />
          </>
        )}
        <Separator />
        <ViewOptions
          calApi={calApi}
          initialView={initialView}
          trackEvent={trackEvent}
        />
        <TooltipMenu
          placement="bottom-start"
          offset={[0, 10]}
          tooltipTriggerElement={
            <TextButton
              testId="CalendarHeader|TooltipMenu|Add"
              text={t('Add')}
              size="small"
              iconAfter="icon-chevron-down"
              type="primary"
              onClick={() => {}}
              kitmanDesignSystem
            />
          }
          menuItems={getAddEventMenuItems()}
        />
      </div>
    </div>
  );
};

export const CalendarHeaderTranslated: ComponentType<Props> =
  withNamespaces()(CalendarHeader);
export default CalendarHeader;
