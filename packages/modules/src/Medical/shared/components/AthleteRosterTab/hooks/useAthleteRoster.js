// @flow
import type { Node } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { getAthleteRoster } from '@kitman/services/';
import debounce from 'lodash/debounce';
import i18n from '@kitman/common/src/utils/i18n';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import { headerStyle } from '../../CommonGridStyle';

import type {
  InitialData,
  RequestState,
  Filters,
  GridConfig,
  Row,
  Column,
  ReturnType,
} from '../types';

import {
  DefaultHeaderCell,
  AthleteCell,
  AvailabilityStatusCell,
  LatestNoteCell,
  OpenIssuesCell,
  SquadCell,
  AlergiesCell,
} from '../components/Cells';

const emptyTableText = i18n.t('There are no athletes');
const gridId = 'AthleteRosterGrid';

const initialData: InitialData = {
  rows: [],
  columns: [],
  containers: [],
  next_id: null,
};

const initialFilters: Filters = {
  athlete_name: '',
  positions: [],
  squads: [],
  availabilities: [],
  issues: [],
};

const useAthleteRoster = (): ReturnType => {
  const { permissions } = usePermissions();

  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const [request, setRequest] = useState<RequestState>({
    status: 'DORMANT',
    data: initialData,
    error: null,
  });

  const [filteredSearchParams, setFilteredSearchParams] =
    useState<Filters>(initialFilters);

  const updateRequest = (partialRequest: $Shape<RequestState>) => {
    setRequest((state) => ({
      ...state,
      ...partialRequest,
    }));
  };

  const columns: Array<Column> = useMemo(
    () =>
      [
        {
          id: 'athlete',
          row_key: 'athlete',
          content: <DefaultHeaderCell title="Athlete" />,
          isPermitted: true,
        },
        {
          id: 'availability_status',
          row_key: 'availability_status',
          content: <DefaultHeaderCell title="Availability Status" />,
          isPermitted:
            permissions.medical.availability.canView &&
            !window.featureFlags['availability-info-disabled'],
        },
        {
          id: 'open_injuries_illnesses',
          row_key: 'open_injuries_illnesses',
          content: <DefaultHeaderCell title="Open Injury/ Illness" />,
          isPermitted: permissions.medical.issues.canView,
        },
        {
          id: 'latest_note',
          row_key: 'latest_note',
          content: <DefaultHeaderCell title="Latest Note" />,
          isPermitted:
            permissions.medical.notes.canView &&
            window.featureFlags['emr-show-latest-note-column'],
        },
        {
          id: 'allergies',
          row_key: 'allergies',
          content: <DefaultHeaderCell title="Allergies" />,
          isPermitted: permissions.medical.allergies.canView,
        },
        {
          id: 'squad',
          row_key: 'squad',
          content: <DefaultHeaderCell title="Squad" />,
          isPermitted: true,
        },
      ]
        .filter((col) => col.isPermitted)
        .map(({ isPermitted, ...attrs }) => attrs),
    []
  );

  const buildCellContent = (
    { row_key: rowKey },
    athlete
  ): Node | Array<Node> => {
    switch (rowKey) {
      case 'athlete':
        return <AthleteCell athlete={athlete} />;
      case 'availability_status':
        return <AvailabilityStatusCell athlete={athlete} />;
      case 'latest_note':
        return <LatestNoteCell athlete={athlete} />;
      case 'open_injuries_illnesses':
        return <OpenIssuesCell athlete={athlete} />;
      case 'squad':
        return <SquadCell athlete={athlete} />;
      case 'allergies':
        return <AlergiesCell athlete={athlete} />;
      default:
        return <span css={headerStyle.defaultCell}>{athlete[rowKey]}</span>;
    }
  };

  const buildRowData = (athletes): Array<Row> => {
    return athletes.map((athlete) => ({
      id: athlete.id,
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent(column, athlete),
      })),
      classnames: {
        athlete__row: true,
      },
    }));
  };

  const onFetchAthleteRoster = ({
    filters = filteredSearchParams,
    reset = false,
  }: {
    filters: Filters,
    reset?: boolean,
  }) => {
    const currentData = reset ? [] : [...request.data.rows];

    if (reset) {
      setRequest({
        status: 'PENDING',
        data: {
          rows: currentData,
          columns: [],
          containers: [],
          next_id: null,
        },
        error: null,
      });
      setFilteredSearchParams(initialFilters);
    }

    updateRequest({
      status: request.data.rows.length > 0 ? 'UPDATING' : 'PENDING',
    });

    return getAthleteRoster(request.data.next_id, filters).then(
      (data) => {
        setIsInitialDataLoaded(true);
        updateRequest({
          status: 'SUCCESS',
          data: {
            ...data,
            rows: [...currentData, ...data.rows],
            next_id: data.next_id,
          },
        });
      },
      (error) => {
        updateRequest({
          status: 'ERROR',
          error,
        });
      }
    );
  };

  const rows = useMemo(
    () => buildRowData(request.data.rows),
    [request.data.rows]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText,
    id: gridId,
  };

  const handleFilteredSearch = (newFilters = {}) => {
    onFetchAthleteRoster({
      filters: {
        ...filteredSearchParams,
        ...newFilters,
      },
    });
  };

  const handleDebounceSearch = useMemo(
    () => debounce(handleFilteredSearch, 400),
    []
  );

  const onUpdateFilter = (partialFilter: $Shape<Filters>) => {
    setFilteredSearchParams((state) => ({
      ...state,
      ...partialFilter,
    }));
  };

  useEffect(() => {
    handleDebounceSearch(filteredSearchParams);
  }, [filteredSearchParams]);

  return {
    requestStatus: request.status,
    onFetchAthleteRoster,
    filteredSearchParams,
    onUpdateFilter,
    grid,
    nextId: request.data.next_id,
    isInitialDataLoaded,
  };
};

export default useAthleteRoster;
