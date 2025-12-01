// @flow
import { colors } from '@kitman/common/src/variables';

const styles = {
  columns: (columnsCount: number) => ({
    display: 'grid',
    gap: 1,
    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
  }),
  optionalField: {
    marginLeft: '3px',
    fontSize: '12px',
    color: colors.grey_100,
  },
};

export default styles;
