// @flow
import { useState } from 'react';
import _isEqual from 'lodash/isEqual';
import { withNamespaces } from 'react-i18next';
import {
  Stack,
  Typography,
  Button,
  Toolbar,
} from '@kitman/playbook/components';
import rootTheme from '@kitman/playbook/themes';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { LabelsMenuTranslated as LabelsMenu } from './LabelsMenu';
import type { SelectedAthleteIds } from './utils/types';

import useBulkUpdateLabelsAction from './utils/hooks/useBulkUpdateLabelsAction';

type Props = {
  selectedAthleteIds: SelectedAthleteIds,
};

const ActionBar = ({ selectedAthleteIds, t }: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [anchorLabelsMenuEl, setAnchorLabelsMenuEl] = useState(null);

  const canManageAthletesLabels = permissions?.settings?.canAssignLabels;
  const canViewAthletesLabels = permissions?.homegrown?.canViewHomegrown;

  const {
    areLabelsDataFetching,
    isBulkUpdateAthleteLabelsLoading,
    handleLabelChange,
    handleBulkUpdateLabelsClick,
    labelsOptions,
    selectedLabelIds,
    originalSelectedLabelIds,
  } = useBulkUpdateLabelsAction({
    t,
    selectedAthleteIds,
    canViewLabels: canViewAthletesLabels,
  });

  // Check if the selected label IDs are the same as the original selected label IDs
  // to determine if the save button should be disabled, required to prevent hitting save continuously
  const isSaveDisabled =
    isBulkUpdateAthleteLabelsLoading ||
    _isEqual(selectedLabelIds, originalSelectedLabelIds);

  return canManageAthletesLabels ? (
    <Toolbar
      sx={{
        backgroundColor: rootTheme.palette.primary.focus,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="subtitle1">
        {selectedAthleteIds.length} {t('selected')}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          color="secondary"
          onClick={(event) => {
            setAnchorLabelsMenuEl(event.currentTarget);
          }}
        >
          {t('Assign Labels')}
        </Button>
      </Stack>

      <LabelsMenu
        anchorEl={anchorLabelsMenuEl}
        onClose={() => setAnchorLabelsMenuEl(null)}
        isDataFetching={areLabelsDataFetching}
        isUpdateLabelsLoading={isSaveDisabled}
        options={labelsOptions}
        selectedLabelIds={selectedLabelIds}
        onSave={handleBulkUpdateLabelsClick}
        handleOnChange={handleLabelChange}
      />
    </Toolbar>
  ) : null;
};

export const ActionBarTranslated = withNamespaces()(ActionBar);
export default ActionBar;
