// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { Select } from '@kitman/components';
import type { BenchmarkMaturationStatus } from '@kitman/services/src/services/benchmarking/getBenchmarkMaturationStatuses';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import { useGetMaturationStatusesQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import { MATURATION_STATUS_IDS } from '@kitman/modules/src/analysis/BenchmarkReport/consts';

type Props = {
  widthCalc: number,
};

const MaturationStatuses = (props: I18nProps<Props>) => {
  const { filter, setFilter } = useFilter(MATURATION_STATUS_IDS);
  const { data: maturationStatusOptions, isFetching } =
    useGetMaturationStatusesQuery();

  const mapMaturationStatusOptions = (
    options: Array<BenchmarkMaturationStatus>
  ) => {
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
        data-testid="BenchmarkFilters|AgeGroups"
        label={props.t('Maturation status')}
        options={mapMaturationStatusOptions(maturationStatusOptions)}
        onChange={(value) => setFilter(value)}
        value={filter}
        isLoading={isFetching}
        isMulti
        allowSelectAll
        allowClearAll
      />
    </span>
  );
};

export const MaturationStatusesTranslated: ComponentType<Props> =
  withNamespaces()(MaturationStatuses);
export default MaturationStatuses;
