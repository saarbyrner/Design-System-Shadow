// @flow
import { type SerializedStyles } from '@emotion/react';

export type TOverridableComponents =
  | 'button'
  | 'disabledButton'
  | 'title'
  | 'icon'
  | 'content';

export type TAccordionStyles = {
  button?: SerializedStyles,
  disabledButton?: SerializedStyles,
  title?: SerializedStyles,
  icon?: SerializedStyles,
  content?: SerializedStyles,
  innerContent?: SerializedStyles,
};
