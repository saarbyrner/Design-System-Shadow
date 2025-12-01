// @flow
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import {
  ActionCheckbox,
  AppStatus,
  RichTextDisplay,
  LegacyModal as Modal,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Annotation, User } from '../../types';

type Props = {
  isOpen: boolean,
  annotation: Annotation,
  requestStatus: 'success' | 'loading' | 'error',
  currentUser: User,
  onClickCloseModal: Function,
};

function NoteDetailModal(props: I18nProps<Props>) {
  const getAssignees = (actionUsers) => {
    if (actionUsers.length === 0) {
      return null;
    }

    const assigneesList = [];
    actionUsers.forEach((user) => {
      if (user.id === props.currentUser.id) {
        assigneesList.unshift(props.t('you'));
      } else {
        assigneesList.push(user.fullname);
      }
    });

    // We should use Intl.ListFormat once Safari supports it
    // This separates the list elements with comma, and the last element with "and"
    let formattedAssigneesList = '';
    if (assigneesList.length === 1) {
      formattedAssigneesList = assigneesList[0];
    } else {
      const lastAssignee = assigneesList.pop();
      formattedAssigneesList = props.t('{{itemList}} and {{lastItem}}', {
        itemList: assigneesList.join(', '),
        lastItem: lastAssignee,
        interpolation: { escapeValue: false },
      });
    }

    return props.t('Assigned to {{usersList}}', {
      usersList: formattedAssigneesList,
      interpolation: { escapeValue: false },
    });
  };

  return (
    <Modal
      title={props.t('Action details')}
      isOpen={props.isOpen}
      close={() => props.onClickCloseModal()}
      width={690}
    >
      {props.requestStatus !== 'success' && (
        <AppStatus status={props.requestStatus} isEmbed />
      )}

      {props.requestStatus === 'success' && (
        <div className="noteDetailModal">
          <h3 className="noteDetailModal__title">{props.annotation.title}</h3>
          <div className="noteDetailModal__annotationMeta">
            {`${
              window.featureFlags['standard-date-formatting']
                ? DateFormatter.formatStandard({
                    date: moment(props.annotation.annotation_date),
                  })
                : moment(props.annotation.annotation_date).format('DD MMM YYYY')
            } | ${props.annotation.organisation_annotation_type.name}`}
          </div>
          <div className="noteDetailModal__annotationableName">
            {props.annotation.annotationable.fullname}
          </div>

          {window.featureFlags['rich-text-editor'] &&
          props.annotation.content ? (
            <div className="noteDetailModal__content">
              <RichTextDisplay
                value={props.annotation.content}
                isAbbreviated={false}
              />
            </div>
          ) : (
            <div className="noteDetailModal__content">
              {props.annotation.content}
            </div>
          )}

          <h3 className="noteDetailModal__actionsListTitle">
            {`${props.t('Actions')} (${
              props.annotation.annotation_actions.filter(
                (action) => action.completed
              ).length
            }/${props.annotation.annotation_actions.length})`}
          </h3>
          <ul className="noteDetailModal__actionsList">
            {props.annotation.annotation_actions.map((action) => (
              <li key={action.id}>
                <ActionCheckbox
                  id={`action_${action.id}`}
                  isChecked={action.completed}
                  onToggle={() => {}}
                  isDisabled
                />
                <div className="noteDetailModal__actionInfo">
                  <div className="noteDetailModal__actionContent">
                    {action.content}
                  </div>
                  <div className="noteDetailModal__actionAssignees">
                    {getAssignees(action.users)}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="noteDetailModal__noteMetadata">
            <span className="noteDetailModal__createdBy">{`Created by ${
              props.annotation.created_by.fullname
            } on ${
              window.featureFlags['standard-date-formatting']
                ? DateFormatter.formatStandard({
                    date: moment(props.annotation.created_at),
                  })
                : moment(props.annotation.created_at).format('DD MMM YYYY')
            }`}</span>
            {props.annotation.updated_by ? (
              <span className="noteDetailModal__lastEditedBy">{`Last Edited by ${
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
        </div>
      )}
    </Modal>
  );
}

export default NoteDetailModal;
export const NoteDetailModalTranslated = withNamespaces()(NoteDetailModal);
