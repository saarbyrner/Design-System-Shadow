// @flow
import { useRef, useState, type ComponentType } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { withNamespaces } from 'react-i18next';

import { useTheme } from '@kitman/playbook/hooks';
import { FileUploaderTranslated as FileUploader } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FileUploader';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { uploadFileToS3 } from '@kitman/services/src/services/documents/generic/redux/services/apis/uploadFileToS3';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  Button,
  Drawer,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  CircularProgress,
} from '@kitman/playbook/components';
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useConfirmFileUploadMutation,
} from '@kitman/services/src/services/documents/generic';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import {
  onUpdateDocumentForm,
  type DocumentSidePanelState,
  type DocumentForm,
} from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';
import { getGenericDocumentsCategoriesFactory } from '@kitman/services/src/services/documents/generic/redux/selectors/genericDocumentsSelectors';
import {
  getDocumentFormFactory,
  getModeFactory,
} from '@kitman/modules/src/StaffProfile/shared/redux/selectors/documentsTabSelectors';
import SideDrawerLayout from '@kitman/modules/src/HumanInput/shared/components/SideDrawerLayout';
import { drawerMixin } from '@kitman/modules/src/HumanInput/shared/components/SideDrawerLayout/mixins';
import type { GenericDocumentsState } from '@kitman/services/src/services/documents/generic/redux/slices/genericDocumentsSlice';
import type {
  OrganisationGenericDocumentCategory,
  GenericDocument,
  CreateDocumentRequestBody,
  UpdateDocumentRequestBody,
} from '@kitman/services/src/services/documents/generic/redux/services/types';
import { datePickerComponentProps } from '@kitman/modules/src/HumanInput/shared/utils/styles';
import { toastActionEnumLike } from './utils/enum-likes';
import { useGetEntity } from '../../utils/helpers';
import type { ToastAction } from './utils/types';

type Props = {
  isOpen: boolean,
  onClose: Function,
};

export type TranslatedProps = I18nProps<Props>;

export const DOCUMENT_ERROR_TOAST_ID = 'DOCUMENT_ERROR_TOAST';
export const DOCUMENT_SUCCESS_TOAST_ID = 'DOCUMENT_SUCCESS_TOAST';

