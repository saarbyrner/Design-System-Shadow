// @flow
import { useContext, createContext, useReducer } from 'react';
import type { Node } from 'react';
import type { DrugLot } from '@kitman/modules/src/Medical/shared/types/medical';
import type { Dispatch } from '@kitman/modules/src/Medical/shared/types';

type StockListState = {
  addStockSidePanel: Object,
  removeStockSidePanel: Object,
  stockToRemove: DrugLot | null,
};

type Props = {
  children: Node,
};

export type StockListAction =
  | { type: 'TOGGLE_ADD_STOCK_SIDEPANEL' }
  | { type: 'TOGGLE_REMOVE_STOCK_SIDEPANEL', stock: DrugLot | null };

export type StockListContextType = {
  stockListState: StockListState,
  toggleAddStockSidePanel: () => void,
  toggleRemoveStockSidePanel: (stock: DrugLot | null) => void,
};

export type InitialStockListStateContextState = {
  addStockSidePanel: {
    isOpen: boolean,
  },
  removeStockSidePanel: {
    isOpen: boolean,
  },
  stockToRemove: DrugLot | null,
};

const initialStockListState: InitialStockListStateContextState = {
  addStockSidePanel: {
    isOpen: false,
  },
  removeStockSidePanel: {
    isOpen: false,
  },
  stockToRemove: null,
};

const DEFAULT_STOCK_LIST_CONTEXT_VALUE = {
  stockListState: initialStockListState,
  toggleAddStockSidePanel: () => {},
  toggleRemoveStockSidePanel: () => {},
};

const StockListContext = createContext<StockListContextType>(
  DEFAULT_STOCK_LIST_CONTEXT_VALUE
);

const StockListReducer = (
  state: InitialStockListStateContextState = initialStockListState,
  action: StockListAction
) => {
  switch (action.type) {
    case 'TOGGLE_ADD_STOCK_SIDEPANEL': {
      return {
        ...state,
        addStockSidePanel: {
          isOpen: !state.addStockSidePanel.isOpen,
        },
      };
    }

    case 'TOGGLE_REMOVE_STOCK_SIDEPANEL': {
      return {
        ...state,
        removeStockSidePanel: {
          isOpen: !state.removeStockSidePanel.isOpen,
        },
        stockToRemove: action.stock,
      };
    }

    default: {
      return state;
    }
  }
};

const StockListContextProvider = (props: Props) => {
  const [stockListState, dispatch]: [
    InitialStockListStateContextState,
    Dispatch<StockListAction>
  ] = useReducer(StockListReducer, initialStockListState);

  const toggleAddStockSidePanel = () => {
    dispatch({
      type: 'TOGGLE_ADD_STOCK_SIDEPANEL',
    });
  };

  const toggleRemoveStockSidePanel = (stock: DrugLot | null) => {
    dispatch({
      type: 'TOGGLE_REMOVE_STOCK_SIDEPANEL',
      stock,
    });
  };

  const stockListStateValue = {
    stockListState,
    toggleAddStockSidePanel,
    toggleRemoveStockSidePanel,
  };

  return (
    <StockListContext.Provider value={stockListStateValue}>
      {props.children}
    </StockListContext.Provider>
  );
};

const useStockList = () => useContext(StockListContext);
export { StockListContextProvider, useStockList };
export default StockListContext;
