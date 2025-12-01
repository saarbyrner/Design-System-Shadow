// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { Select } from '@kitman/components';
import { type PositionGroups } from '@kitman/services/src/services/getPositionGroups';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetPositionGroupsQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import { POSITIONS_IDS } from '@kitman/modules/src/analysis/BenchmarkReport/consts';

type Props = {
  widthCalc: number,
};

const Positions = (props: I18nProps<Props>) => {
  const filterType = POSITIONS_IDS;
  const { filter, setFilter } = useFilter(filterType);

  const { data: positionGroupOptions, isFetching } =
    useGetPositionGroupsQuery();

  const mapPositionGroupOptions = (options: PositionGroups) => {
    if (!options) {
      return [];
    }

    return options.map((option) => ({
      label: option.name,
      value: option.id,
    }));
  };

  return (
    <span css={getFilterStyles(props.widthCalc)}>
      <Select
        data-testid="BenchmarkFilters|TestingWindows"
        label={props.t('Position(s)')}
        options={mapPositionGroupOptions(positionGroupOptions)}
        onChange={(value) => setFilter(value)}
        value={filter}
        isLoading={isFetching}
        isMulti
      />
    </span>
  );
};

export const PositionsTranslated: ComponentType<Props> =
  withNamespaces()(Positions);
export default Positions;
