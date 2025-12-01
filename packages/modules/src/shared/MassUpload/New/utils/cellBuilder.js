// @flow
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import { Box, Tooltip, Typography } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

import type { MassUploadCSVs } from '../types';

const buildCellContent = (
  { row_key: rowKey }: { row_key: string },
  csv: MassUploadCSVs,
  isInvalid: ?string
): Node | Array<Node> => {
  if (isInvalid) {
    return (
      <Tooltip
        placement="bottom-end"
        title={isInvalid}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: colors.red_200,
            },
          },
          valueForDataGrid: csv[rowKey],
        }}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [120, -20],
                },
              },
            ],
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: 0.5,
          }}
        >
          <KitmanIcon
            name={KITMAN_ICON_NAMES.ErrorOutline}
            sx={{ color: colors.red_100 }}
          />
          <Typography variant="body" sx={{ color: colors.red_100 }}>
            {csv[rowKey]}
          </Typography>
        </Box>
      </Tooltip>
    );
  }
  return (
    <Box sx={{ color: colors.grey_200, fontWeight: '400', fontSize: '14px' }}>
      {csv[rowKey]}
    </Box>
  );
};

export default buildCellContent;
