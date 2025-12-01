// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Predicate } from '@kitman/modules/src/ConditionalFields/shared/types/index';

type QueryParams = {
  expression: ?Predicate,
  nextId: number | null,
};

export type SegmentFormState = {
  id: ?number,
  name: ?string,
  expression: ?Predicate,
};

type SegmentSlice = {
  formState: SegmentFormState,
  errorState: {
    name: boolean,
    expression: boolean,
  },
  queryParams: QueryParams,
};

type OnUpdateFormAction = {
  payload: $Shape<SegmentFormState>,
};

type OnUpdateErrorAction = {
  payload: $Shape<string>,
};

export const getInitialState = (): SegmentSlice => {
  return {
    formState: {
      id: undefined,
      name: '',
      expression: undefined,
    },
    errorState: {
      name: false,
      expression: false,
    },
    queryParams: {
      expression: undefined,
      nextId: null,
    },
  };
};

const segmentSlice = createSlice({
  name: 'segmentSlice',
  initialState: getInitialState(),
  reducers: {
    onUpdateForm: (
      state: SegmentSlice,
      action: PayloadAction<OnUpdateFormAction>
    ) => {
      state.formState = {
        ...state.formState,
        ...action.payload,
      };
    },
    onUpdateErrorState: (
      state: SegmentSlice,
      action: PayloadAction<OnUpdateErrorAction>
    ) => {
      state.errorState[action.payload.formInputKey] = action.payload.isInvalid;
    },
    onReset: () => getInitialState(),
    onUpdateNextId: (state: SegmentSlice, { payload }: { payload: number }) => {
      state.queryParams.nextId = payload;
    },
    onUpdateQueryParams: (
      state: SegmentSlice,
      { payload }: { payload: QueryParams }
    ) => {
      state.queryParams = payload;
    },
  },
});

export const {
  onUpdateForm,
  onUpdateErrorState,
  onReset,
  onUpdateNextId,
  onUpdateQueryParams,
} = segmentSlice.actions;
export default segmentSlice;
