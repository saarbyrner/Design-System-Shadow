// @flow

import { Box } from '@kitman/playbook/components';

type Props = {
  children: Array<React$Element<any>>,
};

const ItemDetailsContainer = ({ children }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{ width: '100%', marginRight: '0.75rem' }}
    >
      {children}
    </Box>
  );
};

export default ItemDetailsContainer;
