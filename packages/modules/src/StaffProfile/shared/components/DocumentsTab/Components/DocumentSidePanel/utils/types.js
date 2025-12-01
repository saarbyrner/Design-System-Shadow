// @flow
import { toastActionEnumLike } from './enum-likes';

export type ToastAction = $Values<typeof toastActionEnumLike>;
