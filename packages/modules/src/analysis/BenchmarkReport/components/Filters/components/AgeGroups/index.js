// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useEffect } from 'react';

import { Select } from '@kitman/components';
import type { BenchmarkAgeGroup } from '@kitman/services/src/services/benchmarking/getBenchmarkAgeGroups';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import { useGetAgeGroupsQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import { AGE_GROUPS_IDS } from '@kitman/modules/src/analysis/BenchmarkReport/consts';

type Props = {
  widthCalc: number,
  isValid: boolean,
  errorMessage: string,
};

const AgeGroups = (props: I18nProps<Props>) => {
  const { filter, setFilter } = useFilter(AGE_GROUPS_IDS);
  const { data: ageGroupOptions, isFetching } = useGetAgeGroupsQuery();

  const mapAgeGroupOptions = (options: Array<BenchmarkAgeGroup>) => {
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

  useEffect(() => {
    if (window.getFlag('bm-testing-limit-season-and-age-filter')) return;
    setFilter([]);
  }, []);

  return (
    <span css={getFilterStyles(props.widthCalc)}>
      <Select
        data-testid="BenchmarkFilters|AgeGroups"
        label={
          window.getFlag('bm-testing-limit-season-and-age-filter')
            ? props.t('Age group')
            : props.t('Age group(s)')
        }
        options={mapAgeGroupOptions(ageGroupOptions)}
        onChange={(value) => setFilter(value)}
        value={filter}
        isLoading={isFetching}
        isMulti={!window.getFlag('bm-testing-limit-season-and-age-filter')}
        allowSelectAll={
          !window.getFlag('bm-testing-limit-season-and-age-filter')
        }
        allowClearAll={
          !window.getFlag('bm-testing-limit-season-and-age-filter')
        }
        invalid={!props.isValid}
        displayValidationText={!props.isValid}
        customValidationText={props.errorMessage}
      />
    </span>
  );
};

export const AgeGroupsTranslated: ComponentType<Props> =
  withNamespaces()(AgeGroups);
export default AgeGroups;
