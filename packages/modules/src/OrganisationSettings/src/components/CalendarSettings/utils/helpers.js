// @flow
import uuid from 'uuid';

import { EllipsisTooltipText } from '@kitman/components';
import contrastingText from '@kitman/common/src/styles/contrastingText';

import { NEW_GROUP_ID_PREFIX, NEW_EVENT_ID_PREFIX } from './consts';
import type { DuplicateNameCustomValidation } from './types';

export const blurButton = (event: SyntheticEvent<HTMLButtonElement>) => {
  // added this because the focus effect (shadow around the button)
  // remains on the button after another is rendered
  event.currentTarget.blur();
};

type CreateTextCell = {
  rowId: string,
  text: string,
  colour?: string,
};

export const createTextCell = ({ rowId, text, colour }: CreateTextCell) => ({
  id: `${text}_${rowId}_${uuid.v4()}`,
  content: (
    <div>
      <EllipsisTooltipText
        styles={{
          wrapper: {
            backgroundColor: `#${colour ?? ''}!important`,
            borderRadius: '3px',
            padding: colour ? '.05rem .375rem' : 0,
          },
          content: {
            ...(colour ? contrastingText : {}),
            color: `#${colour ?? ''}!important`,
          },
        }}
        content={text}
        displayEllipsisWidth={300}
      />
    </div>
  ),
});

export const getNewItemId = () => `${NEW_EVENT_ID_PREFIX}${uuid.v4()}`;
export const getNewGroupId = () => `${NEW_GROUP_ID_PREFIX}${uuid.v4()}`;

export const isEmptyString = (value: string): boolean => {
  return value.trim().length === 0;
};

export const duplicateNameCustomValidation: DuplicateNameCustomValidation = (
  t,
  uniqueNamesSet,
  currentName,
  newName
) => {
  // duplication calculation should be case-insensitive
  const currentNameLower = currentName.toLocaleLowerCase();
  const newNameLower = newName.toLocaleLowerCase();
  if (currentNameLower !== newNameLower && uniqueNamesSet.has(newNameLower)) {
    return {
      isValid: false,
      message: t('This name already exists'),
    };
  }
  return { isValid: true };
};
