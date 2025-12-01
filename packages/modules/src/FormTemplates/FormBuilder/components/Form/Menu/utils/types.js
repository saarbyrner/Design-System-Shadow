// @flow
import { levelEnumLike } from './enum-likes';

export type Level = $Values<typeof levelEnumLike>;
