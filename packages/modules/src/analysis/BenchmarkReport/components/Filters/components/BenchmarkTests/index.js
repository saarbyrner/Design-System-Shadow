// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Select } from '@kitman/components';
import type { BenchmarkMetric } from '@kitman/services/src/services/benchmarking/getBenchmarkTests';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import { useGetBenchmarkTestsQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import { TRAINING_VARIABLES_IDS } from '@kitman/modules/src/analysis/BenchmarkReport/consts';

type Props = {
  widthCalc: number,
  isValid: boolean,
  errorMessage: string,
};

const BenchmarkTests = (props: I18nProps<Props>) => {
  const { filter, setFilter } = useFilter(TRAINING_VARIABLES_IDS);
  const { data: benchmarkTestOptions, isFetching } =
    useGetBenchmarkTestsQuery();

  const mapBenchmarkTestOptions = (options: Array<BenchmarkMetric>) => {
    if (!options) {
      return [];
    }
    return options.map((option) => {
      return {
        label: option.name,
        value: option.id,
      };
    });
  };

  return (
    <span css={getFilterStyles(props.widthCalc)}>
      <Select
        data-testid="BenchmarkFilters|BenchmarkTests"
        label={props.t('Benchmark test(s)')}
        options={mapBenchmarkTestOptions(benchmarkTestOptions)}
        onChange={(value) => setFilter(value)}
        value={filter}
        isLoading={isFetching}
        isMulti
        allowSelectAll
        allowClearAll
        invalid={!props.isValid}
        displayValidationText={!props.isValid}
        customValidationText={props.errorMessage}
      />
    </span>
  );
};

export const BenchmarkTestsTranslated: ComponentType<Props> =
  withNamespaces()(BenchmarkTests);
export default BenchmarkTests;
