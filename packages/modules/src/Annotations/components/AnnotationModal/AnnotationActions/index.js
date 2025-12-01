// @flow
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { AnnotationAction } from '@kitman/common/src/types/Annotation';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  ActionCheckbox,
  DatePicker,
  IconButton,
  MultiSelectDropdown,
  Textarea,
  TextButton,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

type Props = {
  actions: Array<AnnotationAction>,
  onUpdateActionText: Function,
  onUpdateAssignee: Function,
  onAddAction: Function,
  onRemoveAction: Function,
  users: Array<{ id: number, title: string }>,
  onToggleActionCheckbox: Function,
  onUpdateActionDueDate: Function,
};

const AnnotationActions = (props: I18nProps<Props>) => {
  const renderActions = () => {
    return (
      props.actions.length > 0 &&
      /* eslint-disable react/no-array-index-key */
      props.actions.map((action, index) => (
        <div className="annotationActions__action" key={index} data-testid="annotation-action">
          <div className="annotationActions__tickBox">
            <ActionCheckbox
              id="notesWidget__actionCheckbox"
              isChecked={action.completed}
              onToggle={() => props.onToggleActionCheckbox(index)}
            />
          </div>
          <div className="annotationActions__inputContainer">
            <div className="annotationActions__actionText">
              <Textarea
                label={props.t('Actions')}
                value={action.content || ''}
                onChange={(newContent) =>
                  props.onUpdateActionText(newContent, index)
                }
                name="annotation_task"
                minLimit={1}
                maxLimit={65535}
                t={props.t}
              />
            </div>
            <div className="row annotationActions__assignmentRow">
              <div className="col-md-6 annotationActions__actionAssignee">
                <MultiSelectDropdown
                  label={props.t('Assign')}
                  listItems={props.users || []}
                  selectedItems={action.user_ids}
                  hasSearch
                  isOptional
                  onItemSelect={(selection) => {
                    props.onUpdateAssignee(selection.id, index);
                  }}
                />
              </div>
              {window.featureFlags['mls-emr-action-due-date'] && (
                <div className="col-md-6 annotationActions__actionDueDate">
                  <DatePicker
                    name="annotation_action_due_date"
                    label={props.t('Due Date')}
                    value={
                      action.due_date
                        ? moment(action.due_date).format(
                            DateFormatter.dateTransferFormat
                          )
                        : null
                    }
                    onDateChange={(value) => {
                      const selectedDate = value
                        ? moment(value).format(DateFormatter.dateTransferFormat)
                        : null;
                      props.onUpdateActionDueDate(selectedDate, index);
                    }}
                    container=".ReactModal__Overlay"
                    clearBtn
                  />
                  <span className="annotationActions__optionalDatePicker">
                    {props.t('Optional')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="annotationActions__remove">
            <IconButton
              icon="icon-close"
              onClick={() => props.onRemoveAction(index)}
              isSmall
              isTransparent
            />
          </div>
        </div>
      ))
      /* eslint-enable react/no-array-index-key */
    );
  };

  return (
    <div className="annotationActions" data-testid="annotation-actions">
      {renderActions()}
      <div className="annotationActions__addAction">
        <TextButton
          iconBefore="icon-add"
          text={props.t('Action')}
          isTransparent
          onClick={() => props.onAddAction()}
        />
      </div>
    </div>
  );
};

export const AnnotationActionsTranslated = withNamespaces()(AnnotationActions);
export default AnnotationActions;
