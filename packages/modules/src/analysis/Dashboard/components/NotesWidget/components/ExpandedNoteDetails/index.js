// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import { ActionCheckbox, TooltipMenu } from '@kitman/components';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import type {
  Annotation,
  AnnotationAction,
} from '@kitman/common/src/types/Annotation';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import getUsersById from '../../utils';

type Props = {
  annotation: Annotation,
  canEditNotes: boolean,
  onClickActionCheckbox: Function,
  onClickDeleteAttachment: Function,
  updatedAction: AnnotationAction,
  widgetId: ?number,
  users: Array<{ id: number, name: string }>,
};

const ExpandedNoteDetails = (props: I18nProps<Props>) => {
  const [expandedNoteActions, setExpandedNoteActions] = useState(
    props.annotation.annotation_actions
  );
  const numberOfActions = expandedNoteActions.length;
  const numberOfCompletedActions = expandedNoteActions.filter(
    (action) => action.completed
  ).length;

  if (props.updatedAction) {
    const expandedActions = expandedNoteActions;
    const actionToUpdate = expandedActions.filter(
      (action) => action.id === props.updatedAction.id
    )[0];

    if (
      actionToUpdate &&
      actionToUpdate.completed !== props.updatedAction.completed
    ) {
      const actionToUpdateIndex = expandedActions.findIndex(
        (action) => action.id === props.updatedAction.id
      );
      expandedActions[actionToUpdateIndex] = props.updatedAction;
      setExpandedNoteActions(expandedActions);
    }
  }

  if (
    props.annotation &&
    props.annotation.annotation_actions.length !== expandedNoteActions.length
  ) {
    setExpandedNoteActions(props.annotation.annotation_actions);
  }

  const getUserNames = (action: AnnotationAction) => {
    const usersById = getUsersById(props.users);
    return (
      action.user_ids &&
      action.user_ids.length > 0 &&
      action.user_ids.map((userId) => {
        return (
          <span className="expandedNoteDetails__actionAssignee" key={userId}>
            {usersById && userId ? usersById[userId] : null}
          </span>
        );
      })
    );
  };

  return (
    <>
      {props.annotation.attachments.length > 0 && (
        <div className="expandedNoteDetails__attachments">
          {props.annotation.attachments.map((file) => (
            <div
              className="expandedNoteDetails__attachmentItem"
              /* $FlowFixMe file.id must exist at this point */
              key={file.id}
            >
              <a
                className="expandedNoteDetails__noteFileName"
                /* $FlowFixMe file.url must exist at this point */
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* $FlowFixMe file.filename must exist at this point */}
                {file.filename}
              </a>
              <p className="expandedNoteDetails__noteFileSize">
                {/* $FlowFixMe file.filesize must exist at this point */}
                {fileSizeLabel(file.filesize, true)}
              </p>
              <TooltipMenu
                placement="bottom-end"
                customClassnames={['expandedNoteDetails__noteFileMenu']}
                offset={[20, 15]}
                menuItems={[
                  {
                    description: props.t('Download'),
                    icon: 'icon-export',
                    // $FlowFixMe file must exist
                    href: file.download_url,
                  },
                  {
                    description: props.t('Delete file'),
                    icon: 'icon-bin',
                    isDisabled: props.annotation.archived,
                    onClick: () =>
                      props.onClickDeleteAttachment(
                        props.widgetId,
                        props.annotation,
                        // $FlowFixMe file must exist
                        file.id
                      ),
                  },
                ]}
                tooltipTriggerElement={<i className="icon-more" />}
                kitmanDesignSystem
              />
            </div>
          ))}
        </div>
      )}
      {numberOfActions ? (
        <div className="expandedNoteDetails__actions">
          <span className="expandedNoteDetails__header">
            {`Actions ${numberOfCompletedActions}/${numberOfActions}`}
          </span>
          {props.annotation.annotation_actions.map((action) => {
            return (
              <div className="expandedNoteDetails__action" key={action.id}>
                <ActionCheckbox
                  id="notesWidget__actionCheckbox"
                  isChecked={
                    props.updatedAction && props.updatedAction.id === action.id
                      ? props.updatedAction.completed
                      : action.completed
                  }
                  isDisabled={!props.canEditNotes}
                  onToggle={() => {
                    props.onClickActionCheckbox(action);
                  }}
                />
                <div className="expandedNoteDetails__actionDetails">
                  <p className="expandedNoteDetails__actionContent">
                    {action.content}
                  </p>
                  {getUserNames(action)}
                  {window.featureFlags['mls-emr-action-due-date'] &&
                    action.due_date && (
                      <div className="expandedNoteDetails__actionDueDate">
                        {props.t('Due date:')}{' '}
                        {window.featureFlags['standard-date-formatting']
                          ? DateFormatter.formatStandard({
                              date: moment(action.due_date),
                            })
                          : moment(action.due_date).format('D MMM YYYY')}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="expandedNoteDetails__noteMetadata">
        <span className="expandedNoteDetails__createdBy">{`Created by ${
          props.annotation.created_by.fullname
        } on ${
          window.featureFlags['standard-date-formatting']
            ? DateFormatter.formatStandard({
                date: moment(props.annotation.created_at),
              })
            : moment(props.annotation.created_at).format('DD MMM YYYY')
        }`}</span>
        {props.annotation.updated_by ? (
          <span className="expandedNoteDetails__lastEditedBy">{`Last Edited by ${
            props.annotation.updated_by.fullname
          } on ${
            window.featureFlags['standard-date-formatting']
              ? DateFormatter.formatStandard({
                  date: moment(props.annotation.updated_at),
                })
              : moment(props.annotation.updated_at).format('DD MMM YYYY')
          }`}</span>
        ) : null}
      </div>
    </>
  );
};

export const ExpandedNoteDetailsTranslated =
  withNamespaces()(ExpandedNoteDetails);
export default ExpandedNoteDetails;
