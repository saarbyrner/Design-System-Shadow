// @flow
import {
  initialState,
  REDUCER_KEY,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';

// types
import type {
  ColumnFormulaState,
  Selector,
} from '@kitman/modules/src/analysis/Dashboard/redux/types/store';

const getFormulaPanel: Selector<ColumnFormulaState> = (state) =>
  state?.[REDUCER_KEY] ?? initialState;

export default getFormulaPanel;
