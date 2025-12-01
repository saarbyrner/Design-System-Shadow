// @flow
import { withNamespaces } from 'react-i18next';
import {
  DatePicker,
  Dropdown,
  FileUploadArea,
  FormValidator,
  InputText,
  LegacyModal as Modal,
  RichTextEditor,
  Textarea,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Annotation } from '@kitman/common/src/types/Annotation';
import type { DropdownItem } from '@kitman/components/src/types';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import { AnnotationActionsTranslated as AnnotationActions } from './AnnotationActions';

type Props = {
  isOpen: boolean,
  modalType: 'ADD_NEW' | 'EDIT' | 'DUPLICATE',
  close: Function,
  annotation: Annotation,
  attachedFiles: AttachedFile[],
  athletes: Array<DropdownItem>,
  onTypeChange: Function,
  onAthleteChange?: Function,
  onDateChange: Function,
  onNoteTextChange: Function,
  onTitleChange: Function,
  onUpdateActionText: Function,
  onUpdateAssignee: Function,
  onAddAction: Function,
  onRemoveAction: Function,
  onSaveAnnotation: Function,
  onEditAnnotation: Function,
  onToggleActionCheckbox: Function,
  users: Array<{ id: number, name: string }>,
  widgetAnnotationTypes?: Array<Object>,
  annotationTypes: Array<Object>,
  timeRange: { start_time: string, end_time: string },
  customMinDate?: string,
  customMaxDate?: string,
  isTextOptional?: boolean,
  onUpdateFiles: Function,
  onRemoveUploadedFile: Function,
  onNoteRichTextChange: Function,
  onUpdateActionDueDate: Function,
};

const AnnotationModal = (props: I18nProps<Props>) => {
  const transformAnnotationTypes = () => {
    const availableTypeIds =
      props.widgetAnnotationTypes &&
      props.widgetAnnotationTypes.length &&
      props.widgetAnnotationTypes.map(
        (type) => type.organisation_annotation_type_id
      );
    const availableTypes = availableTypeIds
      ? props.annotationTypes.filter(
          (type) => availableTypeIds.indexOf(type.id) !== -1
        )
      : props.annotationTypes;
    return availableTypes.map((type) => ({
      id: type.id,
      title: type.name,
    }));
  };

  const getTitle = () => {
    if (props.modalType === 'EDIT') {
      return props.t('Edit Note');
    }
    if (props.modalType === 'DUPLICATE') {
      return props.t('Duplicate Note');
    }
    return props.t('New Note');
  };

  const isActionsAllowed = () => {
    // atm we only allow actions for evaluation type
    const evalTypes = props.annotationTypes.some(
      (type) =>
        type.type === 'OrganisationAnnotationTypes::Evaluation' &&
        type.id === props.annotation.annotation_type_id
    );
    return !!evalTypes;
  };

  const isFileUploadAllowed = () => {
    // atm we only allow file upload for general type
    const generalTypes = props.annotationTypes.some(
      (type) =>
        type.type === 'OrganisationAnnotationTypes::General' &&
        type.id === props.annotation.annotation_type_id
    );
    return !!generalTypes;
  };

  const onSaveSuccess = () => {
    if (
      isFileUploadAllowed &&
      checkInvalidFileTitles(props.annotation.unUploadedFiles)
    )
      return;
    if (props.modalType === 'EDIT') props.onEditAnnotation();
    else props.onSaveAnnotation();
  };

  return (
    <Modal isOpen={props.isOpen} close={props.close} title={getTitle()}>
      <div className="annotationModal">
        <FormValidator
          successAction={onSaveSuccess}
          inputNamesToIgnore={[
            'annotationActions__actionAssignee',
            'filepond',
            'annotation_action_due_date',
            `${props.isTextOptional ? 'annotation_textarea' : ''}`,
          ]}
        >
          <div className="col-md-6 annotationModal__row">
            <Dropdown
              items={transformAnnotationTypes() || []}
              onChange={(typeId) => props.onTypeChange(typeId)}
              value={props.annotation.annotation_type_id || ''}
              label={props.t('Note type')}
              disabled={props.modalType === 'EDIT'}
            />
          </div>
          <div className="col-md-6 annotationModal__row">
            <InputText
              label={props.t('Note title')}
              onValidation={(validationObj) =>
                props.onTitleChange(validationObj.value)
              }
              value={props.annotation.title || ''}
              showRemainingChars={false}
              showCharsLimitReached={false}
              maxLength={255}
              t={props.t}
            />
          </div>
          <div className="col-md-6 annotationModal__row">
            <Dropdown
              items={props.athletes || []}
              onChange={(athleteId) =>
                props.onAthleteChange
                  ? props.onAthleteChange(athleteId, '')
                  : {}
              }
              value={props.annotation.annotationable.id || ''}
              label={props.t('#sport_specific__Athlete')}
              searchable
              disabled={!props.onAthleteChange}
            />
          </div>
          <div className="col-md-4 annotationModal__row">
            <DatePicker
              label={props.t('Date')}
              name="annotation_date"
              onDateChange={(newDate) => props.onDateChange(newDate)}
              value={props.annotation.annotation_date || ''}
              minDate={
                typeof props.customMinDate !== 'undefined'
                  ? props.customMinDate
                  : props.timeRange.start_time
              }
              maxDate={
                typeof props.customMaxDate !== 'undefined'
                  ? props.customMaxDate
                  : props.timeRange.end_time
              }
            />
          </div>
          {window.featureFlags['rich-text-editor'] ? (
            <div className="col-md-12 annotationModal__row">
              <RichTextEditor
                label={props.t('Note text')}
                onChange={props.onNoteRichTextChange}
                value={props.annotation.content || ''}
              />
            </div>
          ) : (
            <div className="col-md-12 annotationModal__row">
              <Textarea
                label={props.t('Note text')}
                value={props.annotation.content || ''}
                onChange={(value) => props.onNoteTextChange(value)}
                name="annotation_textarea"
                maxLimit={65535}
                optionalText={props.isTextOptional ? props.t('Optional') : null}
                t={props.t}
              />
            </div>
          )}
          {isFileUploadAllowed() && (
            <div className="col-md-12 annotationModal__row fileUpload">
              <FileUploadArea
                showActionButton={false}
                testIdPrefix="annotationModal"
                isFileError={false}
                updateFiles={props.onUpdateFiles}
                attachedFiles={props.attachedFiles}
                files={
                  props.modalType === 'EDIT' ? props.annotation.attachments : []
                }
                removeUploadedFile={props.onRemoveUploadedFile}
              />
            </div>
          )}
          <div className="annotationModal__actionContainer">
            {isActionsAllowed() && (
              <AnnotationActions
                actions={props.annotation.annotation_actions || []}
                onUpdateActionText={props.onUpdateActionText}
                onUpdateAssignee={props.onUpdateAssignee}
                onRemoveAction={props.onRemoveAction}
                onAddAction={props.onAddAction}
                users={props.users}
                onToggleActionCheckbox={props.onToggleActionCheckbox}
                onUpdateActionDueDate={props.onUpdateActionDueDate}
              />
            )}
          </div>
          <div className="annotationModal__footer">
            <TextButton
              text={props.t('Save')}
              type="primary"
              onClick={() => {}}
              isSubmit
            />
          </div>
        </FormValidator>
      </div>
    </Modal>
  );
};

export const AnnotationModalTranslated = withNamespaces()(AnnotationModal);
export default AnnotationModal;
