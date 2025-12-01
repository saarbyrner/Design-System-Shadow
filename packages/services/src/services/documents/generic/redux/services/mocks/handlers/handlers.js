import { handler as searchDocuments } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/searchDocuments';
import { handler as fetchGenericDocumentsCategories } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/fetchGenericDocumentsCategories';
import { handler as createDocument } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/createDocument';
import { handler as uploadFileToS3 } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/uploadFileToS3';
import { handler as confirmFileUpload } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/confirmFileUpload';
import { handler as archiveDocument } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/archiveDocument';
import { handler as unarchiveDocument } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/unarchiveDocument';
import { handler as updateDocument } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/updateDocument';

export default [
  searchDocuments,
  fetchGenericDocumentsCategories,
  createDocument,
  uploadFileToS3,
  confirmFileUpload,
  archiveDocument,
  unarchiveDocument,
  updateDocument,
];
