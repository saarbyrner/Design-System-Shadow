/* eslint-disable camelcase */
// @flow
import { useMemo } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import { useFetchRulesetsQuery } from '../services/conditionalFields';

import type { Column, GridConfig, Row, Ruleset } from '../types';

import {
  NameHeader,
  PublishedAtHeader,
  VersionHeader,
  StatusHeader,
  SquadsHeader,
} from '../components/CommonGridStyle/headers';

import buildCellContent from '../components/RulesetsGrid/cellBuilder';

type InitialData = Array<Ruleset>;

export type ReturnType = {
  grid: GridConfig,
  isRulesetsListError: boolean,
  isRulesetsListFetching: boolean,
};

export const getEmptyTableText = () =>
  i18n.t('No Rulesets have been created yet');

const gridId = 'RulesetsGrid';

const initialData: InitialData = [];

const useRulesetsGrid = ({
  organisation_id = null,
}: {
  organisation_id?: string,
}): ReturnType => {
  const {
    data: rulesetsList = initialData,
    isFetching: isRulesetsListFetching,
    isError: isRulesetsListError,
  } = useFetchRulesetsQuery(organisation_id);

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

  const buildRowData = (rulesets): Array<Row> => {
    return rulesets.map((ruleset) => ({
      id: ruleset.id,
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent(column, {
          ruleset,
          organisationId: organisation_id,
        }),
      })),
    }));
  };

  const rows = useMemo(() => buildRowData(rulesetsList), [rulesetsList]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(),
    id: gridId,
  };

  return {
    isRulesetsListFetching,
    isRulesetsListError,
    grid,
  };
};

export default useRulesetsGrid;
