// @flow
import type { ComponentType } from 'react';

import LocalTextButton from './LocalTextButton';
import styles from './utils/styles';
import {
  incrementOfShownOptions,
  initialNumberOfShownOptions,
} from './utils/consts';

type Props = {
  onClick: (val: number | ((val: number) => number)) => void,
  showMore: string,
  showLess: string,
  numberOfCurrentlyShownOptions: number,
  filteredItemsLength: number,
};

const Footer: ComponentType<Props> = ({
  onClick,
  showMore,
  showLess,
  numberOfCurrentlyShownOptions,
  filteredItemsLength,
}: Props) => {
  const showMoreOrLessButton =
    numberOfCurrentlyShownOptions < filteredItemsLength ? (
      <LocalTextButton
        text={showMore}
        onClick={() =>
          onClick((current) =>
            Math.min(current + incrementOfShownOptions, filteredItemsLength)
          )
        }
      />
    ) : (
      <LocalTextButton
        text={showLess}
        onClick={() => onClick(initialNumberOfShownOptions)}
      />
    );
  return (
    <div css={styles.footer}>
      {filteredItemsLength > initialNumberOfShownOptions &&
        showMoreOrLessButton}
    </div>
  );
};

export default Footer;
