// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { RichTextEditor, TextField } from '@kitman/playbook/components';
import type { MedicalFile } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Validations, EditedNote } from '../index';

type Props = {
  document: MedicalFile,
  editedNote: EditedNote,
  setEditedNote: (EditedNote) => void,
  fieldValidations: Validations,
};

const EditView = (props: I18nProps<Props>) => {
  const handleEditedNote = (editedNoteDetailsToUpdate: EditedNote) => {
    props.setEditedNote((prevEditedNote: EditedNote): $Shape<EditedNote> => ({
      ...prevEditedNote,
      ...editedNoteDetailsToUpdate,
    }));
  };

  return (
    <>
      <TextField
        label={props.t('Title')}
        size="small"
        sx={{ margin: '16px 0px', width: '40%' }}
        error={props.editedNote.title === '' && !props.fieldValidations?.title}
        defaultValue={props.document.annotation?.title}
        onChange={(event) => {
          handleEditedNote({
            title: event.target.value,
          });
        }}
      />
      <RichTextEditor
        label={props.t('Note text')}
        value={props.document.annotation?.content}
        onChange={(updatedValue) => {
          // Component triggers onChange after every event, only setting state
          // if content actually changes
          if (props.document.annotation?.content !== updatedValue) {
            handleEditedNote({
              content: updatedValue,
            });
          }
        }}
      />
    </>
  );
};

export const EditViewTranslated: ComponentType<Props> =
  withNamespaces()(EditView);
export default EditView;
