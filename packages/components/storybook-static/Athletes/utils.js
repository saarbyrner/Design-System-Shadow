// @flow
import _cloneDeep from 'lodash/cloneDeep';
import type { LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import type { GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import type { SquadAthletesSelection, ID, UseOptionsReturn } from './types';
import { EMPTY_SELECTION } from './constants';

type SelectionToMerge = {
  applies_to_squad?: boolean,
  all_squads?: boolean,
  position_groups?: Array<ID>,
  positions?: Array<ID>,
  athletes?: Array<ID>,
  squads?: Array<ID>,
  context_squads?: Array<ID>,
  users?: Array<ID>,
  labels?: Array<ID>,
  segments?: Array<ID>,
  historic?: boolean,
  past_athletes?: boolean,
};

type LabelValue = { label: string };
type SelectedOptions = Array<LabelValue>;

export const mergeWithEmptySelection = (
  selectionToMerge: SelectionToMerge
): SquadAthletesSelection =>
  _cloneDeep({
    ..._cloneDeep(EMPTY_SELECTION),
    ..._cloneDeep(selectionToMerge),
  });

export const getSquadOptions = (
  squadOptions: Array<UseOptionsReturn>,
  val: SquadAthletesSelection,
  valueKey: string
): SelectedOptions => {
  const filterOptions = ({ id, type }) =>
    val[valueKey].includes(id) && type === valueKey;

  const selections = squadOptions.flatMap(({ id, name, options }) => {
    if (valueKey === 'squads' && val[valueKey].includes(id)) {
      return [{ id, name }];
    }

    return options.filter(filterOptions);
  });
  return selections.map(({ name }) => ({ label: name }));
};

export const getLabelOptions = (
  labelOptions?: Array<LabelPopulation>,
  val: SquadAthletesSelection,
  valueKey: string
): SelectedOptions => {
  return (
    labelOptions?.flatMap(({ id, name }) => {
      if (valueKey === 'labels' && val[valueKey]?.includes(id)) {
        return [{ label: name }];
      }
      return [];
    }) || []
  );
};

export const getSegmentOptions = (
  segmentOptions?: Array<GroupPopulation>,
  val: SquadAthletesSelection,
  valueKey: string
): SelectedOptions => {
  return (
    segmentOptions?.flatMap(({ id, name }) => {
      if (valueKey === 'segments' && val[valueKey]?.includes(id)) {
        return [{ label: name }];
      }
      return [];
    }) || []
  );
};
