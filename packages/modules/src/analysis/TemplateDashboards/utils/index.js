// @flow
import type { StaffUserType } from '@kitman/common/src/types/Staff';
import type { Options } from '@kitman/components/src/types';
import type {
  WidgetColor,
  WidgetColors,
} from '@kitman/modules/src/analysis/shared/types/charts';

import { MAIN_COLORS } from '../components/XYChart/constants';

export const isDevelopmentJourney = (): boolean => {
  return window.location.pathname.includes('development_journey');
};

export const isMedicalSummary = (): boolean => {
  return window.location.pathname.includes('medical');
};

export const isCoachingSummary = (): boolean => {
  return window.location.pathname.includes('coaching_summary');
};

export const isGrowthAndMaturationReport = (): boolean => {
  return window.location.pathname.includes('growth_and_maturation');
};
export const isStaffDevelopment = (): boolean => {
  return window.location.pathname.includes('staff_development');
};

export const isColorCodedChart = (
  config: Object,
  widgetGrouping: string
): boolean => {
  if (config?.groupings) {
    return (
      config.groupings.findIndex(
        (configGrouping) => configGrouping === widgetGrouping
      ) > -1
    );
  }
  return false;
};

export const getLocalStorageKey = (): string => {
  const pathName = window.location.pathname;
  const PREFIX = 'Reporting|templateDashboardsFilter';
  const keyMap = {
    coaching_summary: 'Coaching',
    development_journey: 'Development',
    medical: 'Medical',
    growth_and_maturation: 'GrowthAndMaturation',
    staff_development: 'StaffDevelopment',
  };
  const [, , , dashboardKey] = pathName.split('/');
  const localStorageKey = keyMap[dashboardKey];

  return `${PREFIX}${localStorageKey}`;
};

export const getInitialTab = (tabPanes: Object[]) => {
  return (
    tabPanes?.find((tabPane) => tabPane.tabHash === window.location.hash)
      ?.tabKey || '0'
  );
};

export const getSortedStaffUsers = (users: StaffUserType[]): Options[] => {
  return users
    .map(({ id, fullname }) => ({
      value: id,
      label: fullname,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      if (lowercaseA > lowercaseB) {
        return 1;
      }
      if (lowercaseA < lowercaseB) {
        return -1;
      }
      return 0;
    });
};

export const getWidgetCategoryColors = (metaData: Object) => {
  if (Object.keys(metaData).length === 0) {
    return ({
      grouping: '',
      colors: ([]: Object[]),
    }: WidgetColors);
  }
  if (metaData?.global_colours?.data && metaData?.global_colours?.grouping) {
    const categories = metaData.global_colours.data;
    const groupedCategoryColors = ({
      grouping: metaData?.global_colours.grouping,
      colors: ([]: Object),
    }: WidgetColors);
    let colorIndex = 0;
    categories.forEach((category) => {
      // Reassign colors from start of the MAIN_COLORS if there are more categories than colors
      colorIndex = colorIndex >= MAIN_COLORS.length ? 0 : colorIndex;
      const categoryColor = ({
        label: (category: string),
        value: (MAIN_COLORS[colorIndex]: string),
      }: WidgetColor);

      groupedCategoryColors.colors.push(categoryColor);

      colorIndex += 1;
    });
    return groupedCategoryColors;
  }
  return ({
    grouping: '',
    colors: ([]: Object[]),
  }: WidgetColors);
};
