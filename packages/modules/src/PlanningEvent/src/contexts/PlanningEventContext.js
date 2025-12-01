// @flow
import type { Node } from 'react';
import { createContext } from 'react';
import type {
  PlanningEventState,
  PlanningDispatch,
} from '@kitman/modules/src/PlanningEvent/src/hooks/usePlanningReducer';
import { usePlanningReducer } from '@kitman/modules/src/PlanningEvent/src/hooks';

export type PlanningEventContextType = {
  planningState: PlanningEventState,
  dispatch: PlanningDispatch,
};

export const PlanningEventContext = createContext<PlanningEventContextType>({});

export const PlanningEventContextProvider = ({
  children,
}: {
  children: Node,
}) => {
  const [planningState, dispatch] = usePlanningReducer();
  return (
    <PlanningEventContext.Provider value={{ planningState, dispatch }}>
      {children}
    </PlanningEventContext.Provider>
  );
};
