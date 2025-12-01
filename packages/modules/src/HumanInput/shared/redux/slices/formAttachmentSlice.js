// ADR: packages/modules/src/HumanInput/shared/documentation/adr/008.form-attachment-state.md

// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

export type FormAttachment = {
  ...AttachedFile,
  blobUrl: string,
  createdDate: ?string,
};

type FormAttachmentItem = {
  file: FormAttachment,
  state: string,
  message: ?string,
};

type AttachmentQueue = {
  [id: number]: FormAttachmentItem | Array<FormAttachmentItem>,
};
export type FormAttachmentState = {
  queue: AttachmentQueue,
  originalQueue: AttachmentQueue,
};

export const REDUCER_KEY: string = 'formAttachmentSlice';

export type UploadingState = 'IDLE' | 'PENDING' | 'FAILURE' | 'SUCCESS';

export type QueuedItemType = {
  state: UploadingState,
  file: FormAttachment,
  message: ?string,
};

export type UploadQueueState = {
  [id: number]: QueuedItemType,
};

export type OnUpdateQueueAction = {
  payload: {
    [id: number]: FormAttachmentItem,
  },
};

export type OnDeleteAction = {
  payload: {
    id: number,
  },
};

export type OnDeleteRepeatableGroupAttachmentAction = {
  payload: {
    elementId: number,
    groupNumber: number,
    isDeleteGroupAction?: boolean,
  },
};

export const initialState: FormAttachmentState = {
  // if the user decides to discard changes we need to restore
  // the form attachment objects to its original values, we need to save a copy of the initial/un-modified values.
  // to avoid fetching all the files again
  originalQueue: {},
  queue: {},
};

const formAttachmentSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onResetAttachmentsQueue() {
      return initialState;
    },
    onUpdate: (
      state: FormAttachmentState,
      action: PayloadAction<OnUpdateQueueAction>
    ) => {
      state.queue = {
        ...state.queue,
        ...action.payload,
      };
    },

    onBuildOriginalQueue: (
      state: FormAttachmentState,
      action: PayloadAction<OnUpdateQueueAction>
    ) => {
      state.originalQueue = {
        ...state.originalQueue,
        ...action.payload,
      };
    },

    onDelete: (
      state: FormAttachmentState,
      action: PayloadAction<OnDeleteAction>
    ) => {
      const cloneState = Object.assign({}, state.queue);
      delete cloneState[action.payload.id];
      state.queue = cloneState;
    },

    onRestoreFormAttachments: (state: FormAttachmentState) => {
      state.queue = Object.assign({}, state.originalQueue);
    },
    onDeleteAttachmentFromRepeatableGroup: (
      state: FormAttachmentState,
      action: PayloadAction<OnDeleteRepeatableGroupAttachmentAction>
    ) => {
      state.queue = {
        ...state.queue,
        [action.payload.elementId]: action.payload.isDeleteGroupAction
          ? // $FlowFixMe Flow(prop-missing) this action is only called for repeatable groups, so we'll always have Array<FormAttachmentItem>,
            state.queue[action.payload.elementId].filter(
              (_, index) => index !== action.payload.groupNumber
            )
          : // $FlowFixMe Flow(prop-missing) this action is only called for repeatable groups, so we'll always have Array<FormAttachmentItem>,
            state.queue[action.payload.elementId].map((ele, index) =>
              index === action.payload.groupNumber ? null : ele
            ),
      };
    },
  },
});

export const {
  onResetAttachmentsQueue,
  onUpdate,
  onDelete,
  onBuildOriginalQueue,
  onRestoreFormAttachments,
  onDeleteAttachmentFromRepeatableGroup,
} = formAttachmentSlice.actions;

export default formAttachmentSlice;
