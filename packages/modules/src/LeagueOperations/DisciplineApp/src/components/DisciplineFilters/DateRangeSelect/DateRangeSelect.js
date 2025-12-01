// @flow

import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import { Box } from '@mui/material';
import moment from 'moment';

const DateRangeSelect = ({
  searchQuery,
  initialValue,
}: {
  searchQuery: (query: Object) => void,
  initialValue: {
    start_date: string | null,
    end_date: string | null,
  },
}) => {
  const getInitialValue = () => {
    if (!initialValue.start_date || !initialValue.end_date) {
      return undefined;
    }

    return [moment(initialValue.start_date), moment(initialValue.end_date)];
  };

  return (
    <Box
      sx={{
        m: 1,
        flex: '1 1 auto',
        minWidth: 124,
        maxWidth: 260,
      }}
    >
      <CustomDateRangePicker
        variant="muiFilled"
        value={getInitialValue()}
        label="Date range"
        onChange={searchQuery}
      />
    </Box>
  );
};

export default DateRangeSelect;
