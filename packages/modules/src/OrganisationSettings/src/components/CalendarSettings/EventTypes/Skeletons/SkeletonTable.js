// @flow

import { memo } from 'react';
import { Skeleton } from '@kitman/playbook/components';

import styles from '../../utils/styles';

export const numberOfSkeletonRows = 40;

export const skeletonTestId = 'skeletonTestId';

const SkeletonTable = () => {
  return (
    <div css={styles.skeletonContainer} data-testid={skeletonTestId}>
      {Array(numberOfSkeletonRows)
        .fill(0)
        .map(() => (
          <Skeleton
            variant="rounded"
            height="0.75rem"
            key={Math.random().toString()}
          />
        ))}
    </div>
  );
};

// {} because there aren't any props to this component
export default memo<{}>(SkeletonTable);
