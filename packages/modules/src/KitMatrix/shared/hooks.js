// @flow
import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { Box, DataGrid as MuiDataGrid } from '@kitman/playbook/components';
import {
  muiDataGridProps,
  dataGridCustomStyle,
} from '@kitman/modules/src/PlanningEvent/src/components/AthletesSelectionTab/gameEventSelectionGridConfig';
import structuredClone from 'core-js/stable/structured-clone';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';

import {
  defaultFilters,
  playerTypesEnumLike,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import {
  getPlayerTypesOptions,
  transformKitMatrices,
} from '@kitman/modules/src/KitMatrix/shared/utils';
import type {
  FiltersType,
  FilterName,
  UseKitMatrixDataGrid,
  UseKitMatrixDataGridReturns,
} from '@kitman/modules/src/KitMatrix/shared/types';
import style from '@kitman/modules/src/KitMatrix/style';
import Filters from '@kitman/components/src/Filters';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import { columnHeaders } from '../src/grid/config';
import { useGetKitMatrixColorsQuery } from '../src/redux/rtk/kitMatrixColorsApi';
import { useSearchKitMatricesQuery } from '../src/redux/rtk/searchKitMatricesApi';
import { useGetClubsQuery } from '../src/redux/rtk/clubsApi';

export const useKitMatrixDataGrid = ({
  t,
  dataGridProps = {},
  customColumns,
}: I18nProps<UseKitMatrixDataGrid>): UseKitMatrixDataGridReturns => {
  const [filters, setFilters] = useState<FiltersType>(
    structuredClone(defaultFilters)
  );
  const [nextId, setNextId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const { isOrgSupervised } = useLeagueOperations();
  const currentSquad = useSelector(getActiveSquad());
  const searchKitMatricesQuery = useSearchKitMatricesQuery(
    {
      archived: false,
      kinds: filters.types,
      search_expression: filters.search,
      organisation_ids: filters.clubs,
      squad_ids: [],
      kit_matrix_color_ids: filters.colors,
      next_id: nextId,
      include_games_count: true,
    },
    {
      selectFromResult: (result) => {
        if (!result?.data?.kit_matrices?.length) return result;
        return {
          ...result,
          data: {
            ...result.data,
            kit_matrices: transformKitMatrices(result.data.kit_matrices),
          },
        };
      },
    }
  );

  const getClubsQuery = useGetClubsQuery({
    divisionIds: currentSquad?.division[0]?.id,
  });

  const getKitMatrixColorsQuery = useGetKitMatrixColorsQuery();

  const handleSearch = useDebouncedCallback((value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, search: value }));
  }, 750);

  const handleFiltersChange = (key: $Keys<FiltersType>, value: any) => {
    setNextId(null);
    if (key in filters) {
      setFilters((prevFilters) => ({ ...prevFilters, [(key: string)]: value }));
    }
  };

  const onSearchChange = (value: string): void => {
    setNextId(null);
    setSearch(value);
    handleSearch(value);
  };

  const renderFilter = (name: FilterName) => {
    switch (name) {
      case 'search':
        return (
          <Filters.Search
            value={search}
            placeholder={t('Search')}
            onChange={onSearchChange}
          />
        );
      case 'clubs':
        return (
          <Filters.Select
            placeholder={t('Clubs')}
            value={filters.clubs}
            onChange={(value) => handleFiltersChange('clubs', value)}
            options={getClubsQuery.data?.map((club) => ({
              label: club.name,
              value: club.id,
            }))}
          />
        );
      case 'colors':
        return (
          <Filters.Select
            placeholder={t('Colors')}
            value={filters.colors}
            onChange={(value) => handleFiltersChange('colors', value)}
            options={getKitMatrixColorsQuery.data?.map((color) => ({
              label: color.name,
              value: color.id,
            }))}
          />
        );
      case 'types':
        return (
          <Filters.Select
            placeholder={t('Types')}
            value={filters.types}
            onChange={(value) => handleFiltersChange('types', value)}
            options={
              isOrgSupervised
                ? getPlayerTypesOptions().filter(
                    (item) => item.value !== playerTypesEnumLike.referee
                  )
                : getPlayerTypesOptions()
            }
          />
        );
      default:
        return null;
    }
  };

  const renderEmptyDataGrid = () => {
    return <Box css={style.emptyDataGrid}>{t('No Kit matrix found.')}</Box>;
  };

  const renderDataGrid = () => {
    const columns = customColumns
      ? customColumns({ refetch: searchKitMatricesQuery.refetch })
      : dataGridProps.columns || Object.values(columnHeaders);
    return (
      <MuiDataGrid
        {...muiDataGridProps}
        unstable_cellSelection
        rows={searchKitMatricesQuery.data?.kit_matrices ?? []}
        sx={dataGridCustomStyle}
        slots={{
          noRowsOverlay: renderEmptyDataGrid,
        }}
        loading={searchKitMatricesQuery.isFetching}
        hideFooter={false}
        {...dataGridProps}
        columns={columns}
      />
    );
  };

  return {
    filters,
    search,
    setFilters,
    nextId,
    setNextId,
    searchKitMatricesQuery,
    getClubsQuery,
    getKitMatrixColorsQuery,
    onSearchChange,
    renderFilter,
    renderDataGrid,
  };
};
