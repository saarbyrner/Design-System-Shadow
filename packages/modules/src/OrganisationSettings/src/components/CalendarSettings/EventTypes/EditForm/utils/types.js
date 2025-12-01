// @flow
import type { Validation } from '@kitman/common/src/types';

export type OnRemovingNewEventFromGroup = (eventId: number) => void;

export type OnAddingEventToGroup = () => void;

export type ChangeSquadsData = {
  newSquadIds: Array<number>,
  eventIndex: number | null,
};
export type ChangeNameData = {
  newName: string,
  eventIndex: number | null,
};
export type ChangeColorData = {
  newColor: string,
  eventIndex: number | null,
};

export type OnChangingSquads = (changeSquadsData: ChangeSquadsData) => void;

export type OnChangingName = (changeNameData: ChangeNameData) => void;

export type OnChangingColor = (changeColorData: ChangeColorData) => void;

export type BoundDuplicateNameCustomValidation = (
  currentName: string,
  newName: string
) => Validation;
