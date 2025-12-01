// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import type { ExportGovernanceParams } from './exportGovernance';

export const exportAthleteCards = async ({
  competitionIds,
}: ExportGovernanceParams): Promise<ExportsItem> => {
  const { data } = await axios.post('/export_jobs/mls_athlete_cards_export', {
    competition_ids: competitionIds,
  });
  return data;
};

export const exportStaffCards = async ({
  competitionIds,
}: ExportGovernanceParams): Promise<ExportsItem> => {
  const { data } = await axios.post('/export_jobs/mls_staff_cards_export', {
    competition_ids: competitionIds,
  });
  return data;
};

export const exportYellowCards = async (
  filters: EventFilters
): Promise<ExportsItem> => {
  const {
    competitions,
    organisations,
    // eslint-disable-next-line camelcase
    squad_names,
    statuses,
    dateRange,
    // eslint-disable-next-line camelcase
    search_expression,
  } = filters;

  const { data } = await axios.post('/export_jobs/yellow_cards_export', {
    filter: {
      competitions,
      organisations,
      squad_names,
      statuses,
      date_range: dateRange,
      search_expression,
    },
  });
  return data;
};

export const exportRedCards = async (
  filters: EventFilters
): Promise<ExportsItem> => {
  const {
    competitions,
    organisations,
    // eslint-disable-next-line camelcase
    squad_names,
    statuses,
    dateRange,
    // eslint-disable-next-line camelcase
    search_expression,
  } = filters;

  const { data } = await axios.post('/export_jobs/red_cards_export', {
    filter: {
      competitions,
      organisations,
      squad_names,
      statuses,
      date_range: dateRange,
      search_expression,
    },
  });
  return data;
};
