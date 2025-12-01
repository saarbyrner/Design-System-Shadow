// @flow
import { Stack } from '@kitman/playbook/components';

type ColProps = {
  children: any,
};

const Col = ({ children }: ColProps) => {
  return (
    <Stack direction="column" gap={2}>
      {children}
    </Stack>
  );
};

export default Col;
