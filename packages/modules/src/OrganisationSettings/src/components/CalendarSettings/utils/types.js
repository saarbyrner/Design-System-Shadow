// @flow
import type { Validation } from '@kitman/common/src/types';
import type { Translation } from '@kitman/common/src/types/i18n';

import { pageModeEnumLike } from './enum-likes';

export type PageMode = $Keys<typeof pageModeEnumLike>;

export type DuplicateNameCustomValidation = (
  t: Translation,
  uniqueNamesSet: Set<string>,
  currentName: string,
  newName: string
) => Validation;
