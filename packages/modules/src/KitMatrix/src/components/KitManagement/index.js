// @flow
import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { Kit } from '@kitman/modules/src/KitMatrix/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import GridRowActions from '@kitman/modules/src/LeagueOperations/shared/components/GridRowActions';
import GridContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridContainer';
import Grid from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/Grid';
import { Box } from '@kitman/playbook/components';
import { getPlayerTypesOptions } from '@kitman/modules/src/KitMatrix/shared/utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import GridFilterAutocompleteMultiple from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterAutocompleteMulti';
import {
  playerTypesEnumLike,
  BULK_ACTIVATE_KIT,
  BULK_DEACTIVATE_KIT,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import GridFiltersContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersContainer';
import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import { GenericActionBarTranslated as GenericActionBar } from '@kitman/playbook/components/GenericActionBar';
import {
  onToggleModal,
  onSetSelectedRows,
} from '@kitman/modules/src/KitMatrix/src/redux/slice/kitManagementSlice';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import {
  useSearchKitMatricesNoMergeStrategyQuery,
  useGetLeagueSeasonsQuery,
} from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import { createColumns, commonColDef } from './utils/gridConfig';
import { useGetKitMatrixColorsQuery } from '../../redux/rtk/kitMatrixColorsApi';
import { transformSuspensionRows, onBuildActions } from './utils';

const defaultFilters = {
  archived: false,
  kinds: [],
  search_expression: '',
  organisation_ids: [],
  squad_ids: [],
  kit_matrix_color_ids: [],
  next_id: null,
  page: 1,
  per_page: 30,
  include_games_count: true,
  season: ([]: Array<number>),
};

const KitManagement = ({
  archived,
  canManageKits,
  t,
}: I18nProps<{
  archived: boolean,
  canManageKits: boolean,
}>) => {
  const { isOrgSupervised } = useLeagueOperations();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedRowIds, setSelectedRowIds] = useState<Array<string>>([]);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);
  const updateFilter = useCallback(
    (key: string, value, skipPageReset: boolean = false) => {
      setFilters((prev) => ({
        ...prev,
        page: skipPageReset ? prev.page : 1,
        [key]: value,
      }));
    },
    []
  );

  const handleBulkActivate = useCallback(() => {
    dispatch(onSetSelectedRows({ selectedRows }));
    dispatch(onToggleModal({ isOpen: true, mode: BULK_ACTIVATE_KIT }));
  }, [selectedRows, dispatch]);

  const handleBulkDeactivate = useCallback(() => {
    dispatch(onSetSelectedRows({ selectedRows }));
    dispatch(onToggleModal({ isOpen: true, mode: BULK_DEACTIVATE_KIT }));
  }, [selectedRows, dispatch]);

  const bulkActions = useMemo(() => {
    if (archived) {
      return [
        {
          id: 'activate',
          label: t('Activate'),
          onClick: handleBulkActivate,
        },
      ];
    }
    return [
      {
        id: 'deactivate',
        label: t('Deactivate'),
        onClick: handleBulkDeactivate,
      },
    ];
  }, [archived, t, handleBulkDeactivate, handleBulkActivate]);

  const searchKitMatricesQuery = useSearchKitMatricesNoMergeStrategyQuery({
    ...filters,
    archived,
  });

  const kits = useMemo(
    () => searchKitMatricesQuery?.data?.kit_matrices ?? [],
    [searchKitMatricesQuery?.data?.kit_matrices]
  );
  const totalPages = searchKitMatricesQuery?.data?.meta?.total_pages ?? 0;

  const actionColumns = useMemo(
    () =>
      canManageKits
        ? [
            {
              ...commonColDef,
              field: 'actions',
              headerName: '',
              flex: 0,
              filterable: false,
              align: 'right',
              minWidth: 80,
              renderCell: (params: GridRenderCellParams<Kit>) => {
                return (
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <GridRowActions>
                      {onBuildActions({
                        row: params.row,
                        dispatch,
                        archived,
                      })}
                    </GridRowActions>
                  </Box>
                );
              },
            },
          ]
        : [],
    [canManageKits, archived, dispatch]
  );

  const columns = useMemo(
    () => [...createColumns(t), ...actionColumns],
    [t, actionColumns]
  );
  const rows = useMemo(() => {
    const transformedRows = transformSuspensionRows(kits);
    const rowsWithIds = transformedRows.map((row, index) => ({
      ...row,
      id: row.id || `kit-${index}`,
    }));
    return rowsWithIds;
  }, [kits]);

  // prevent unnecessary state updates to avoid infinite loops
  const handleRowSelectionChange = (newSelection: Array<string>) => {
    // only update if the selection has actually changed
    if (
      newSelection.length === selectedRowIds.length &&
      newSelection.every((id, index) => id === selectedRowIds[index])
    ) {
      return;
    }

    setSelectedRowIds(newSelection);

    // only update selectedRows if the filtered rows are different
    const filteredRows = rows.filter((row) => newSelection.includes(row.id));
    // check if the filtered rows are different
    const isRowsEqual =
      filteredRows.length === selectedRows.length &&
      filteredRows.every((row, index) => row.id === selectedRows[index]?.id);

    // if the filtered rows are different, update the selected rows
    if (!isRowsEqual) {
      setSelectedRows(filteredRows);
    }
  };

  const typesOptions = useMemo(
    () =>
      getPlayerTypesOptions().map((option) => ({
        name: option.label,
        id: option.value ?? '',
      })),
    []
  );

  // these are the filters that are used to filter the kits
  const organisationIds: Array<number> = filters.organisation_ids ?? [];
  const kitMatrixColorIds: Array<number> = filters.kit_matrix_color_ids ?? [];
  const kinds: Array<string> = filters.kinds ?? [];
  const seasons: Array<number> = filters.season ?? [];

  return (
    <GridContainer>
      {selectedRowIds.length > 0 ? (
        <GenericActionBar
          selectedCount={selectedRowIds.length}
          actions={bulkActions}
        />
      ) : (
        <GridFiltersContainer
          sx={{ px: 3, height: ' 64px' }}
          searchField={
            <GridFilterSearch
              label={t('Search')}
              value={filters.search_expression || ''}
              param="search_expression"
              onChange={(value) => updateFilter('search_expression', value)}
              showSearchIcon
            />
          }
          showClearAllButton
        >
          <GridFilterAutocompleteMultiple
            useOptionsQuery={useGetClubsQuery}
            label={t('Clubs')}
            placeholder={t('Clubs')}
            param="filter_organisation_ids"
            defaultValue={([]: Array<number>)}
            value={organisationIds}
            maxWidth={150}
            onChange={(selectedOrganizations) => {
              updateFilter(
                'organisation_ids',
                selectedOrganizations?.map((org) => org.id) ?? []
              );
            }}
          />

          <GridFilterAutocompleteMultiple
            useOptionsQuery={useGetLeagueSeasonsQuery}
            label={t('Season added')}
            placeholder={t('Season added')}
            param="season"
            defaultValue={([]: Array<number>)}
            value={seasons}
            maxWidth={150}
            onChange={(selectedSeasons) => {
              updateFilter(
                'season',
                selectedSeasons?.map((season) => season.id) ?? []
              );
            }}
          />

          <GridFilterAutocompleteMultiple
            useOptionsQuery={useGetKitMatrixColorsQuery}
            label={t('Colors')}
            placeholder={t('Colors')}
            param="kit_matrix_color_ids"
            defaultValue={([]: Array<number>)}
            value={kitMatrixColorIds}
            maxWidth={150}
            onChange={(selectedColors) => {
              updateFilter(
                'kit_matrix_color_ids',
                selectedColors?.map((color) => color.id) ?? []
              );
            }}
          />
          <GridFilterAutocompleteMultiple
            optionsOverride={
              isOrgSupervised
                ? typesOptions.filter(
                    (item) => item.id !== playerTypesEnumLike.referee
                  )
                : typesOptions
            }
            label={t('Types')}
            placeholder={t('Types')}
            param="types"
            defaultValue={([]: Array<string>)}
            value={kinds}
            maxWidth={150}
            onChange={(selectedTypes) => {
              updateFilter(
                'kinds',
                selectedTypes?.map((type) => type.id) ?? []
              );
            }}
          />
        </GridFiltersContainer>
      )}

      <Grid
        columns={columns}
        rows={rows}
        totalPages={totalPages}
        page={filters.page}
        isLoading={searchKitMatricesQuery.isFetching}
        isFetching={searchKitMatricesQuery.isFetching}
        checkboxSelection={canManageKits}
        selectedRows={selectedRowIds}
        onRowSelectionModelChange={handleRowSelectionChange}
        setPage={(newPage) => updateFilter('page', newPage, true)}
      />
    </GridContainer>
  );
};

export default withNamespaces()(KitManagement);
