// @flow
import type { SerializedStyles } from '@emotion/react';

export type Style = { [key: string]: SerializedStyles };
export type ObjectStyle = {
  [key: string]:
    | string
    | number
    | ObjectStyle
    | ((...args: Array<any>) => ObjectStyle),
};
