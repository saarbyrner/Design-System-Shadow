// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useEffect } from 'react';

import { Select } from '@kitman/components';
import type { BenchmarkWindowsResponse } from '@kitman/modules/src/Benchmarking/shared/types/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import { useGetTestingWindowsQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import {
  TESTING_WINDOWS_IDS,
  COMPARE_TO,
} from '@kitman/modules/src/analysis/BenchmarkReport/consts';

type Props = {
  widthCalc: number,
  isComparison?: boolean,
  isValid: boolean,
  errorMessage: string,
};

const TestingWindows = (props: I18nProps<Props>) => {
  const filterType = props?.isComparison ? COMPARE_TO : TESTING_WINDOWS_IDS;
  const { filter, setFilter } = useFilter(filterType);

  const { data: testingWindowOptions, isFetching } =
    useGetTestingWindowsQuery();

  const mapTestingWindowsOptions = (options: BenchmarkWindowsResponse) => {
    if (!options) {
      return [];
    }

    return options.map((option) => ({
      label: option.name,
      value: option.id,
    }));
  };

  const onSetFilter = (value) => {
    if (props.isComparison) {
      const updatedFilters = {
        ...filter,
        testing_window_ids: value,
      };
      setFilter(updatedFilters);
    } else {
      setFilter(value);
    }
  };

  useEffect(() => {
    if (testingWindowOptions?.length > 0) {
      onSetFilter(testingWindowOptions.map((window) => window.id));
    }
  }, [testingWindowOptions]);

  return (
    <span css={getFilterStyles(props.widthCalc)}>
      <Select
        data-testid="BenchmarkFilters|TestingWindows"
        label={props.t('Testing window(s)')}
        options={mapTestingWindowsOptions(testingWindowOptions)}
        onChange={(value) => onSetFilter(value)}
        value={props.isComparison ? filter[TESTING_WINDOWS_IDS] : filter}
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

export const TestingWindowsTranslated: ComponentType<Props> =
  withNamespaces()(TestingWindows);
export default TestingWindows;
