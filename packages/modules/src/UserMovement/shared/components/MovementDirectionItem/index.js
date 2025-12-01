// @flow
import {
  Box,
  ListItem,
  ListItemAvatar,
  Typography,
  ListItemText,
  Avatar,
} from '@kitman/playbook/components';

import type { MovementOrganisation } from '../../types';

type Props = {
  label: string,
  organisation: MovementOrganisation,
};

const MovementDirectionItem = (props: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="body2"
        sx={{ color: 'text.primary', fontWeight: 'bold' }}
      >
        {props.label}
      </Typography>
      <ListItem sx={{ px: 0 }}>
        <ListItemAvatar>
          <Avatar
            alt={props.organisation?.name}
            src={props.organisation?.logo_full_path}
          />
        </ListItemAvatar>
        <ListItemText>
          <Typography
            variant="body2"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            {props.organisation?.unassigned_org_name ??
              props.organisation?.name}
          </Typography>
        </ListItemText>
      </ListItem>
    </Box>
  );
};

export default MovementDirectionItem;
