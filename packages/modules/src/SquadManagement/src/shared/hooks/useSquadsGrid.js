// @flow
import { useMemo } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import type { RequestStatus } from '@kitman/services/src/types';

import {
  StartSeasonMarkerDate,
  NameHeader,
  EndSeasonMarkerDate,
  StateHeader,
  CoachesHeader,
  PlayersHeader,
} from '../../components/ManageSquadsGrid/utils/headers';

import buildCellContent from '../../components/ManageSquadsGrid/utils/cellBuilder';
import type { RequestResponse } from '../services/api/fetchSquadSettings';

import type { GridConfig, Row, Column, SquadSetting } from '../types';

import { useFetchSquadSettingsQuery } from '../services/squadManagement';

export type RequestState = {
  data: RequestResponse,
  status: RequestStatus,
  error: ?Object,
};

export type ReturnType = {
  isSquadGridFetching: boolean,
  isSquadGridError: boolean,
  grid: GridConfig,
};

const emptyTableText = i18n.t('No teams have been registered yet');
const gridId = 'SquadGrid';

const initialData: Array<SquadSetting> = [];

type Props = {
  locale: string,
};

const useSquadGrid = (props: Props): ReturnType => {
  const {
    data: squadGrid = initialData,
    isFetching: isSquadGridFetching,
    isError: isSquadGridError,
  } = useFetchSquadSettingsQuery();

  const columns: Array<Column> = useMemo(
    () => [
      NameHeader,
      StartSeasonMarkerDate,
      EndSeasonMarkerDate,
      StateHeader,
      CoachesHeader,
      PlayersHeader,
    ],
    []
  );

  const buildRowData = (squads): Array<Row> => {
    return squads.map((squad) => ({
      id: squad.id,
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent(column, squad, props.locale),
      })),
    }));
  };

  const rows = useMemo(() => buildRowData(squadGrid), [squadGrid]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText,
    id: gridId,
  };

  return {
    isSquadGridFetching,
    isSquadGridError,
    grid,
  };
};

export default useSquadGrid;
