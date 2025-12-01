// @flow
import sidebarSlice from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import sendDrawerSlice from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import contactDrawerSlice from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactDrawerSlice';
import gridSlice from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import contactsGridSlice from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';
import dialogSlice from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/dialogSlice';
import splitSetupSlice from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import detailsGridSlice from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';
import { electronicFilesApi } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';

export default {
  sidebarSlice: sidebarSlice.reducer,
  gridSlice: gridSlice.reducer,
  contactsGridSlice: contactsGridSlice.reducer,
  sendDrawerSlice: sendDrawerSlice.reducer,
  contactDrawerSlice: contactDrawerSlice.reducer,
  dialogSlice: dialogSlice.reducer,
  splitSetupSlice: splitSetupSlice.reducer,
  detailsGridSlice: detailsGridSlice.reducer,
  electronicFilesApi: electronicFilesApi.reducer,
};
