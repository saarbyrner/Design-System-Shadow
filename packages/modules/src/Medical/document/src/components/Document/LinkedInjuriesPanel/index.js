// @flow
import { useState, type ComponentType } from 'react';
import { setRequestDocumentData } from '@kitman/modules/src/Medical/document/src/redux/documentSlice';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Typography, Button } from '@kitman/playbook/components';
import { useShowToasts } from '@kitman/common/src/hooks';

import { PresentationViewTranslated as PresentationView } from '@kitman/modules/src/Medical/document/src/components/Document/LinkedInjuriesPanel/PresentationView';
import { EditViewTranslated as EditView } from '@kitman/modules/src/Medical/document/src/components/Document/LinkedInjuriesPanel/EditView';
import style from '@kitman/modules/src/Medical/document/src/components/Document/styles';

// Types:
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { LegalDocument } from '@kitman/modules/src/Medical/shared/types/medical';
import type { AthleteIssues } from '@kitman/services/src/services/medical/getAthleteIssues';
import type {
  LinkedIssues,
  IssueOccurrenceFDetail,
  ChronicIssue,
} from '@kitman/modules/src/Medical/shared/types';

type Props = {
  title: string,
  issues: Array<IssueOccurrenceFDetail | ChronicIssue>,
  document: LegalDocument,
  canEdit: boolean,
  isChronic?: boolean,
  athleteIssues: AthleteIssues,
  isLoading: boolean,
  // Prop to determine which function to use for the different type of documents. Leaving as Function type
  // as this would become a very complex type and would have to sacrifice readability of the call to keep flow happy.
  updateDocument: Function,
};
const LINKED_INJURIES_ERROR_TOAST_ID = 'LINKED_INJURIES_ERROR_TOAST_ID';
const LINKED_INJURIES_SUCCESS_TOAST_ID = 'LINKED_INJURIES_SUCCESS_TOAST_ID';

const LinkedInjuriesPanel = (props: I18nProps<Props>) => {
  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: LINKED_INJURIES_ERROR_TOAST_ID,
    successToastId: LINKED_INJURIES_SUCCESS_TOAST_ID,
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedIssues, setEditedIssues] = useState<LinkedIssues>({});

  const dispatch = useDispatch();

  const hasIssues = props.issues?.length > 0;

  const getHasEditedIssues = () => Object.entries(editedIssues).length > 0;

  const onUpdateDocument = async () => {
    try {
      await props.updateDocument(
        props.document.entity ? props.document.entity.id : props.document.id,
        editedIssues
      );
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
      <div css={style.documentHeader}>
        <Button
          variant="text"
          onClick={() => {
            setEditedIssues({});
            setIsEditMode(false);
          }}
          style={{ marginRight: '8px' }}
        >
          {props.t('Discard changes')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onUpdateDocument()}
          disabled={!getHasEditedIssues()}
        >
          {props.t('Save')}
        </Button>
      </div>
    ) : (
      <Button variant="outlined" onClick={() => setIsEditMode(true)}>
        {hasIssues ? props.t('Edit') : props.t('Add')}
      </Button>
    );

  return (
    <div css={style.boxSection}>
      <div css={style.documentHeader}>
        <Typography variant="h6" sx={{ fontWeight: '600' }}>
          {props.title}
        </Typography>

        {props.canEdit && renderActionButtons()}
      </div>

      {isEditMode ? (
        <EditView
          issues={props.issues}
          document={props.document}
          isChronic={props.isChronic}
          athleteIssues={props.athleteIssues}
          isLoading={props.isLoading}
          setEditedIssues={setEditedIssues}
        />
      ) : (
        <PresentationView
          issues={props.issues}
          document={props.document}
          isChronic={props.isChronic}
        />
      )}
    </div>
  );
};

export const LinkedInjuriesPanelTranslated: ComponentType<Props> =
  withNamespaces()(LinkedInjuriesPanel);
export default LinkedInjuriesPanel;
