// @flow
import { useSelector } from 'react-redux';
import type { Node } from 'react';
import moment from 'moment';
import { Stack, Typography } from '@kitman/playbook/components';
import { getFormState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';

import { getMovementDate } from '../../config';

const MovementDate = (): Node => {
  // eslint-disable-next-line camelcase
  const { transfer_type, joined_at } = useSelector(getFormState);

  return (
    <Stack direction="row" spacing={2}>
      <Typography
        variant="body2"
        sx={{ color: 'text.primary', fontWeight: 'bold' }}
      >
        {getMovementDate({ type: transfer_type })}:
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {moment(joined_at).format('D MMM YYYY')}
      </Typography>
    </Stack>
  );
};

export default MovementDate;
