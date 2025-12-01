// @flow
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { Store } from 'redux';
import type SegmentSlice from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import type { ManageSegmentsState } from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';

type StateOptions = ManageSegmentsState | SegmentSlice;

export const storeFake = (
  state: StateOptions,
  dispatchFunction?: Function
) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: dispatchFunction || (() => {}),
  getState: () => state,
});

export const defaultStore = storeFake({
  segmentSlice: getInitialState(),
});

export const renderTestComponent = (store: Store, component: Node) => {
  return render(<Provider store={store}>{component}</Provider>);
};
