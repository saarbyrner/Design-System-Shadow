// @flow
import { Box, Stack } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import MatchInformation from '@kitman/modules/src/MatchDay/components/MatchInformation';
import MatchOfficials from '@kitman/modules/src/MatchDay/components/MatchOfficials';
import EquipmentsSelection from '@kitman/modules/src/MatchDay/components/EquipmentsSelection';
import GamedayRoles from '../GamedayRoles';

const styles = {
  container: {
    p: 3,
    background: colors.white,
    border: 1,
    borderColor: colors.neutral_300,
    borderRadius: '3px',
  },
  columns: {
    display: 'grid',
    gap: 3,
  },
};

const MatchNotice = () => {
  return (
    <Stack direction="column" gap={2} sx={{ px: 3, pb: 3 }}>
      <Box
        sx={{
          ...styles.columns,
          gridTemplateColumns: { md: 'repeat(2, 1fr)' },
        }}
      >
        <MatchInformation />
        <MatchOfficials />
      </Box>

      <Box
        sx={{
          ...styles.columns,
          gridTemplateColumns: {
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
        }}
      >
        <EquipmentsSelection />
      </Box>

      <GamedayRoles />
    </Stack>
  );
};

export default MatchNotice;
