// @flow
import { actionEnumLike } from './enum-likes';

export type WeekNum = 1 | 2 | 3 | 4 | 5;

export type Action = $Keys<typeof actionEnumLike>;
