// @flow
import { createSlice } from '@reduxjs/toolkit';
import { type ImportStatus } from '@kitman/common/src/types/Imports';

type MassUploadState = {
  massUploadModal: {
    isOpen: boolean,
  },
  addAthletesSidePanel: {
    isOpen: boolean,
  },
  deleteImport: {
    attachmentId: ?number,
    isConfirmationModalOpen: boolean,
    submissionStatus: ?ImportStatus,
  },
};

export const initialState: MassUploadState = {
  massUploadModal: {
    isOpen: false,
  },
  addAthletesSidePanel: {
    isOpen: false,
  },
  deleteImport: {
    attachmentId: null,
    isConfirmationModalOpen: false,
    submissionStatus: null,
  },
};

const massUploadSlice = createSlice({
  name: 'massUploadSlice',
  initialState,
  reducers: {
    openMassUploadModal: (state: MassUploadState) => {
      state.massUploadModal.isOpen = true;
    },
    closeMassUploadModal: (state: MassUploadState) => {
      state.massUploadModal.isOpen = false;
    },
    onOpenAddAthletesSidePanel: (state) => {
      state.addAthletesSidePanel.isOpen = true;
    },
    onCloseAddAthletesSidePanel: (state) => {
      state.addAthletesSidePanel.isOpen = false;
    },
    onUpdateImportToDelete: (state, action) => {
      state.deleteImport.attachmentId = action.payload.id;
      state.deleteImport.isConfirmationModalOpen =
        action.payload.showDeleteConfirmation;
      state.deleteImport.submissionStatus = action.payload.submissionStatus;
    },
  },
});

export const {
  openMassUploadModal,
  closeMassUploadModal,
  onOpenAddAthletesSidePanel,
  onCloseAddAthletesSidePanel,
  onUpdateImportToDelete,
} = massUploadSlice.actions;
export default massUploadSlice;
