// @flow
import type { Node } from 'react';
import { Typography, Alert, AlertTitle } from '@kitman/playbook/components';

type Props = {
  severity: 'error' | 'warning',
  config: {
    title: string,
    message?: string,
  },
  action?: Node,
};

const MovementAlert = (props: Props) => {
  return (
    <Alert
      severity={props.severity}
      color={props.severity}
      sx={{ mt: 2 }}
      action={props.action}
    >
      <AlertTitle>{props.config.title}</AlertTitle>
      {props.config.message && (
        <Typography
          variant="caption"
          style={{ display: 'inline-block', whiteSpace: 'pre-line' }}
        >
          {props.config.message}
        </Typography>
      )}
    </Alert>
  );
};

export default MovementAlert;
