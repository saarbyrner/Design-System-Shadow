// @flow
import type { Node } from 'react';
import { Grid, Box, Typography } from '@kitman/playbook/components';

type Props = {
  title: string,
  actionButtons?: Array<Node>,
};

export const FormTitle = (props: Props) => {
  return (
    <Grid
      item
      xs={4}
      pt={0}
      pb={2}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'text.primary',
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}
      >
        {props.title}
      </Typography>
      <Box display="flex" columnGap="0.5rem">
        {props.actionButtons}
      </Box>
    </Grid>
  );
};
