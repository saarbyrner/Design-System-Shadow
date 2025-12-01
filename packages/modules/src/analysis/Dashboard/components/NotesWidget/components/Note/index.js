// @flow
import moment from 'moment';
import type {
  Annotation,
  AnnotationAction,
} from '@kitman/common/src/types/Annotation';
import AnnotationMenu from '@kitman/modules/src/Annotations/components/AnnotationMenu';
import { AppStatus, RichTextDisplay } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import ActionSummary from '../ActionSummary';
import { ExpandedNoteDetailsTranslated as ExpandedNoteDetails } from '../ExpandedNoteDetails';

type Props = {
  annotation: Annotation,
  canEditNotes: boolean,
  isExpanded?: boolean,
  onClickActionCheckbox: Function,
  onArchiveNote: Function,
  onEditNote: Function,
  onDuplicateNote: Function,
  onRestoreNote: Function,
  updatedAction: AnnotationAction,
  noteViewStatus: ?string,
  noteViewMessage: ?string,
  hideNoteViewStatus: Function,
  widgetId: ?number,
  onDeleteAttachment: Function,
  users: Array<{ id: number, name: string }>,
};

const Note = (props: Props) => {
  const isDashboardUIUpgradeFF =
    window.getFlag('rep-dashboard-ui-upgrade');
  const classNameSuffix = isDashboardUIUpgradeFF ? 'V2' : '';

  return (
    <>
      <div className="note__headerContainer">
        <div className="note__header">
          <span
            className={`note__${
              props.isExpanded
                ? `title${classNameSuffix}--expanded`
                : `title${classNameSuffix}`
            }`}
          >
            {props.annotation.title}
          </span>
          <span className="note__dateType">
            {`${
              window.featureFlags['standard-date-formatting']
                ? DateFormatter.formatStandard({
                    date: moment(props.annotation.annotation_date),
                  })
                : moment(props.annotation.annotation_date).format('DD MMM YYYY')
            } | ${props.annotation.organisation_annotation_type.name}`}
          </span>
          <span className="note__population">
            {props.annotation.annotationable.fullname}
          </span>
        </div>
        <AnnotationMenu
          icon={isDashboardUIUpgradeFF ? 'icon-hamburger-circled-dots' : ''}
          annotation={props.annotation}
          canEditNotes={props.canEditNotes}
          isArchived={props.annotation.archived}
          onClickArchive={() => {
            props.onArchiveNote();
          }}
          onClickEdit={() => {
            props.onEditNote();
          }}
          onClickDuplicate={() => {
            props.onDuplicateNote();
          }}
          onClickRestore={() => {
            props.onRestoreNote();
          }}
          kitmanDesignSystem
        />
      </div>

      {window.featureFlags['rich-text-editor'] && props.annotation.content ? (
        <RichTextDisplay
          value={props.annotation.content}
          isAbbreviated={!props.isExpanded}
        />
      ) : (
        <p
          className={`note__${
            props.isExpanded ? 'content--expanded' : 'content'
          }`}
        >
          {props.annotation.content}
        </p>
      )}

      {props.isExpanded ? (
        <ExpandedNoteDetails
          users={props.users}
          annotation={props.annotation}
          canEditNotes={props.canEditNotes}
          onClickActionCheckbox={(action) => {
            props.onClickActionCheckbox(action);
          }}
          updatedAction={props.updatedAction}
          onClickDeleteAttachment={props.onDeleteAttachment}
          widgetId={props.widgetId}
        />
      ) : (
        <ActionSummary
          annotation={props.annotation}
          updatedAction={props.updatedAction}
        />
      )}
      {!props.isExpanded &&
        props.annotation.attachments &&
        props.annotation.attachments.length > 0 && (
          <div className="note__attachmentCounter">
            <i className="icon-attachment" />
            <span>{props.annotation.attachments.length}</span>
          </div>
        )}
      <AppStatus
        status={props.noteViewStatus}
        message={props.noteViewMessage}
        close={() => props.hideNoteViewStatus()}
      />
    </>
  );
};

Note.defaultProps = {
  isExpanded: false,
};

export default Note;
