/* eslint-disable react/no-array-index-key */
// @flow

import { Box, Skeleton } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import { menuWidth } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/consts';

const FormSkeleton = () => {
  return (
    <Box display="flex" gap={2} p={2} width="100%">
      <Box width={menuWidth}>
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            animation="wave"
            height={40}
            sx={{ mb: i === 0 ? 2 : 1 }}
          />
        ))}
      </Box>
      <Box flex={1}>
        <Skeleton variant="rectangular" height={50} sx={{ mb: 3 }} />
        <Box display="flex" flexDirection="column" gap={2}>
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                p: 2,
                border: `1px solid ${colors.semi_transparent_background}`,
              }}
            >
              <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
              {[...Array(2)].map((item, j) => (
                <Skeleton key={j} variant="rectangular" height={56} />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FormSkeleton;
