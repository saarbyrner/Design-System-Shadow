// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Menu,
  Stack,
  Typography,
  Button,
  Toolbar,
  Divider,
  MenuItem,
  ListItemText,
  Checkbox,
  CircularProgress,
} from '@kitman/playbook/components';
import rootTheme from '@kitman/playbook/themes';
import { useLocationHash } from '@kitman/common/src/hooks';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SettingsPermissions } from '@kitman/common/src/contexts/PermissionsContext/settings/types';
import {
  getSelectedSquadIds,
  getShouldRemovePrimarySquad,
} from '@kitman/modules/src/AthleteManagement/shared/redux/selectors';
import {
  onUpdateSelectedSquadIds,
  onUpdateShouldRemovePrimarySquad,
} from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import { useGetSquadAthletesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { LabelsMenuTranslated as LabelsMenu } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/components/LabelsMenu';
import { AvailabilityStatusMenuTranslated as AvailabilityStatusMenu } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/components/AvailabilityStatusMenu';

import { useBulkSquadAssignAction } from './utils/hooks/useBulkSquadAssignAction';
import { usePrimarySquadAction } from './utils/hooks/usePrimarySquadAction';
import { useBulkUpdateLabelsAction } from './utils/hooks/useBulkUpdateLabelsAction';
import { useBulkUpdateAvailabilityStatusAction } from './utils/hooks/useBulkUpdateAvailabilityStatusAction';

import { useChangeActiveStatusAction } from './utils/hooks/useChangeActiveStatusAction';
import { TAB_HASHES } from '../../utils/consts';
import type { SelectedAthleteIds } from './utils/types';

type Props = {
  selectedAthleteIds: SelectedAthleteIds,
  permissions: SettingsPermissions,
  canManageGameStatus: boolean,
  isAssociationAdmin: boolean,
  handleRefetchData: () => void,
};

const ActionBar = ({
  selectedAthleteIds,
  permissions,
  canManageGameStatus,
  handleRefetchData,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const {
    data: squadAthletes = { squads: [] },
    isFetching: areSquadAthletesFetching,
  } = useGetSquadAthletesQuery();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorLabelsMenuEl, setAnchorLabelsMenuEl] = useState(null);
  const [anchorStatusMenuEl, setAnchorStatusMenuEl] = useState(null);
  const locationHash = useLocationHash();
  const isActiveAthletesPage = locationHash === TAB_HASHES.active;

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    dispatch(onUpdateSelectedSquadIds([]));
  };
  const selectedSquadIds = useSelector(getSelectedSquadIds);
  const shouldRemovePrimarySquad = useSelector(getShouldRemovePrimarySquad);

  const squads = squadAthletes.squads.map((squad) => ({
    label: squad.name,
    value: squad.id,
  }));

  const handleSquadChange = (event: Object, newSquadIds: Array<number>) => {
    dispatch(onUpdateSelectedSquadIds(newSquadIds));
  };

  const {
    confirmationModal: bulkAssignConfirmationModal,
    openModal: openBulkAssignConfirmationModal,
    isBulkAssignLoading,
  } = useBulkSquadAssignAction({
    selectedAthleteIds,
    selectedSquadIds,
    handleRefetchData,
    t,
  });

  const {
    confirmationModal: primarySquadAssignConfirmationModal,
    openModal: openPrimarySquadAssignConfirmationModal,
  } = usePrimarySquadAction({ t, selectedAthleteIds, handleRefetchData });

  const {
    areLabelsDataFetching,
    isBulkUpdateAthleteLabelsLoading,
    handleLabelChange,
    handleBulkUpdateLabelsClick,
    labelsOptions,
    selectedLabelIds,
  } = useBulkUpdateLabelsAction({
    t,
    selectedAthleteIds,
    handleRefetchData,
    canViewLabels: permissions.canViewLabels,
  });

  const {
    statusDataFetching,
    isBulkUpdateAvailabilityStatuLoading,
    handleAvailabilityStatusChange,
    handleBulkUpdateAvailabilityStatus,
    statusOptions,
    selectedStatus,
  } = useBulkUpdateAvailabilityStatusAction({
    t,
    selectedAthleteIds,
    handleRefetchData,
    canManageGameStatus,
  });

  const canAssignLabels =
    permissions.canAssignLabels && window.getFlag('labels-and-groups');

  const {
    confirmationModal: updateActiveStatusConfirmationModal,
    openModal: openUpdateActiveStatusConfirmationModal,
  } = useChangeActiveStatusAction({
    isActivating: !isActiveAthletesPage,
    selectedAthleteIds,
    handleRefetchData,
  });

  return (
    <>
      {bulkAssignConfirmationModal}
      {primarySquadAssignConfirmationModal}
      {updateActiveStatusConfirmationModal}
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
        {permissions.canViewSettingsAthletes && (
          <Stack direction="row" spacing={2}>
            {window.featureFlags['league-ops-discipline-area'] &&
              canManageGameStatus && (
                <Button
                  color="secondary"
                  onClick={(event) => {
                    setAnchorStatusMenuEl(event.currentTarget);
                  }}
                  id="AvailabilityStatus"
                >
                  {t('Availability status')}
                </Button>
              )}
            <Button
              color="secondary"
              onClick={() => {
                onUpdateShouldRemovePrimarySquad(!shouldRemovePrimarySquad);
                openPrimarySquadAssignConfirmationModal();
              }}
            >
              {t('{{action}} Primary Squad', {
                action: shouldRemovePrimarySquad ? t('Remove') : t('Assign'),
              })}
            </Button>
            <Button color="secondary" onClick={handleClick}>
              {t('Assign Squad')}
            </Button>
            {canAssignLabels && (
              <Button
                color="secondary"
                onClick={(event) => {
                  setAnchorLabelsMenuEl(event.currentTarget);
                }}
              >
                {t('Assign Labels')}
              </Button>
            )}
            {window.featureFlags['bulk-activate-deactivate'] && (
              <Button
                color="secondary"
                onClick={() => openUpdateActiveStatusConfirmationModal()}
              >
                {isActiveAthletesPage ? t('Deactivate') : t('Activate')}
              </Button>
            )}
          </Stack>
        )}

        <Menu
          id="basic-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'assign-squad-button',
          }}
          slotProps={{ paper: { sx: { minWidth: '16.25rem' } } }}
        >
          {areSquadAthletesFetching ? (
            <Box display="flex" justifyContent="center" p={1}>
              <CircularProgress size="2rem" />
            </Box>
          ) : (
            squads.map(({ value, label }) => {
              const isSelected = selectedSquadIds.includes(value);
              return (
                <MenuItem
                  onClick={(event) =>
                    handleSquadChange(
                      event,
                      isSelected
                        ? selectedSquadIds.filter((id) => id !== value)
                        : [...selectedSquadIds, value]
                    )
                  }
                  key={label}
                >
                  <Checkbox checked={isSelected} />
                  <ListItemText>{label}</ListItemText>
                </MenuItem>
              );
            })
          )}
          <Divider sx={{ margin: 0 }} />
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            p="0.25rem 1rem"
          >
            <Button
              disabled={isBulkAssignLoading}
              id="cancel-button"
              sx={{ mt: 2 }}
              onClick={handleClose}
              variant="secondary"
            >
              {t('Cancel')}
            </Button>
            <Button
              disabled={!selectedSquadIds.length || isBulkAssignLoading}
              id="save-button"
              sx={{ mt: 2 }}
              onClick={openBulkAssignConfirmationModal}
            >
              {t('Save')}
            </Button>
          </Box>
        </Menu>
        <LabelsMenu
          anchorEl={anchorLabelsMenuEl}
          onCloseMenu={() => setAnchorLabelsMenuEl(null)}
          areLabelsDataFetching={areLabelsDataFetching}
          isBulkUpdateAthleteLabelsLoading={isBulkUpdateAthleteLabelsLoading}
          labelsOptions={labelsOptions}
          selectedLabelIds={selectedLabelIds}
          onSaveClick={handleBulkUpdateLabelsClick}
          handleLabelChange={handleLabelChange}
        />
        {canManageGameStatus && (
          <AvailabilityStatusMenu
            anchorEl={anchorStatusMenuEl}
            onCloseMenu={() => setAnchorStatusMenuEl(null)}
            statusDataFetching={statusDataFetching}
            isBulkUpdateAvailabilityStatuLoading={
              isBulkUpdateAvailabilityStatuLoading
            }
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            onSaveClick={handleBulkUpdateAvailabilityStatus}
            handleAvailabilityStatusChange={handleAvailabilityStatusChange}
          />
        )}
      </Toolbar>
    </>
  );
};

export const ActionBarTranslated = withNamespaces()(ActionBar);
export default ActionBar;
