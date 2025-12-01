// @flow
import { toastStatusEnumLike, toastRemovalDelayEnumLike } from './enum-likes';

export type ToastStatusEnumLikeValues = $Values<typeof toastStatusEnumLike>;

export type ToastRemovalDelayEnumLikeKeys = $Keys<
  typeof toastRemovalDelayEnumLike
>;

type closeToastItem = {
  type: 'CLOSE_TOAST_ITEM',
  payload: {
    itemId: number,
  },
};

export type Action = closeToastItem;

/* KITMAN DESIGN SYSTEM TYPES */
export type ToastId = number | string;
export type ToastStatus = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'LOADING';
export type ToastLink = {
  id: number,
  text: string,
  link: string,
  withHashParam?: boolean,
  metadata?: Object,
};

export const TOAST_TYPE = Object.freeze({
  DEFAULT: 'default',
  MESSAGE: 'message',
});

export type ToastType = $Values<typeof TOAST_TYPE>;

export type Toast = {|
  id: ToastId,
  status: ToastStatus,
  title: string,
  description?: string,
  links?: ToastLink[],
  type?: ToastType,
  metadata?: Object,
  removalDelay?: ToastRemovalDelayEnumLikeKeys,
|};

export type ToastDispatch<T> = (action: T) => any;
export type ToastWithoutId = $Rest<Toast, {| id: ToastId |}>;
