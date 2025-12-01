// @flow
import { Box, Stack } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import LockClockIcon from '@mui/icons-material/LockClock';

type Props = {
  text?: string,
  children: any,
  isEnabled: boolean,
};

const LockView = ({ text, children, isEnabled }: Props) => {
  const renderHiddenInformationLockForClubs = () => {
    return (
      <Stack
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
        }}
        alignItems="center"
        justifyContent="center"
      >
        <LockClockIcon sx={{ fontSize: 40 }} color="primary" />
        <p>{text}</p>
      </Stack>
    );
  };

  if (!isEnabled) return children;

  return (
    <Box
      sx={{
        position: 'relative',
        border: 1,
        borderColor: colors.neutral_300,
        borderRadius: '3px',
      }}
    >
      {renderHiddenInformationLockForClubs()}
      <Box sx={{ filter: 'blur(5px)' }}>{children}</Box>
    </Box>
  );
};

export default LockView;
