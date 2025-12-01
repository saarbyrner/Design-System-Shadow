// @flow
import { Box, Pagination, PaginationItem } from '@mui/material';
import colors from '@kitman/common/src/variables/colors';

type Props = {
  totalPages: number,
  activePage: number,
  disabled: boolean,
  onChange: Function,
};

export default function GridPagination({
  totalPages,
  activePage,
  onChange,
  disabled,
}: Props) {
  return (
    <Box
      sx={{
        height: 50,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        borderTop: `1px solid ${colors.s14}`,
        px: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={activePage}
        disabled={disabled}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              '&.Mui-selected': {
                backgroundColor: colors.grey_200,
                color: colors.white,
                '&:hover': {
                  backgroundColor: colors.grey_300,
                },
              },
            }}
          />
        )}
        onChange={(event, value) => {
          onChange(value);
        }}
      />
    </Box>
  );
}
