// @flow
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';

export type Level = 'team' | 'athlete' | 'issue';
export type Tab = $Values<typeof tabHashes>;
export type NoteActionElement =
  | 'Add menu'
  | 'Row meatball'
  | 'Add note button'
  | 'Note meatball';

export type DocumentActionElement =
  | 'Add menu'
  | 'Add document button'
  | 'Document meatball';
