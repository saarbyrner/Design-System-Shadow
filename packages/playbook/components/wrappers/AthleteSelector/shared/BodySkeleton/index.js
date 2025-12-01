// @flow
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

const BodySkeleton = () => {
  return (
    <Box
      sx={{
        px: 2,
        pt: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: 300,
      }}
    >
      {[0, 1, 2, 3, 4, 5, 7].map((g) => {
        return (
          <Stack
            key={g}
            data-testid="skeleton-row"
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 1 }}
          >
            <Skeleton
              data-testid="skeleton-text"
              variant="text"
              width={240}
              height={28}
            />
            <Box sx={{ flex: 1 }} />
            <Skeleton
              data-testid="skeleton-rect"
              variant="rectangular"
              width={28}
              height={28}
            />
          </Stack>
        );
      })}
    </Box>
  );
};

export default BodySkeleton;
