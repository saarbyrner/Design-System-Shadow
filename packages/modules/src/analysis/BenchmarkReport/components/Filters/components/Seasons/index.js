// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useEffect } from 'react';

import { Select } from '@kitman/components';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import { useGetSeasonsQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import {
  SEASONS,
  COMPARE_TO,
} from '@kitman/modules/src/analysis/BenchmarkReport/consts';

type Props = {
  widthCalc: number,
  isComparison?: boolean,
  isValid: boolean,
  errorMessage: string,
};

const Seasons = (props: I18nProps<Props>) => {
  const MAX_SEASONS_NUMBER_IF_LIMITED = 4;

  const filterType = props.isComparison ? COMPARE_TO : SEASONS;
  const { filter, setFilter } = useFilter(filterType);

  const { data: seasonOptions, isFetching } = useGetSeasonsQuery();

  const seasonsFilter = props.isComparison ? filter[SEASONS] : filter;

  const isSeasonsSelectionValid =
    seasonsFilter.length < MAX_SEASONS_NUMBER_IF_LIMITED;

  const mapSeasonsOptions = (options: Array<number>) => {
    if (!options) {
      return [];
    }
    const dataToSort = [...options].sort((a, b) => b - a);

    return dataToSort.map((option) => {
      const shouldDisable =
        (window.getFlag('bm-testing-limit-season-and-age-filter') ||
          window.getFlag('bm-testing-fe-side-performance-optimization')) &&
        !isSeasonsSelectionValid &&
        !seasonsFilter.includes(option);

      return {
        label: `${option}/${option + 1}`,
        value: option,
        isDisabled: shouldDisable,
      };
    });
  };

  const onSetFilter = (value) => {
    if (props.isComparison) {
      const updatedFilters = {
        ...filter,
        seasons: value,
      };
      setFilter(updatedFilters);
    } else {
      setFilter(value);
    }
  };

  useEffect(() => {
    if (seasonOptions?.length > 0) {
      // Sort seasons and select 2 most recent
      const sortedSeasons = [...seasonOptions].sort((a, b) => b - a);
      onSetFilter([sortedSeasons[0]]);
    }
  }, [seasonOptions]);

  return (
    <span css={getFilterStyles(props.widthCalc)}>
      <Select
        isMulti
        allowClearAll
        invalid={!props.isValid}
        displayValidationText={!props.isValid}
        isLoading={isFetching}
        data-testid="BenchmarkFilters|Seasons"
        label={
          window.getFlag('bm-testing-limit-season-and-age-filter') ||
          window.getFlag('bm-testing-fe-side-performance-optimization')
            ? props.t('Seasons (Max: {{max}})', {
                max: MAX_SEASONS_NUMBER_IF_LIMITED,
              })
            : props.t('Season(s)')
        }
        options={mapSeasonsOptions(seasonOptions)}
        onChange={(value) => onSetFilter(value)}
        value={seasonsFilter}
        allowSelectAll={
          !(
            window.getFlag('bm-testing-limit-season-and-age-filter') ||
            window.getFlag('bm-testing-fe-side-performance-optimization')
          )
        }
        customValidationText={props.errorMessage}
        customSelectStyles={fullWidthMenuCustomStyles}
      />
    </span>
  );
};

export const SeasonsTranslated: ComponentType<Props> =
  withNamespaces()(Seasons);
export default Seasons;
