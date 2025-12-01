// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  dateTransferFormat,
  formatStandard,
} from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import {
  TextField,
  Autocomplete,
  Checkbox,
  Typography,
} from '@kitman/playbook/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import type { LegalDocument } from '@kitman/modules/src/Medical/shared/types/medical';
import type { DocumentNoteCategory } from '@kitman/services/src/services/getDocumentNoteCategories';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/Medical/document/src/components/Document/styles';
import type { EditedFields, Validations } from '..';

type Props = {
  document: LegalDocument,
  isV2Document: boolean,
  documentNoteCategories: Array<DocumentNoteCategory>,
  currentDocumentCategories?: Array<{ id: number, name: string }>,
  isLoading: boolean,
  setEditedFields: (EditedFields) => void,
  editedFields: EditedFields,
  fieldValidations: Validations,
};

const EditView = (props: I18nProps<Props>) => {
  let docDate =
    props.document.document_date || props.document.attachment.created;

  if (
    window.featureFlags['medical-files-sort-by-doc-date'] &&
    props.document.entity
  ) {
    docDate = props.document.entity.entity_date;
  }

  const handleEditedFields = (editedFieldsToUpdate: EditedFields) => {
    props.setEditedFields((prevEditedFields: EditedFields): EditedFields => ({
      ...prevEditedFields,
      ...editedFieldsToUpdate,
    }));
  };

  return (
    <>
      <div css={style.row}>
        <TextField
          fullWidth
          label={props.t('Title')}
          size="small"
          error={
            props.editedFields.attachment?.name === '' &&
            !props.fieldValidations?.title
          }
          defaultValue={props.document.attachment.name}
          onChange={(event) => {
            // Needed to pull event out of asynchronous context (useState)
            const updatedValue = event.target.value;
            handleEditedFields({
              ...(props.isV2Document
                ? {
                    attachment: { name: updatedValue },
                  }
                : {
                    name: updatedValue,
                  }),
            });
          }}
        />
      </div>
      <div css={style.row}>
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={props.documentNoteCategories}
          onChange={(event, selectedOptions) => {
            handleEditedFields({
              ...(props.isV2Document
                ? {
                    attachment: {
                      medical_attachment_category_ids: selectedOptions.map(
                        ({ id }) => id
                      ),
                    },
                  }
                : {
                    medical_attachment_category_ids: selectedOptions.map(
                      ({ id }) => id
                    ),
                  }),
            });
          }}
          getOptionLabel={(option) => option.name}
          fullWidth
          limitTags={2}
          size="small"
          defaultValue={props.documentNoteCategories.filter((category) =>
            props.currentDocumentCategories?.some(
              (item) => category.id === item.id
            )
          )}
          loading={props.isLoading}
          // eslint-disable-next-line no-shadow
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={selected}
                size="small"
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label={props.t('Category')} />
          )}
        />
      </div>
      <div css={style.row}>
        {props.isV2Document ? (
          <MovementAwareDatePicker
            athleteId={props.document.athlete && props.document.athlete.id}
            value={moment(docDate)}
            onChange={(updatedDate) => {
              handleEditedFields({
                document_date: moment(updatedDate)
                  .startOf('day')
                  .format(dateTransferFormat),
              });
            }}
            label={props.t('Date of document')}
            disableFuture
          />
        ) : (
          <>
            <Typography css={style.header} variant="body2">
              {props.t('Date of document')}:
            </Typography>
            <Typography
              data-testid="DocumentDetailsTab|DocumentDate"
              variant="body2"
            >
              {formatStandard({
                date: moment(docDate),
              })}
            </Typography>
          </>
        )}
      </div>
    </>
  );
};

export const EditViewTranslated: ComponentType<Props> =
  withNamespaces()(EditView);
export default EditView;
