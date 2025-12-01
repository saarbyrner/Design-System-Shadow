// @flow
import { createContext, useContext } from 'react';
import type { Node } from 'react';
import type { ToastStatus } from '@kitman/components/src/types';

export const DEFAULT_TOAST_STATUS_VALUE = 'INFO';

const ToastStatusContext = createContext<ToastStatus>(
  DEFAULT_TOAST_STATUS_VALUE
);

type Props = {
  status: ToastStatus,
  children: Node,
};

const ToastStatusContextProvider = (props: Props) => {
  return (
    <ToastStatusContext.Provider value={props.status}>
      {props.children}
    </ToastStatusContext.Provider>
  );
};

const useToastStatusContext = () => useContext(ToastStatusContext);

export { ToastStatusContextProvider, useToastStatusContext };

export default ToastStatusContext;
