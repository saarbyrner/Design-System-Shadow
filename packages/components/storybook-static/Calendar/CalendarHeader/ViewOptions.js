// @flow
import { useMemo, useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import type { CalendarApi } from '@fullcalendar/core';

import coreEngagementEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/coreEngagement';
import { TooltipMenu, TextButton } from '@kitman/components';
import type { CalendarViewOption } from '../utils/types';

// New static keys that are not translatable strings
type ViewKey = 'month' | 'week' | 'day' | 'list';

// A single source of truth for all view-related data
const getViewMap = () => ({
  month: {
    calView: 'dayGridMonth',
    label: i18n.t('Month'),
  },
  week: {
    calView: 'timeGridWeek',
    label: i18n.t('Week'),
  },
  day: {
    calView: 'timeGridDay',
    label: i18n.t('Day'),
  },
  list: {
    calView: 'listWeek',
    label: i18n.t('List'),
  },
});

// A helper function to find our internal key from the initial prop value
const findInitialViewKey = (initialView: CalendarViewOption): ViewKey => {
  const foundKey = Object.keys(getViewMap()).find(
    (key) => getViewMap()[key].calView === initialView
  );
  // Provide a safe default if the initial view is not found
  return foundKey ? (foundKey: ViewKey) : 'month';
};

type Props = {
  initialView: CalendarViewOption,
  calApi?: CalendarApi,
  trackEvent: (string, ?Object) => void,
};

const ViewOptions = ({ initialView, calApi, trackEvent }: Props) => {
  // Use a static key as the state, with a safe fallback
  const [selectedViewKey, setSelectedViewKey] = useState<ViewKey>(
    findInitialViewKey(initialView)
  );

  const menuItems = useMemo(() => {
    const handleViewChange = (chosenView: CalendarViewOption) => {
      if (calApi) {
        calApi.changeView(chosenView);
      }
    };

    // Dynamically generate menu items from the map
    return Object.keys(getViewMap()).map((key: ViewKey) => ({
      // Use the static i18n key for translation
      description: getViewMap()[key].label,
      onClick: () => {
        setSelectedViewKey(key);
        trackEvent(coreEngagementEventNames.calendarViewFormatClicked, {
          selected_view: key,
        });
        handleViewChange(getViewMap()[key].calView);
      },
    }));
  }, [calApi, trackEvent]);

  return (
    <TooltipMenu
      placement="bottom-start"
      offset={[0, 10]}
      tooltipTriggerElement={
        <TextButton
          testId="CalendarHeader|TooltipMenu|ViewOptions"
          // Use the pre-translated label from state
          text={getViewMap()[selectedViewKey]?.label}
          size="small"
          iconAfter="icon-chevron-down"
          type="secondary"
          onClick={() => {}}
          kitmanDesignSystem
        />
      }
      menuItems={menuItems}
    />
  );
};

export default ViewOptions;
