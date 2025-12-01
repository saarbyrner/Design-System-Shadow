// @flow

import moment from 'moment';
import {
  getPersistedCommentsFilters,
  setPersistedCommentsFilters,
} from '@kitman/modules/src/Medical/shared/utils/CommentsFilters';
import { getActiveSquad } from '@kitman/services';
import { keyboardkeys } from '@kitman/common/src/variables';
import type {
  CoachesReportPayload,
  FiltersType,
} from '@kitman/modules/src/Medical/shared/components/CoachesReportRefactorTab/types';

export const gridBottomMarginToHideOverflowOnBody = '70px';
export const cellNotBeingEditedValue = -1; // used to set editingcellsId state to a default value
export const richTextEditorContentWrapperLength = 7; // RichTextEditor returns text wrapped in '<p></p>' (7 chars long)

export const navigationKeys = [
  keyboardkeys.space,
  keyboardkeys.upArrow,
  keyboardkeys.downArrow,
  keyboardkeys.leftArrow,
  keyboardkeys.rightArrow,
];

// Container functions
export const fetchFilters = async (
  setGridPayload: (payload: CoachesReportPayload) => void,
  gridPayload: CoachesReportPayload
): Promise<void> => {
  try {
    const persistedFilters = getPersistedCommentsFilters(
      gridPayload.filters,
      ['squads', 'positions', 'availabilities', 'issues'],
      'roster'
    );

    if (persistedFilters?.squads?.length) {
      // $FlowIgnore - flow is picking up on the function state setter as opposed to the value it returns
      setGridPayload((prev: CoachesReportPayload) => {
        return {
          ...prev,
          filters: { ...prev.filters, ...persistedFilters },
          next_id: null,
        };
      });
    } else {
      const { id } = await getActiveSquad();
      // $FlowIgnore - flow is picking up on the function state setter as opposed to the value it returns
      setGridPayload((prev: CoachesReportPayload) => ({
        ...prev,
        filters: {
          ...prev.filters,
          squads: id ? [id] : [],
          athlete_name: '',
          availabilities: [],
          issues: [],
          positions: [],
          report_date: moment().toISOString(),
        },
        next_id: null,
      }));
    }
  } catch (error) {
    // $FlowIgnore - flow is picking up on the function state setter as opposed to the value it returns
    setGridPayload((prev: CoachesReportPayload) => ({
      ...prev,
      filters: {
        squads: [],
        athlete_name: '',
        availabilities: [],
        issues: [],
        positions: [],
        report_date: moment().toISOString(),
      },
      next_id: null,
    }));
  }
};

export const persistLocalFilters = (filters: FiltersType) => {
  if (Array.isArray(filters.squads)) {
    setPersistedCommentsFilters(
      ['squads', 'positions', 'availabilities', 'issues'],
      filters,
      'roster'
    );
  }
};
