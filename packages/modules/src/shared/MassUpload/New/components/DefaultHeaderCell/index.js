// @flow
import { Box } from '@kitman/playbook/components';

const DefaultHeaderCell = ({ title }: { title: ?string }) => {
  return (
    <Box
      sx={{
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      <Box component="span">{title}</Box>
    </Box>
  );
};

export default DefaultHeaderCell;
