// @flow
import type { ComponentType } from 'react';

import { numberOfActiveFiltersTestId } from './utils/consts';
import styles from './utils/styles';

type Props = { numberOfActiveFilters: number };

const ActiveFiltersIndicator: ComponentType<Props> = ({
  numberOfActiveFilters,
}: Props) => {
  return (
    <div css={styles.numberContainer}>
      <p data-testid={numberOfActiveFiltersTestId}>{numberOfActiveFilters}</p>
    </div>
  );
};

export default ActiveFiltersIndicator;
