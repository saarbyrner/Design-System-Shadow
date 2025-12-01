// @flow
import type { Node } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
} from '@kitman/playbook/components';
import { FALLBACK_DASH } from '../../consts';

type Props = {
  children: Node,
};

type ItemProps = {
  label: string,
  value: ?string,
};

const Item = (props: ItemProps) => {
  return (
    <Grid item xs={4}>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="subtitle2" color="text.secondary">
          {props.label}:
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          {props.value ?? FALLBACK_DASH}
        </Typography>
      </Stack>
    </Grid>
  );
};

const Title = (props: Props): Node => {
  return (
    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
      {props.children}
    </Typography>
  );
};

const DetailsCardLayout = (props: Props): Node => {
  return (
    <Card variant="outlined" sx={{ overflow: 'visible' }}>
      <CardContent sx={{ p: 2 }}>{props.children}</CardContent>
    </Card>
  );
};

DetailsCardLayout.Item = Item;
DetailsCardLayout.Title = Title;

export default DetailsCardLayout;
