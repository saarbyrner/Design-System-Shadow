// @flow
import type { Node } from 'react';
import styles from './styles';

const PlayerCategory = ({
  name,
  children,
}: {
  name: string,
  children: Node,
}): Node => {
  return (
    <div data-testid={name}>
      <div css={styles.categoryName}>
        <p>{name}</p>
      </div>
      <div css={styles.categoryPlayers}>{children}</div>
    </div>
  );
};

export default PlayerCategory;
