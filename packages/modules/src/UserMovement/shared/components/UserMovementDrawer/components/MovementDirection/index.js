// @flow
import {
  Stack,
  Box,
  ListItem,
  ListItemAvatar,
  Typography,
  ListItemText,
  Avatar,
} from '@kitman/playbook/components';
import { ArrowForwardIos } from '@mui/icons-material';

import type { Organisation } from '@kitman/services/src/services/getOrganisation';

type Props = {
  label: string,
  fromOrganisation: Organisation,
  toOrganisation: Organisation,
};

const MovementDirection = (props: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="body2"
        component="div"
        sx={{ color: 'text.primary' }}
      >
        {props.label}
      </Typography>
      <Stack
        direction="row"
        divider={<ArrowForwardIos />}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <ListItem sx={{ px: 0 }}>
          <ListItemAvatar>
            <Avatar
              alt={props.fromOrganisation?.name}
              src={props.fromOrganisation?.logo_full_path}
            />
          </ListItemAvatar>
          <ListItemText>
            <Typography
              variant="body2"
              component="div"
              sx={{ color: 'text.secondary' }}
            >
              {props.fromOrganisation?.name}
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem sx={{ px: 0 }}>
          <ListItemAvatar>
            <Avatar
              alt={props.toOrganisation?.name}
              src={props.toOrganisation?.logo_full_path}
            />
          </ListItemAvatar>
          <ListItemText>
            <Typography
              variant="body2"
              component="div"
              sx={{ color: 'text.secondary' }}
            >
              {props.toOrganisation?.name}
            </Typography>
          </ListItemText>
        </ListItem>
      </Stack>
    </Box>
  );
};

export default MovementDirection;
