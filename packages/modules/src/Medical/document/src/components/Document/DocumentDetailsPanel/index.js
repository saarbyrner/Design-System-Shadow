// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import { useDispatch } from 'react-redux';
import { getContentTypeIcon } from '@kitman/common/src/utils/mediaHelper';
import { Button, Typography } from '@kitman/playbook/components';
import { setRequestDocumentData } from '@kitman/modules/src/Medical/document/src/redux/documentSlice';
import { useShowToasts } from '@kitman/common/src/hooks';
import type { LegalDocument } from '@kitman/modules/src/Medical/shared/types/medical';
import type { DocumentNoteCategory } from '@kitman/services/src/services/getDocumentNoteCategories';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { EditViewTranslated as EditView } from './EditView';
import { PresentationViewTranslated as PresentationView } from './PresentationView';
import style from '../styles';

type Props = {
  document: LegalDocument,
  isV2Document: boolean,
  documentNoteCategories: Array<DocumentNoteCategory>,
  constructedDetailsString: ?string,
  isLoading: boolean,
  canEdit: boolean,
  // Prop to determine which function to use for the different type of documents. Leaving as Function type
  // as this would become a very complex type and would have to sacrifice readability of the call to keep flow happy.
  updateDocument: Function,
};

export type Validations = {
  document_date?: boolean,
  title?: boolean,
};

export type EditedFields = {
  attachment?: {
    name?: string,
    medical_attachment_category_ids?: Array<number>,
  },
  medical_attachment_category_ids?: Array<number>,
  document_date?: string | null,
};

const DOCUMENT_DETAILS_ERROR_TOAST_ID = 'DOCUMENT_DETAILS_ERROR_TOAST_ID';
const LINKED_INJURIES_SUCCESS_TOAST_ID = 'DOCUMENT_DETAILS_SUCCESS_TOAST_ID';

const DocumentDetailsPanel = (props: I18nProps<Props>) => {
  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: DOCUMENT_DETAILS_ERROR_TOAST_ID,
    successToastId: LINKED_INJURIES_SUCCESS_TOAST_ID,
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedFields, setEditedFields] = useState<EditedFields>({});

  const dispatch = useDispatch();

  const getDocumentCategories = () => {
    if (
      !window.featureFlags['medical-files-tab-enhancement'] &&
      props.isV2Document
    ) {
      // $FlowIgnore if isV2Document is truthy, document in not EntityAttachment
      return props.document.document_categories;
    }
    return props.document.attachment.medical_attachment_categories;
  };

  const getHasEditedValues = () => Object.entries(editedFields).length > 0;

  const fieldValidations: Validations = {
    // $FlowIgnore conditionally adding values to this object if field is edited
    ...(editedFields.document_date && {
      document_date: moment(editedFields.document_date).isValid(),
    }),
    ...((editedFields.attachment?.name ||
      editedFields.attachment?.name === '') && {
      title: editedFields.attachment?.name.length > 0,
    }),
  };

  const getIsEditedFieldsValid = () =>
    Object.values(fieldValidations).every((validation) => validation) &&
    getHasEditedValues();

  const onUpdateDocument = async () => {
    const documentId =
      props.isV2Document && props.document.id
        ? props.document.id
        : props.document.attachment.id;

    try {
      // $FlowIgnore all fields optional in below function and only fields defined in EditedFields can be edited here
      await props.updateDocument(documentId, editedFields);
    } catch {
      showErrorToast({
        translatedTitle: props.t(
          'There was an error while editing the file details'
        ),
      });
    }

    dispatch(setRequestDocumentData(true));
    setIsEditMode(false);
    showSuccessToast({
      translatedTitle: props.t('File details updated successfully'),
    });
  };

  const renderActionButtons = () =>
    isEditMode ? (
      <div>
        <Button
          variant="text"
          onClick={() => {
            setEditedFields({});
            setIsEditMode(false);
          }}
          style={{ marginRight: '8px' }}
        >
          {props.t('Discard changes')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onUpdateDocument()}
          disabled={!getIsEditedFieldsValid()}
        >
          {props.t('Save')}
        </Button>
      </div>
    ) : (
      <Button variant="outlined" onClick={() => setIsEditMode(true)}>
        {props.t('Edit')}
      </Button>
    );

  return (
    <div css={style.boxSection}>
      <div css={style.documentHeader}>
        <Typography
          variant="h6"
          sx={{ fontWeight: '600' }}
          data-testid="DocumentDetailsTab|Header"
        >
          {props.t('Document details')}
        </Typography>

        {props.canEdit && renderActionButtons()}
      </div>
      <a
        css={style.link}
        data-testid="DocumentDetailsTab|FileName"
        target="_blank"
        href={props.document.attachment?.url}
        rel="noreferrer"
      >
        <i
          css={style.fileTypeIcon}
          className={getContentTypeIcon(props.document.attachment.filetype)}
        />
        {props.document.attachment?.filename}
      </a>

      <div css={style.documentDetails}>
        {isEditMode ? (
          <EditView
            document={props.document}
            isV2Document={props.isV2Document}
            documentNoteCategories={props.documentNoteCategories}
            currentDocumentCategories={getDocumentCategories()}
            isLoading={props.isLoading}
            setEditedFields={setEditedFields}
            editedFields={editedFields}
            fieldValidations={fieldValidations}
          />
        ) : (
          <PresentationView
            document={props.document}
            currentDocumentCategories={getDocumentCategories()}
          />
        )}
      </div>

      <Typography
        css={style.greyText}
        data-testid="DocumentDetailsTab|DocumentCreatedBy"
        variant="body2"
      >
        {props.constructedDetailsString}
      </Typography>
    </div>
  );
};

export const DocumentDetailsPanelTranslated: ComponentType<Props> =
  withNamespaces()(DocumentDetailsPanel);
export default DocumentDetailsPanel;
