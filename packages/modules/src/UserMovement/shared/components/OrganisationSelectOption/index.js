// @flow
import { Avatar, Typography, Stack } from '@kitman/playbook/components';

import type { MovementOrganisation } from '../../types';

type Props = {
  organisation?: MovementOrganisation,
};

const OrganisationSelectOption = (props: Props) => {
  if (!props.organisation) return null;

  return (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
      <Avatar
        sx={{ width: 24, height: 24 }}
        alt={props.organisation.name}
        src={props.organisation.logo_full_path}
      />
      <Typography
        variant="body2"
        component="div"
        sx={{ color: 'text.primary' }}
      >
        {props.organisation.name}
      </Typography>
    </Stack>
  );
};

export default OrganisationSelectOption;
