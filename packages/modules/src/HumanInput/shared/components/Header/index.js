// @flow

import { Box, Typography } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

type Props = {
  title: string,
};

const Header = ({ title }: Props) => {
  return (
    <>
      <Box
        sx={{
          pb: 1,
          background: colors.white,
          borderBottom: 0,
          borderColor: colors.grey_disabled,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" color={colors.grey_200}>
              {title}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Header;
