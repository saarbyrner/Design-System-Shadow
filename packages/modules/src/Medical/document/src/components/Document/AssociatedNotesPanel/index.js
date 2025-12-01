// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useShowToasts } from '@kitman/common/src/hooks';
import { Button, Typography } from '@kitman/playbook/components';
import { setRequestDocumentData } from '@kitman/modules/src/Medical/document/src/redux/documentSlice';
import type { MedicalFile } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { PresentationViewTranslated as PresentationView } from './PresentationView';
import { EditViewTranslated as EditView } from './EditView';
import style from '../styles';

type Props = {
  document: MedicalFile,
  constructedDetailsString: ?string,
  canEdit: boolean,
  // Prop to determine which function to use for the different type of documents. Leaving as Function type
  // as this would become a very complex type and would have to sacrifice readability of the call to keep flow happy.
  updateDocument: Function,
};

export type EditedNote = {
  title?: string,
  content?: string,
};

export type Validations = {
  title?: boolean,
  content?: boolean,
};
const ASSOCIATED_NOTES_ERROR_TOAST_ID = 'ASSOCIATED_NOTES_ERROR_TOAST_ID';
const LINKED_INJURIES_SUCCESS_TOAST_ID = 'ASSOCIATED_NOTES_SUCCESS_TOAST_ID';

const AssociatedNotesPanel = (props: I18nProps<Props>) => {
  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: ASSOCIATED_NOTES_ERROR_TOAST_ID,
    successToastId: LINKED_INJURIES_SUCCESS_TOAST_ID,
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedNote, setEditedNote] = useState<EditedNote>({});

  const dispatch = useDispatch();

  const hasNotes =
    props.document.annotation && props.document.annotation.content;

  const getHasEditedNote = () => Object.entries(editedNote).length > 0;

  const fieldValidations: Validations = {
    ...((editedNote.title || editedNote.title === '') && {
      title: editedNote.title.length > 0,
    }),
    // $FlowIgnore conditionally adding values to this object if field is edited
    ...((editedNote.content || editedNote.content === '') && {
      content: editedNote.content.length > 0,
    }),
  };

  const getIsEditedNoteValid = () =>
    Object.values(fieldValidations).every((validation) => validation) &&
    getHasEditedNote();

  const onUpdateDocument = async () => {
    try {
      await props.updateDocument(props.document.id, { annotation: editedNote });
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
            setEditedNote({});
            setIsEditMode(false);
          }}
          style={{ marginRight: '8px' }}
        >
          {props.t('Discard changes')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onUpdateDocument()}
          disabled={!getIsEditedNoteValid()}
        >
          {props.t('Save')}
        </Button>
      </div>
    ) : (
      <Button variant="outlined" onClick={() => setIsEditMode(true)}>
        {hasNotes ? props.t('Edit') : props.t('Add')}
      </Button>
    );

  return (
    <div css={style.boxSection}>
      <div css={style.documentHeader}>
        <Typography variant="h6" sx={{ fontWeight: '600' }}>
          {props.t('Note')}
        </Typography>
        {props.canEdit && renderActionButtons()}
      </div>

      <>
        <section css={style.noteWrapper}>
          {isEditMode ? (
            <EditView
              document={props.document}
              fieldValidations={fieldValidations}
              editedNote={editedNote}
              setEditedNote={setEditedNote}
            />
          ) : (
            <PresentationView
              document={props.document}
              hasNotes={!!hasNotes}
              constructedDetailsString={props.constructedDetailsString}
            />
          )}
        </section>

        {hasNotes && (
          <>
            <hr />
            <Typography css={style.greyText} variant="body2">
              {props.constructedDetailsString}
            </Typography>
          </>
        )}
      </>
    </div>
  );
};

export const AssociatedNotesPanelTranslated: ComponentType<Props> =
  withNamespaces()(AssociatedNotesPanel);
export default AssociatedNotesPanel;
