// @flow
import type { Validation } from '@kitman/common/src/types';

import type { EventTypeArray } from '../../utils/types';

export type OnRemovingLocationBound = () => void;

export type OnChangingLocationFieldBound = (
  fieldName: string,
  newName: string
) => void;

export type BoundDuplicateNameCustomValidation = (
  currentName: string,
  newName: string
) => Validation;

export type RowData = {
  name: string,
  location_type: string,
  event_types: EventTypeArray,
  id: string,
};
