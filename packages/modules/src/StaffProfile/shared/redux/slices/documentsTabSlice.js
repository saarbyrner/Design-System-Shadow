// @flow
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GenericDocumentStatus } from '@kitman/services/src/services/documents/generic/redux/services/types';
import { type Mode } from '@kitman/modules/src/HumanInput/types/forms';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

export const REDUCER_KEY: string = 'documentsTabSlice';

export type UploadingState = 'IDLE' | 'PENDING' | 'FAILURE' | 'SUCCESS';

export type AttachmentItem = {
  state: UploadingState,
  file: AttachedFile,
  message: ?string,
};

export type DocumentForm = {
  filename: string,
  organisation_generic_document_categories: Array<number>,
  document_date: ?string,
  expires_at: ?string,
  document_note: ?string,
  attachment: ?AttachmentItem,
};
export type DocumentSidePanelState = {
  isOpen: boolean,
  mode: Mode,
  form: DocumentForm,
};

export type DocumentsTabFilters = {
  search: string,
  organisation_generic_document_categories: Array<number>,
  statuses: Array<GenericDocumentStatus>,
};

export type FilterKey = $Keys<DocumentsTabFilters>;
export type FiltersValue = $Values<DocumentsTabFilters>;
export type SetFilterActionPayload = {
  key: FilterKey,
  value: FiltersValue,
};

export type DocumentsTabState = {
  documentSidePanel: DocumentSidePanelState,
  filters: DocumentsTabFilters,
};

export const initialFilters: DocumentsTabFilters = {
  search: '',
  organisation_generic_document_categories: [],
  statuses: [],
};

type OnUpdateExportFormAction = {
  payload: $Shape<DocumentForm>,
};

type OnSetModeAction = {
  payload: {
    mode: Mode,
  },
};

export type OnUpdateAttachmentAction = {
  payload: {
    file: File,
    state: string,
    message: ?string,
  },
};

const initialState: DocumentsTabState = {
  documentSidePanel: {
    isOpen: false,
    mode: MODES.CREATE,
    form: {
      filename: '',
      organisation_generic_document_categories: [],
      attachment: null,
      document_date: null,
      expires_at: null,
      document_note: '',
    },
  },
  filters: { ...initialFilters },
};

const documentsTabSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onOpenDocumentSidePanel: (state: DocumentsTabState) => {
      state.documentSidePanel.isOpen = true;
    },
    onCloseDocumentSidePanel: (state: DocumentsTabState) => {
      state.documentSidePanel.isOpen = false;
    },
    onUpdateDocumentForm: (
      state: DocumentsTabState,
      action: PayloadAction<OnUpdateExportFormAction>
    ) => {
      state.documentSidePanel.form = {
        ...state.documentSidePanel.form,
        ...action.payload,
      };
    },
    onSetMode: (state: DocumentsTabState, action: OnSetModeAction) => {
      state.documentSidePanel.mode = action.payload.mode;
    },
    onUpdateFilter: (
      state: DocumentsTabState,
      { payload: { key, value } }: PayloadAction<SetFilterActionPayload>
    ) => {
      state.filters[key] = value;
    },
    onResetSidePanelForm: (state: DocumentsTabState) => {
      state.documentSidePanel = initialState.documentSidePanel;
    },
    onUpdateAttachment: (
      state: DocumentsTabState,
      action: PayloadAction<OnUpdateAttachmentAction>
    ) => {
      state.documentSidePanel.form = {
        ...state.documentSidePanel.form,
        attachment: action.payload,
      };
    },
    onDeleteAttachment: (state: DocumentsTabState) => {
      state.documentSidePanel.form.attachment = null;
    },
  },
});

export const {
  onOpenDocumentSidePanel,
  onCloseDocumentSidePanel,
  onResetSidePanelForm,
  onUpdateDocumentForm,
  onUpdateAttachment,
  onDeleteAttachment,
  onSetMode,
  onUpdateFilter,
} = documentsTabSlice.actions;
export default documentsTabSlice;
