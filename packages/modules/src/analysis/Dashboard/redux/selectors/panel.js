// @flow
import { createSelector } from '@reduxjs/toolkit';
import _get from 'lodash/get';
import type { Store } from '../types/store';
import type {
  TableWidgetSourceSubtypes,
  TableWidgetCalculationParams,
} from '../../components/TableWidget/types';

export const getWidgetRowPanel = (state: Store) => state.tableWidget.rowPanel;
export const getWidgetColumnPanel = (state: Store) =>
  state.tableWidget.columnPanel;

type Direction = 'column' | 'row';
export const getPanelFactory = (direction: Direction) => (state: Store) =>
  _get(state, `tableWidget.${direction}Panel`);

export const getPanelDataSourceFactory = (direction: Direction) =>
  createSelector([getPanelFactory(direction)], (panel) => panel.dataSource);

const subTypeDefaultValues = {
  osics_pathology_ids: [],
  osics_body_area_ids: [],
  osics_classification_ids: [],
  side_ids: [],
  activity_ids: [],
  activity_group_ids: [],
  bamic_grades: [],
  osics_code_ids: [],
  onset_ids: [],
  position_when_injured_ids: [],
  exposure_types: [],
  competition_ids: [],
  contact_types: [],
  recurrence: null,
  time_loss: null,
  pathology_ids: [],
  body_area_ids: [],
  classification_ids: [],
  code_ids: [],
  exercise_ids: [],
  maintenance: null,
  match_days: [],
};

export const getPanelSubtypeValueFactory = (
  direction: Direction,
  subtype: $Keys<TableWidgetSourceSubtypes>
) =>
  createSelector([getPanelDataSourceFactory(direction)], (dataSource) =>
    _get(dataSource, `subtypes.${subtype}`, subTypeDefaultValues[subtype])
  );

export const getPanelCalculationParamFactory = (
  direction: Direction,
  key: $Keys<TableWidgetCalculationParams>
) =>
  createSelector([getPanelFactory(direction)], (panel) =>
    _get(panel, `calculation_params.${key}`, null)
  );
