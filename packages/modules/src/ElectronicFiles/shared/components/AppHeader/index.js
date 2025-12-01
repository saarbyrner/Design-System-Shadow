// @flow
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
} from '@kitman/playbook/components';
import {
  MENU_ITEM,
  selectSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  selectPersistedFilters,
  updatePersistedFilter,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import {
  selectFilters as selectContactsGridFilters,
  updateFilter as updateContactsGridFilters,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';
import { updateOpen as updateSendDrawerOpen } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { updateOpen as updateContactDrawerOpen } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactDrawerSlice';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { getHasEndpointLoaded } from '@kitman/modules/src/ElectronicFiles/shared/utils';

type Props = {
  hideViewArchiveButton?: boolean,
};

const AppHeader = ({ hideViewArchiveButton = false, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);
  const persistedFilters = useSelector(selectPersistedFilters);
  const filters = persistedFilters[selectedMenuItem];
  const contactsGridFilters = useSelector(selectContactsGridFilters);
  const queries = useSelector((state) => state.electronicFilesApi.queries);

  const hasEndpointLoaded = getHasEndpointLoaded(queries);

  const shouldDisableInboundPageButtons =
    selectedMenuItem === MENU_ITEM.inbox &&
    !hasEndpointLoaded.searchInboundElectronicFileList;
  const shouldDisableOutboundPageButtons =
    selectedMenuItem === MENU_ITEM.sent &&
    !hasEndpointLoaded.searchOutboundElectronicFileList;
  const shouldDisableContactsPageButtons =
    selectedMenuItem === MENU_ITEM.contacts &&
    !hasEndpointLoaded.searchContactList;

  const {
    data: permissions = {},
    isSuccess: hasPermissionsDataLoaded = false,
  }: { data: PermissionsType, isSuccess: boolean } = useGetPermissionsQuery();

  const renderContent = () => {
    return (
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {t('eFile')}
        </Typography>
        <Box display="flex" gap={1}>
          {hasPermissionsDataLoaded &&
            permissions.efile.canSend &&
            selectedMenuItem !== MENU_ITEM.contacts && (
              <Button
                onClick={() => dispatch(updateSendDrawerOpen(true))}
                disabled={
                  shouldDisableInboundPageButtons ||
                  shouldDisableOutboundPageButtons
                }
              >
                {t('New message')}
              </Button>
            )}
          {hasPermissionsDataLoaded &&
            permissions.efile.canManageContacts &&
            selectedMenuItem === MENU_ITEM.contacts && (
              <Button
                onClick={() => dispatch(updateContactDrawerOpen(true))}
                disabled={shouldDisableContactsPageButtons}
              >
                {t('New contact')}
              </Button>
            )}
          {selectedMenuItem === MENU_ITEM.inbox &&
            !hideViewArchiveButton &&
            hasPermissionsDataLoaded &&
            permissions.efile.canViewArchive && (
              <Button
                color="secondary"
                onClick={() => {
                  dispatch(
                    updatePersistedFilter({
                      selectedMenuItem,
                      partialFilter: {
                        archived: !filters.archived,
                      },
                    })
                  );
                }}
                disabled={shouldDisableInboundPageButtons}
              >
                {filters.archived ? t('Exit Archive') : t('View Archive')}
              </Button>
            )}
          {selectedMenuItem === MENU_ITEM.contacts &&
            !hideViewArchiveButton &&
            hasPermissionsDataLoaded &&
            permissions.efile.canManageContacts && (
              <Button
                color="secondary"
                onClick={() => {
                  dispatch(
                    updateContactsGridFilters({
                      archived: !contactsGridFilters.archived,
                    })
                  );
                }}
                disabled={shouldDisableContactsPageButtons}
              >
                {contactsGridFilters.archived
                  ? t('Exit Archive')
                  : t('View Archive')}
              </Button>
            )}
        </Box>
      </Toolbar>
    );
  };
  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{ backgroundColor: colors.white }}
    >
      {renderContent()}
    </AppBar>
  );
};

export const AppHeaderTranslated: ComponentType<Props> =
  withNamespaces()(AppHeader);
export default AppHeader;
