// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';

import ActiveFiltersIndicator from './ActiveFiltersIndicator';
import styles from './utils/styles';

type Props = { translatedTitle: string, numberOfActiveFilters: number };

const boldStyles = css([styles.title, styles.boldTitle]);

const AccordionTitle: ComponentType<Props> = ({
  translatedTitle,
  numberOfActiveFilters,
}: Props) => {
  return (
    <div css={styles.titleContainer}>
      <p css={numberOfActiveFilters > 0 ? boldStyles : styles.title}>
        {translatedTitle}
      </p>
      <ActiveFiltersIndicator numberOfActiveFilters={numberOfActiveFilters} />
    </div>
  );
};

export default AccordionTitle;
