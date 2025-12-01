// @flow
/* eslint-disable react/no-array-index-key */

import { Box, Skeleton } from '@kitman/playbook/components';

type Props = {
  rowCount: number,
  columnCount: number,
  columnWidths: Array<number>,
};
const DataGridSkeleton = (props: Props) => {
  const { rowCount, columnCount, columnWidths } = props;
  const style = {
    variant: 'rectangular',
    height: 40,
    sx: {
      m: 0.25,
    },
  };

  return (
    <Box
      sx={{
        height: 'max-content',
      }}
    >
      <Box>
        {[...Array(rowCount)].map((_row, rowIndex) => (
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            key={`row-${rowIndex}`}
          >
            {[...Array(columnCount)].map((_column, columnIndex) => (
              <Skeleton
                {...style}
                width={`${columnWidths[columnIndex]}%`}
                key={`row-${rowIndex}-column-${columnIndex}`}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DataGridSkeleton;
