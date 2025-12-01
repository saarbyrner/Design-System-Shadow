// @flow
import { useMemo } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import { useFetchRulesetQuery } from '../services/conditionalFields';

import type { Column, GridConfig, Row, Ruleset } from '../types';

import {
  NameHeader,
  PublishedAtHeader,
  VersionHeader,
  StatusHeader,
  SquadsHeader,
} from '../components/CommonGridStyle/headers';

import buildCellContent from '../components/VersionsGrid/cellBuilder';

type InitialData = Ruleset | Object;

export type ReturnType = {
  ruleset: Ruleset,
  grid: GridConfig,
  isRulesetError: boolean,
  isRulesetFetching: boolean,
};

export const getEmptyTableText = () =>
  i18n.t('No Versions have been created yet');

const gridId = 'VersionsGrid';

const initialData: InitialData = { versions: [] };

const useVersionsGrid = ({
  rulesetId = null,
  organisationId = null,
}: {
  rulesetId?: string,
  organisationId?: string,
}): ReturnType => {
  const {
    data: rulesetData = initialData,
    isFetching: isRulesetFetching,
    isError: isRulesetError,
  } = useFetchRulesetQuery(rulesetId, {
    skip: !rulesetId,
  });

  const columns: Array<Column> = useMemo(
    () => [
      NameHeader,
      PublishedAtHeader,
      VersionHeader,
      StatusHeader,
      SquadsHeader,
    ],
    []
  );

  const buildRowData = (ruleset): Array<Row> => {
    return ruleset.versions.map((version) => ({
      id: version.id,
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent(column, {
          organisationId,
          rulesetId,
          version,
          versions: ruleset.versions,
        }),
      })),
    }));
  };

  const rows = useMemo(() => buildRowData(rulesetData), [rulesetData]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(),
    id: gridId,
  };

  return {
    isRulesetFetching,
    isRulesetError,
    grid,
    ruleset: rulesetData,
  };
};

export default useVersionsGrid;
