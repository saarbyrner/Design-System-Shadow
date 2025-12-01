// @flow

import { withNamespaces } from 'react-i18next';
import { Box } from '@kitman/playbook/components';

import { PermissionsHeaderTranslated as PermissionsHeader } from '@kitman/modules/src/StaffProfile/shared/components/PermissionsTab/components/PermissionsHeader';
import { PermissionsBodyTranslated as PermissionsBody } from '@kitman/modules/src/StaffProfile/shared/components/PermissionsTab/components/PermissionsBody';
import { tabContainerSx } from '@kitman/modules/src/StaffProfile/shared/utils/styles';

const PermissionsTab = () => {
  const commonSx = {
    maxWidth: '990px',
    paddingRight: '0px',
  };

  return (
    <Box sx={{ ...tabContainerSx, ...commonSx, overflow: 'auto' }}>
      <Box sx={commonSx}>
        <PermissionsHeader />
      </Box>
      <Box sx={commonSx}>
        <PermissionsBody />
      </Box>
    </Box>
  );
};

export const PermissionsTabTranslated = withNamespaces()(PermissionsTab);
export default PermissionsTab;
