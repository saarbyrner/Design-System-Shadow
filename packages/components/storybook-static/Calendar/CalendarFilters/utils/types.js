// @flow
import { eventTypeFilterEnumLike } from './enum-likes';

export type EventTypeFilter = $Values<typeof eventTypeFilterEnumLike>;

export type CheckboxItem = {
  value: string,
  label: string,
};

export type CheckboxItems = Array<CheckboxItem>;
