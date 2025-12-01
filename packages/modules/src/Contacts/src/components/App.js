// @flow
import { useState, useCallback, useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import omit from 'lodash/omit';
import compact from 'lodash/compact';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { useDispatch } from 'react-redux';

import {
  Box,
  Stack,
  Typography,
  Button,
  GridActionsCellItem,
  DataGrid as MuiDataGrid,
} from '@kitman/playbook/components';
import {
  muiDataGridProps,
  dataGridCustomStyle,
} from '@kitman/modules/src/PlanningEvent/src/components/AthletesSelectionTab/gameEventSelectionGridConfig';
import structuredClone from 'core-js/stable/structured-clone';
import {
  defaultFilters,
  mailingList,
  mailingListOptions,
  contactStatuses,
} from '@kitman/modules/src/Contacts/shared/constants';
import style from '@kitman/modules/src/Contacts/style';
import ScrollTop from '@kitman/components/src/ScrollTop';
import Filters from '@kitman/components/src/Filters';
import type { SearchPayload } from '@kitman/services/src/services/contacts/searchContacts';
import Container from '@kitman/modules/src/Contacts/shared/Container';
import {
  getStatusOptionsEnumLike,
  transformGameContactsData,
} from '@kitman/modules/src/Contacts/shared/utils';
import type { ContactWithId } from '@kitman/modules/src/Contacts/shared/types';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import { useSeamlessInfiniteScroll } from '@kitman/common/src/hooks/useSeamlessInfiniteScroll';
import { onToggleModal } from '@kitman/modules/src/Contacts/src/redux/slices/contactsSlice';
import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import GridFilterAutocompleteMultiple from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocompleteMulti';
import GridFiltersContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersContainer';
import { columnHeaders, commonColDef } from '../grid/config';
import { useSearchContactsQuery } from '../redux/rtk/searchContactsApi';
import AddContactDrawer from './AddContactDrawer';
import { useGetContactRolesQuery } from '../redux/rtk/getContactRolesApi';
import { DeleteContactModalTranslated as DeleteContactModal } from './DeleteContactModal';

type Props = {};

const ContactsApp = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<?ContactWithId>(null);
  const [filters, setFilters] = useState<SearchPayload>(
    structuredClone(defaultFilters)
  );
  const [nextId, setNextId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const statusOptions = getStatusOptionsEnumLike(props.t);
  const { isLeague, isOrgSupervised } = useLeagueOperations();
  const { permissions } = usePermissions();
  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');

  const columns = useMemo(() => {
    return isLeague ? columnHeaders : omit(columnHeaders, ['status']);
  }, [isLeague]);

  const searchContactsQuery = useSearchContactsQuery(
    { ...filters, nextId },
    {
      selectFromResult: (result) => {
        return {
          ...result,
          data: transformGameContactsData(result.data),
        };
      },
    }
  );
  const contactRolesQuery = useGetContactRolesQuery();

  const { watchRef } = useSeamlessInfiniteScroll({
    enabled: !!searchContactsQuery.data?.nextId,
    onEndReached: () => {
      setNextId(searchContactsQuery.data?.nextId);
    },
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setNextId(null);
    setFilters({ ...filters, search: value });
  }, 750);

  const handleFiltersChange = (key: $Keys<SearchPayload>, value: any) => {
    setNextId(null);
    if (key in filters) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [(key: string)]: value,
      }));
    }
  };

  useEffect(() => {
    handleSearch(search);

    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch, search]);

  const onClose = () => {
    setIsCreateDrawerOpen(false);
    setSelectedContact(null);
  };
  const onSave = () => {
    searchContactsQuery.refetch();
  };

  const renderEmptyDataGrid = () => {
    return <Box css={style.emptyDataGrid}>{props.t('No contacts found.')}</Box>;
  };

  const openAddContactDrawer = useCallback(
    (contact: ContactWithId | null) => () => {
      setIsCreateDrawerOpen(true);
      setSelectedContact(contact || null);
    },
    []
  );

  const onClearFilters = () => {
    setNextId(null);
    setSearch('');
    setFilters(defaultFilters);
  };

  const getIsEditAllowed = (row: ContactWithId) => {
    return (
      isLeague || (isOrgSupervised && row.status !== contactStatuses.Approved)
    );
  };

  const handleOnDelete = useCallback(
    (contact: ContactWithId | null) => () => {
      dispatch(onToggleModal({ isOpen: true, contact }));
      setSelectedContact(contact || null);
    },
    []
  );

  const renderAddButton = () => {
    const isVisible = permissions?.leagueGame.manageContacts;

    if (isVisible) {
      return (
        <Button onClick={openAddContactDrawer(null)}>{props.t('Add')}</Button>
      );
    }
    return null;
  };

  const renderFilters = () => {
    return (
      <Stack direction="row" gap={1} alignItems="center">
        <Filters.Search
          placeholder={props.t('Search')}
          value={search}
          onChange={(value) => setSearch(value)}
        />
        <Filters.Select
          placeholder={props.t('Role')}
          value={filters.gameContactRoleIds}
          onChange={(value) => handleFiltersChange('gameContactRoleIds', value)}
          options={contactRolesQuery.data?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
        <Filters.Select
          placeholder={props.t('Status')}
          value={filters.statuses}
          onChange={(value) => handleFiltersChange('statuses', value)}
          options={statusOptions}
        />
        <Filters.Select
          placeholder={props.t('List')}
          value={compact([
            filters.dmn && mailingList.Dmn,
            filters.dmr && mailingList.Dmr,
          ])}
          onChange={(value) => {
            handleFiltersChange('dmn', value.includes(mailingList.Dmn) || null);
            handleFiltersChange('dmr', value.includes(mailingList.Dmr) || null);
          }}
          options={mailingListOptions}
        />

        <Button onClick={onClearFilters} sx={{ height: 'fit-content' }}>
          Clear
        </Button>
      </Stack>
    );
  };

  const renderResponsiveFilters = () => {
    const roleIds: Array<number> = filters.gameContactRoleIds ?? [];
    const statuses: Array<string> = filters.statuses ?? [];
    return (
      <GridFiltersContainer
        sx={{
          width: '100%',
        }}
        showClearAllButton
        searchField={
          <GridFilterSearch
            label={props.t('Search')}
            param="search"
            onChange={(value) => {
              setSearch(value);
            }}
            value={search}
            showSearchIcon
            sx={{ minWidth: '300px' }}
          />
        }
      >
        <GridFilterAutocompleteMultiple
          label={props.t('Role')}
          placeholder={props.t('Role')}
          onChange={(selectedRoles) => {
            handleFiltersChange(
              'gameContactRoleIds',
              selectedRoles?.map((role) => role.id) ?? []
            );
          }}
          value={roleIds}
          defaultValue={null}
          param="gameContactRoleIds"
          optionsOverride={contactRolesQuery.data ?? []}
          disableCloseOnSelect
        />

        <GridFilterAutocompleteMultiple
          label={props.t('Status')}
          placeholder={props.t('Status')}
          onChange={(selectedStatuses) => {
            handleFiltersChange(
              'statuses',
              selectedStatuses?.map((status) => status.id) ?? []
            );
          }}
          value={statuses}
          defaultValue={null}
          param="statuses"
          optionsOverride={statusOptions.map((status) => ({
            id: status.value ?? '',
            name: status.label,
          }))}
          disableCloseOnSelect
        />

        <GridFilterAutocompleteMultiple
          label={props.t('List')}
          placeholder={props.t('List')}
          onChange={(selectedLists) => {
            const selectedListIds = selectedLists?.map((list) => list.id);

            handleFiltersChange(
              'dmn',
              selectedListIds?.includes(mailingList.Dmn) || null
            );
            handleFiltersChange(
              'dmr',
              selectedListIds?.includes(mailingList.Dmr) || null
            );
          }}
          value={compact([
            filters.dmn && mailingList.Dmn,
            filters.dmr && mailingList.Dmr,
          ])}
          defaultValue={null}
          param="lists"
          optionsOverride={mailingListOptions.map((list) => ({
            id: list.value ?? '',
            name: list.label,
          }))}
          disableCloseOnSelect
        />
      </GridFiltersContainer>
    );
  };

  return (
    <Container>
      <Container.Header>
        <Stack gap={2} width="100%">
          <Typography variant="h2" css={style.title}>
            {props.t('Contacts')}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {useResponsiveFilters ? renderResponsiveFilters() : renderFilters()}
            {renderAddButton()}
          </Stack>
        </Stack>
      </Container.Header>
      <MuiDataGrid
        {...muiDataGridProps}
        unstable_cellSelection
        columns={compact([
          ...Object.values(columns),
          isOrgSupervised
            ? undefined
            : {
                ...commonColDef,
                field: 'actions',
                width: 20,
                type: 'actions',
                getActions: (params: { row: ContactWithId }) => {
                  const gridCellItems = [
                    <GridActionsCellItem
                      key="edit"
                      label={props.t('Edit')}
                      onClick={openAddContactDrawer(params.row)}
                      showInMenu
                      disabled={!getIsEditAllowed(params.row)}
                    />,
                    isLeague && (
                      <GridActionsCellItem
                        key="delete"
                        label={props.t('Delete')}
                        onClick={handleOnDelete(params.row)}
                        showInMenu
                      />
                    ),
                  ];

                  const hasManageContactsPermission =
                    permissions?.leagueGame.manageContacts;

                  const gridActions = hasManageContactsPermission
                    ? gridCellItems
                    : [];

                  return compact(gridActions);
                },
              },
        ])}
        rows={searchContactsQuery.data?.gameContacts ?? []}
        sx={dataGridCustomStyle}
        slots={{
          noRowsOverlay: renderEmptyDataGrid,
        }}
        loading={searchContactsQuery.isFetching}
        hideFooter={false}
        disableRowSelectionOnClick
        autoHeight
      />
      {!!searchContactsQuery.data?.nextId && <div ref={watchRef} />}

      <AddContactDrawer
        isOpen={isCreateDrawerOpen}
        onSave={onSave}
        onClose={onClose}
        data={selectedContact}
      />

      <DeleteContactModal />
      <ScrollTop threshold={300} sx={{ bottom: 78, right: 38 }} />
    </Container>
  );
};

export default withNamespaces()(ContactsApp);
