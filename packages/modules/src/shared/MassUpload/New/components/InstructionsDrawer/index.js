// @flow
import { type Node } from 'react';
import copyToClipboard from 'copy-to-clipboard';

import {
  Typography,
  Box,
  Drawer,
  IconButton,
  Divider,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import i18n from '@kitman/common/src/utils/i18n';
import { type SetState } from '@kitman/common/src/types/react';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import getInstructionsTextForClipboard from '@kitman/modules/src/shared/MassUpload/New/utils/getInstructionsTextForClipboard';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

type Props = {
  isDrawerOpen: boolean,
  setIsDrawerOpen: SetState<boolean>,
  ruleset: Node,
  title: string,
  importType: $Values<typeof IMPORT_TYPES>,
};

const InstructionsDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  ruleset,
  title,
  importType,
}: Props) => {
  const instructionsText = getInstructionsTextForClipboard(importType);

  return (
    <Drawer
      open={isDrawerOpen}
      variant="persistent"
      anchor="left"
      sx={{
        width: 340,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'absolute',
          width: 340,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '8px 24px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {i18n.t('Instructions')}
            </Typography>
            {instructionsText && (
              <IconButton onClick={() => copyToClipboard(instructionsText)}>
                <KitmanIcon name={KITMAN_ICON_NAMES.CopyAll} />
              </IconButton>
            )}
          </Box>
        </Box>

        <IconButton onClick={() => setIsDrawerOpen((prev) => !prev)}>
          <KitmanIcon name={KITMAN_ICON_NAMES.KeyboardDoubleArrowLeft} />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ textAlign: 'left', margin: '8px 24px' }}>
        <Typography
          sx={{
            fontSize: convertPixelsToREM(14),
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          {title}
        </Typography>
        {ruleset}
      </Box>
    </Drawer>
  );
};

export default InstructionsDrawer;
