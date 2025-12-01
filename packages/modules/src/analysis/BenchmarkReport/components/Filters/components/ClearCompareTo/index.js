// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Button } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';

type Props = {
  widthCalc: number,
};

export const COMPARE_TO = 'compare_to';

const ClearCompareTo = (props: I18nProps<Props>) => {
  const compareToFilter = useFilter(COMPARE_TO);

  const clearFilters = () => {
    compareToFilter.clearCompareToFilters();
  };

  return (
    <span
      css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        ...getFilterStyles(props.widthCalc),
      }}
    >
      <Button variant="text" onClick={clearFilters}>
        {props.t('Clear')}
      </Button>
    </span>
  );
};

export const ClearCompareToTranslated: ComponentType<Props> =
  withNamespaces()(ClearCompareTo);
export default ClearCompareTo;
