// @flow
import segmentSlice from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import { segmentsApi } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import manageSegmentsSlice from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';

export default {
  segmentSlice: segmentSlice.reducer,
  segmentsApi: segmentsApi.reducer,
  manageSegmentsSlice: manageSegmentsSlice.reducer,
};
