// @flow
import { useState, useMemo, useEffect } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
// TODO(looshch): an import of entities from another module; the entities must
// be moved to @kitman/common.
import type {
  GridConfig,
  Row,
  Column,
  Meta,
} from '@kitman/modules/src/Officials/shared/types';
import { type Options } from '@kitman/components/src/Select';
import { type Filters } from '@kitman/services/src/services/searchImportsList';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';
import {
  useSearchImportsListQuery,
  useFetchImportTypeOptionsQuery,
  useFetchImportCreatorOptionsQuery,
} from '@kitman/modules/src/Imports/services/imports';

import buildCellContent from '../components/cellBuilder';

type InitialData = {
  data: Array<Object>,
  meta: Meta,
};

export type ReturnType = {
  grid: GridConfig,
  isError: boolean,
  isLoading: boolean,
  isFetching: boolean,
  filteredSearchParams: Filters,
  onUpdateFilter: Function,
  onHandleFilteredSearch: Function,
  meta: Meta,
  filterConfig: {
    importTypeOptions: Array<Options>,
    creatorOptions: Array<Options>,
    statusOptions: Array<Options>,
  },
};

export const getEmptyTableText = () => i18n.t('No Imports have been made.');

const gridId = 'ListImportsGrid';

const initialData: InitialData = {
  data: [],
  meta: {
    current_page: 0,
    next_page: null,
    prev_page: null,
    total_count: 0,
    total_pages: 0,
  },
};

const mapImportTypeOption = (key: string): Options => {
  switch (key) {
    default:
    case 'athlete_import':
      return { value: 'athlete_import', label: i18n.t('Athlete Import') };
    case 'official_import':
      return { value: 'official_import', label: i18n.t('Official Import') };
    case 'scout_import':
      return { value: 'scout_import', label: i18n.t('Scout Import') };
    case 'user_import':
      return { value: 'user_import', label: i18n.t('Staff Import') };
    case 'official_assignment_import':
      return {
        value: 'official_assignment_import',
        label: i18n.t('Official Assignment Import'),
      };
    case 'growth_and_maturation_import':
      return {
        value: 'growth_and_maturation_import',
        label: i18n.t('Growth and maturation import'),
      };
    case 'baselines_import':
      return { value: 'baselines_import', label: i18n.t('Baseline Import') };
  }
};

const useImportsListGrid = (): ReturnType => {
  const initialFilters: Filters = {
    per_page: 25,
    page: 0,
    creator_ids: [],
    import_types: [],
    statuses: [],
  };

  const statusOptions = [
    { value: 'completed', label: i18n.t('Completed') },
    { value: 'errored', label: i18n.t('Error') },
    { value: 'pending', label: i18n.t('In progress') },
  ];

  const [filteredSearchParams, setFilteredSearchParams] =
    useState<Filters>(initialFilters);
  const [debouncedFilteredSearchParams, setDebouncedFilteredSearchParams] =
    useState<Filters>(initialFilters);

  const {
    data: importsList = initialData,
    isFetching: isImportsListFetching,
    isError: isImportsListError,
  } = useSearchImportsListQuery({ ...debouncedFilteredSearchParams });

  const {
    data: importTypeOptions = [],
    isLoading: isImportTypeLoading,
    isError: isImportTypeError,
  } = useFetchImportTypeOptionsQuery();

  const {
    data: creatorOptions = [],
    isLoading: isCreatorOptionsLoading,
    isError: iscCeatorOptionsError,
  } = useFetchImportCreatorOptionsQuery();

  const columns: Array<Column> = useMemo(
    () => [
      {
        id: 'name',
        row_key: 'name',
        content: <DefaultHeaderCell title={i18n.t('Name')} />,
      },
      {
        id: 'import_type',
        row_key: 'import_type',
        content: <DefaultHeaderCell title={i18n.t('Import Type')} />,
      },
      {
        id: 'created_at',
        row_key: 'created_at',
        content: <DefaultHeaderCell title={i18n.t('Created Date & Time')} />,
      },
      {
        id: 'download_link',
        row_key: 'download_link',
        content: <DefaultHeaderCell title={i18n.t('Download link')} />,
      },
      {
        id: 'status',
        row_key: 'status',
        content: <DefaultHeaderCell title={i18n.t('Status')} />,
      },
      {
        id: 'creator',
        row_key: 'creator',
        content: <DefaultHeaderCell title={i18n.t('Creator')} />,
      },
      {
        id: 'errors',
        row_key: 'errors',
        content: <DefaultHeaderCell title={i18n.t('Errors')} />,
      },
    ],
    []
  );

  const buildRowData = (officials): Array<Row> => {
    return (
      officials?.map((official) => ({
        id: official.id,
        cells: columns.map((column) => ({
          id: column.row_key,
          content: buildCellContent(column, official),
        })),
      })) || []
    );
  };

  const rows = useMemo(
    () => buildRowData(importsList.data),
    [importsList.data]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(),
    id: gridId,
  };

  const onUpdateFilter = (partialFilter: $Shape<Filters>) => {
    setFilteredSearchParams((state) => ({
      ...state,
      ...partialFilter,
    }));
  };

  const handleDebounceSearch = useDebouncedCallback(
    () => setDebouncedFilteredSearchParams(filteredSearchParams),
    400
  );

  useEffect(handleDebounceSearch, [filteredSearchParams]);

  const onHandleFilteredSearch = (newFilters = {}) => {
    onUpdateFilter(newFilters);
  };

  return {
    isFetching: isImportsListFetching,
    isLoading: isImportTypeLoading || isCreatorOptionsLoading,
    isError: isImportsListError || isImportTypeError || iscCeatorOptionsError,
    onHandleFilteredSearch,
    filteredSearchParams,
    onUpdateFilter,
    grid,
    meta: importsList.meta,
    filterConfig: {
      importTypeOptions: importTypeOptions.map(mapImportTypeOption),
      creatorOptions: creatorOptions.map((c) => ({
        value: c.id,
        label: c.fullname,
      })),
      statusOptions,
    },
  };
};

export default useImportsListGrid;
