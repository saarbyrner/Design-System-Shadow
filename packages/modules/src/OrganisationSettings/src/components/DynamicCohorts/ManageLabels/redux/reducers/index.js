// @flow
import manageLabelsSlice from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/manageLabelsSlice';
import labelSlice from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import { labelsApi } from '../services/labelsApi';

export default {
  labelSlice: labelSlice.reducer,
  manageLabelsSlice: manageLabelsSlice.reducer,
  labelsApi: labelsApi.reducer,
};
