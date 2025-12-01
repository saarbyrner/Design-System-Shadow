// @flow
import type { FormulaDataSourcesData } from '@kitman/common/src/utils/TrackingData/src/types/analysis';
import type { InputParams } from '@kitman/modules/src/analysis/shared/types/charts';

const getFormulaDataSources = (
  inputParams: InputParams
): FormulaDataSourcesData => {
  const sources = Object.values(inputParams).map(
    // $FlowIgnore[incompatible-use] - Flow doesn't recognize inputParams nested types
    (input) => input.data_source_type
  );

  return {
    Sources: sources,
  };
};

export default getFormulaDataSources;
