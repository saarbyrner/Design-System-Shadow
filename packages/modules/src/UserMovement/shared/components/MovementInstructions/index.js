/* eslint-disable camelcase */
// @flow
import { useMemo, type Node } from 'react';
import { useSelector } from 'react-redux';
import { Stack, Typography } from '@kitman/playbook/components';
import { getFormState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';

import { getInstructions } from '../../config';

const MovementInstructions = (): Node => {
  const { transfer_type } = useSelector(getFormState);

  const instructions = useMemo(
    () => getInstructions({ type: transfer_type }),
    [transfer_type]
  );

  return (
    <Stack direction="column" sx={{ mt: 2, overflowX: 'hidden' }}>
      <Typography
        variant="body2"
        sx={{ color: 'text.primary', fontWeight: 'bold' }}
      >
        {instructions?.title}:
      </Typography>
      <ul>
        {instructions?.steps?.map((step) => (
          <li
            style={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
            key={step}
          >
            {step}
          </li>
        ))}
      </ul>
    </Stack>
  );
};

export default MovementInstructions;
