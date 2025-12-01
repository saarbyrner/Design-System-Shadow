// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { RowData } from '@kitman/modules/src/analysis/TemplateDashboards/components/Table/Column/types';

export type Population = {
  applies_to_squad: boolean,
  all_squads: boolean,
  position_group: Array<?number>,
  positions: Array<?number>,
  athletes: Array<?number>,
  squads: Array<?number>,
  context_squads: Array<?number>,
};

const getGrowthAndMaturationData = async (
  population: Population
): Promise<Array<RowData>> => {
  const { data } = await axios.post('/reporting/growth_maturation/preview', {
    population,
  });

  return data;
};

export default getGrowthAndMaturationData;
