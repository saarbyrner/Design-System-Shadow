// @flow
import { useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import { useLocationHash } from '@kitman/common/src/hooks';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { Button } from '@kitman/playbook/components';
import TAB_HASHES from '../withGridDataManagement/utils/index';
import HomegrownTotalPanel from './HomegrownTotalPanel';

const HomegrownTotal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { permissions } = usePermissions();
  const locationHash = useLocationHash();

  // Get the current search parameters from the URL, so we can use them to determine the current tab
  const canViewHomegrownTotal =
    permissions.homegrown.canViewHomegrownTags &&
    locationHash === TAB_HASHES.players;
  const handlePanelClose = () => {
    setIsOpen(false);
  };
  const handlePanelOpen = () => {
    setIsOpen(true);
  };

  return canViewHomegrownTotal ? (
    <>
      <Button
        id="homegrown-totals-button"
        variant="contained"
        color="secondary"
        size="medium"
        onClick={handlePanelOpen}
      >
        {i18n.t('Homegrown totals')}
      </Button>
      <HomegrownTotalPanel isOpen={isOpen} onClose={handlePanelClose} />
    </>
  ) : null;
};

export default HomegrownTotal;