const DocumentSidePanel = ({ isOpen, t, onClose }: TranslatedProps) => {
  const dispatch = useDispatch();
  const userEntity = useGetEntity();
  const filePondRef = useRef(null);
  const [file, setFile] = useState<?AttachedFile>(null);
  const theme = useTheme();

  const {
    id,
    filename = '',
    organisation_generic_document_categories: documentCategories = [],
    expires_at: expiresAtDate,
    document_date: issueDate,
    document_note: documentNote,
    attachment,
  } = useSelector<DocumentSidePanelState>(getDocumentFormFactory());
  const mode = useSelector<DocumentSidePanelState>(getModeFactory());
  const genericDocumentCategories: Array<OrganisationGenericDocumentCategory> =
    useSelector<GenericDocumentsState>(getGenericDocumentsCategoriesFactory());

  const [createDocument, { isLoading: isCreateDocumentLoading }]: [
    (requestBody: CreateDocumentRequestBody) => {
      unwrap: () => Promise<GenericDocument>,
    },
    { isLoading: boolean }
  ] = useCreateDocumentMutation();

  const [updateDocument, { isLoading: isUpdatingDocumentLoading }]: [
    (
      requestBody: UpdateDocumentRequestBody
    ) => Promise<{ data: GenericDocument }>,
    { isLoading: boolean }
  ] = useUpdateDocumentMutation();

  const [confirmFileUpload, { isLoading: isConfirmFileUploadLoading }] =
    useConfirmFileUploadMutation();

  const handleUpdateForm = (partialForm: $Shape<DocumentForm>) => {
    dispatch(onUpdateDocumentForm(partialForm));
  };

  const handleDateChange = (date: string, key: string) =>
    date &&
    handleUpdateForm({ [key]: moment(date).format(dateTransferFormat) });

  const hasRequiredFields =
    filename.length > 0 &&
    documentCategories?.length > 0 &&
    attachment?.file &&
    attachment?.state === 'SUCCESS';

  const clearAnyExistingDocumentToast = () => {
    dispatch(remove(DOCUMENT_ERROR_TOAST_ID));
    dispatch(remove(DOCUMENT_SUCCESS_TOAST_ID));
  };

  const onDocumentActionSuccess = (action: ToastAction) => {
    clearAnyExistingDocumentToast();
    dispatch(
      add({
        id: DOCUMENT_SUCCESS_TOAST_ID,
        status: 'SUCCESS',
        title: `${t('{{filename}} {{action}} successfully', {
          filename,
          action:
            action === toastActionEnumLike.Update ? t('updated') : t('created'),
        })}`,
      })
    );
    onClose();
  };

  const onDocumentActionError = (action: ToastAction) => {
    clearAnyExistingDocumentToast();
    dispatch(
      add({
        id: DOCUMENT_ERROR_TOAST_ID,
        status: 'ERROR',
        title: t('Unable to {{action}} document. Try again', {
          action:
            action === toastActionEnumLike.Update ? t('update') : t('create'),
        }),
      })
    );
  };

  const uploadAndConfirmAttachment = async (
    attachmentFile: File,
    attachmentId: number,
    presignedPost: Object
  ) => {
    try {
      // upload the file using the S3 presigned post url
      await uploadFileToS3(attachmentFile, attachmentId, presignedPost);

      // once upload is completed it sets a flag "confirmed: true" on the attachment stored in the db
      await confirmFileUpload(attachmentId);

      onDocumentActionSuccess(toastActionEnumLike.Create);
    } catch (err) {
      onDocumentActionError(toastActionEnumLike.Create);
    }
  };

  const handleSaveButton = async () => {
    const actionPayload = {
      entity: userEntity,
      title: filename,
      organisation_generic_document_category_ids: documentCategories,
      expires_at: expiresAtDate,
      document_date: issueDate,
      document_note: documentNote || null,
    };

    if (mode === MODES.CREATE) {
      createDocument({
        entity: userEntity,
        title: filename,
        organisation_generic_document_category_ids: documentCategories,
        expires_at: expiresAtDate,
        document_date: issueDate,
        document_note: documentNote || null,
        attachment: {
          filesize: file?.fileSize,
          filetype: file?.fileType,
          original_filename: file?.filename,
        },
      })
        .unwrap()
        .then((data) => {
          if (data?.attachment && file) {
            const attachmentId = data.attachment?.id;
            const attachmentFile = file?.file;
            const presignedPost = data?.attachment?.presigned_post;

            uploadAndConfirmAttachment(
              attachmentFile,
              attachmentId,
              presignedPost
            );
          }
        })
        .catch(() => {
          onDocumentActionError(toastActionEnumLike.Create);
        });
    } else if (mode === MODES.EDIT) {
      try {
        unwrapResult(
          await updateDocument({
            ...actionPayload,
            id,
          })
        );
        onDocumentActionSuccess(toastActionEnumLike.Update);
      } catch {
        onDocumentActionError(toastActionEnumLike.Update);
      }
    }
  };

  return (
    <Drawer open={isOpen} anchor="right" sx={drawerMixin({ theme, isOpen })}>
      <SideDrawerLayout>
        <SideDrawerLayout.Title title={t('Document')} onClose={onClose} />
        <SideDrawerLayout.Body>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title-text-field"
                label={t('Title')}
                required
                value={filename}
                onChange={(event) => {
                  handleUpdateForm({ filename: event.target?.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel required id="category-simple-select-label">
                  {t('Category')}
                </InputLabel>
                <Select
                  multiple
                  labelId="category-simple-select-label"
                  id="category-simple-select"
                  value={documentCategories}
                  onChange={(event) => {
                    handleUpdateForm({
                      organisation_generic_document_categories:
                        event.target?.value,
                    });
                  }}
                  MenuProps={{
                    disablePortal: true,
                  }}
                >
                  {genericDocumentCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                id="issue-date-picker"
                label={t('Issue date')}
                slotProps={datePickerComponentProps}
                value={issueDate && moment(issueDate)}
                onChange={(date) => handleDateChange(date, 'document_date')}
              />
              <DatePicker
                slotProps={datePickerComponentProps}
                id="expiry-date-picker"
                label={t('Expiry date')}
                value={expiresAtDate && moment(expiresAtDate)}
                onChange={(date) => handleDateChange(date, 'expires_at')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                id="notes-text-field"
                rows={3}
                label={t('Notes')}
                value={documentNote}
                onChange={(event) => {
                  handleUpdateForm({ document_note: event.target?.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FileUploader
                filePondRef={filePondRef}
                attachmentItem={attachment}
                setFile={setFile}
                disabled={mode === MODES.EDIT}
              />
            </Grid>
          </Grid>
        </SideDrawerLayout.Body>
        <SideDrawerLayout.Actions>
          <Button variant="secondary" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button
            variant="contained"
            disabled={
              !hasRequiredFields ||
              isCreateDocumentLoading ||
              isUpdatingDocumentLoading ||
              isConfirmFileUploadLoading
            }
            onClick={handleSaveButton}
          >
            {isCreateDocumentLoading || isUpdatingDocumentLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t('Save')
            )}
          </Button>
        </SideDrawerLayout.Actions>
      </SideDrawerLayout>
    </Drawer>
  );
};

export const DocumentSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(DocumentSidePanel);
export default DocumentSidePanel;
