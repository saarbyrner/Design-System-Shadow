// @flow
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import _debounce from 'lodash/debounce';
import _isEmpty from 'lodash/isEmpty';
import i18n from '@kitman/common/src/utils/i18n';
import classNames from 'classnames';

import { AppStatus } from '@kitman/components';
import annotationEmptyData from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/annotationEmptyData';
import type {
  Annotation,
  AnnotationAction,
} from '@kitman/common/src/types/Annotation';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ContainerType } from '../../types';
import { getPlaceholderImgPath } from '../utils';
import EmptyState from './components/EmptyState';
import Note from './components/Note';
import WidgetMenu from './components/WidgetMenu';
import { NotesWidgetTitleTranslated as NotesWidgetTitle } from './components/NotesWidgetTitle';
import WidgetCard from '../WidgetCard';

type Props = {
  annotations: Array<Annotation>,
  canCreateNotes: boolean,
  canEditNotes: boolean,
  canManageDashboard: boolean,
  canViewNotes: boolean,
  hasError?: boolean,
  isLoading?: boolean,
  nextPage?: number,
  onAddNote: Function,
  onClickActionCheckbox: Function,
  onClickViewArchivedNotes: Function,
  onDuplicate: Function,
  onEdit: Function,
  onArchiveNote: Function,
  onEditNote: Function,
  onDuplicateNote: Function,
  onFetchNextNotes: Function,
  onRestoreNote: Function,
  onRemove: Function,
  selectedAnnotationTypes: Array<Object>,
  selectedPopulation: Object,
  selectedTimeScope: Object,
  updatedAction: AnnotationAction,
  users: Array<{ id: number, name: string }>,
  widgetId?: number,
  widgetName?: string,
  onUpdateName: Function,
  notesModalStatus: ?string,
  notesModalMessage: ?string,
  hideNotesModalStatus: Function,
  noteViewStatus: ?string,
  noteViewMessage: ?string,
  hideNoteViewStatus: Function,
  notesWidgetStatus: ?string,
  notesWidgetMessage: ?string,
  notesWidgetSecondaryMessage: ?string,
  hideNotesWidgetStatus: Function,
  deleteAttachment: Function,
  onDeleteAttachment: Function,
  selectedTimeRange: { start_time: string, end_time: string },
  totalNotes: number,
  containerType: ContainerType,
};

const NotesWidget = (props: I18nProps<Props>) => {
  const isDashboardUIUpgradeFF = window.getFlag('rep-dashboard-ui-upgrade');
  const classNameSuffix = isDashboardUIUpgradeFF ? 'V2' : '';

  const [feedbackModalStatus, setFeebackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeebackModalMessage] = useState(null);
  const [expandNoteDetails, setExpandNoteDetails] = useState(false);
  const [expandedNote, setExpandedNote] = useState(Object);
  const [showArchivedNotes, setShowArchivedNotes] = useState(false);
  const contentElementRef = useRef(null);
  const archivedNotes = useMemo(
    () => props.annotations.filter((note) => note.archived),
    [props.annotations]
  );

  useEffect(() => {
    if (!_isEmpty(expandedNote) && props.annotations) {
      const updatedNote = props.annotations.find((annotation) => {
        return annotation.id === expandedNote.id;
      });
      if (updatedNote) {
        setExpandedNote(updatedNote);
      }
    }
  }, [props.annotations]);

  const notesWidgetClasses = classNames('notesWidget', {
    'notesWidget--loading': props.isLoading,
    'notesWidget--error': props.hasError,
  });

  const transformSelectedAnnotationTypes = (
    selectedAnnotationTypes: Array<Object>
  ) => {
    return selectedAnnotationTypes.map((type) => ({
      id: type.organisation_annotation_type_id,
    }));
  };

  const handleScroll = () => {
    if (
      contentElementRef.current &&
      contentElementRef.current.scrollTop ===
        contentElementRef.current.scrollHeight -
          contentElementRef.current.clientHeight
    ) {
      props.onFetchNextNotes(props.widgetId, props.nextPage);
    }
  };

  const getAllNotes = (annotations: Array<Annotation>) => {
    const archived = annotations.filter((note) => note.archived);
    const active = annotations.filter((note) => !note.archived);
    const visibleNotes = showArchivedNotes ? archived : active;

    if (visibleNotes.length === 0) {
      return (
        <EmptyState
          canCreateNotes={props.canCreateNotes}
          isArchiveView={showArchivedNotes}
          onClickAddNote={() => {
            props.onAddNote(
              {
                ...annotationEmptyData(
                  transformSelectedAnnotationTypes(
                    props.selectedAnnotationTypes
                  )
                ),
              },
              props.widgetId,
              props.widgetName,
              props.selectedAnnotationTypes,
              props.selectedPopulation,
              props.selectedTimeScope,
              props.selectedTimeRange
            );
          }}
        />
      );
    }

    const widgetMenuIconName = isDashboardUIUpgradeFF
      ? 'icon-hamburger-circled-dots'
      : 'icon-more';

    return visibleNotes.map((annotation) => (
      <div
        className={`notesWidget__note${classNameSuffix}`}
        key={annotation.id}
        onClick={(e) => {
          // Expand the note only if the user clicked outsied of the tooltip menu button
          if (e.target.className !== widgetMenuIconName) {
            setExpandNoteDetails(!expandNoteDetails);
            setExpandedNote(annotation);
          }
        }}
      >
        <Note
          annotation={annotation}
          users={props.users}
          canEditNotes={props.canEditNotes}
          onClickActionCheckbox={(action) => {
            props.onClickActionCheckbox(action);
          }}
          onDeleteAttachment={props.onDeleteAttachment}
          widgetId={props.widgetId || null}
          onArchiveNote={() => {
            setExpandNoteDetails(false);
            props.onArchiveNote(annotation);
          }}
          onEditNote={() => {
            props.onEditNote(
              annotation,
              props.widgetId,
              props.widgetName,
              props.selectedAnnotationTypes,
              props.selectedPopulation,
              props.selectedTimeScope,
              props.selectedTimeRange
            );
          }}
          onDuplicateNote={() => {
            props.onDuplicateNote(
              annotation,
              props.widgetId,
              props.widgetName,
              props.selectedAnnotationTypes,
              props.selectedPopulation,
              props.selectedTimeScope,
              props.selectedTimeRange
            );
          }}
          onRestoreNote={() => {
            setExpandNoteDetails(false);
            props.onRestoreNote(annotation);
          }}
          updatedAction={props.updatedAction}
          noteViewStatus={props.noteViewStatus}
          noteViewMessage={props.noteViewMessage}
          hideNoteViewStatus={props.hideNoteViewStatus}
        />
      </div>
    ));
  };

  const getForbiddenMessage = () => {
    return !props.canViewNotes ? (
      <p className="notesWidget__noPermissionText">
        {i18n.t(
          'Please contact your administrator for permission to view this data'
        )}
      </p>
    ) : null;
  };

  const getNoteView = (annotations) => {
    return expandNoteDetails ? (
      <Note
        annotation={expandedNote}
        users={props.users}
        canEditNotes={props.canEditNotes}
        isExpanded={expandNoteDetails}
        onDeleteAttachment={props.onDeleteAttachment}
        widgetId={props.widgetId || null}
        onClickActionCheckbox={(action) => {
          props.onClickActionCheckbox(action);
        }}
        onArchiveNote={() => {
          setExpandNoteDetails(false);
          props.onArchiveNote(expandedNote);
        }}
        onEditNote={() => {
          props.onEditNote(
            expandedNote,
            props.widgetId,
            props.widgetName,
            props.selectedAnnotationTypes,
            props.selectedPopulation,
            props.selectedTimeScope,
            props.selectedTimeRange
          );
        }}
        onDuplicateNote={() => {
          props.onDuplicateNote(
            expandedNote,
            props.widgetId,
            props.widgetName,
            props.selectedAnnotationTypes,
            props.selectedPopulation,
            props.selectedTimeScope,
            props.selectedTimeRange
          );
        }}
        onRestoreNote={() => {
          setExpandNoteDetails(false);
          props.onRestoreNote(expandedNote);
        }}
        updatedAction={props.updatedAction}
        noteViewStatus={props.noteViewStatus}
        noteViewMessage={props.noteViewMessage}
        hideNoteViewStatus={props.hideNoteViewStatus}
      />
    ) : (
      getAllNotes(annotations)
    );
  };

  const onUpdateNotesName = useCallback(
    (newName) => {
      props.onUpdateName(
        newName,
        props.selectedAnnotationTypes,
        props.selectedPopulation,
        props.selectedTimeScope
      );
    },
    [
      props.onUpdateName,
      props.selectedAnnotationTypes,
      props.selectedPopulation,
      props.selectedTimeScope,
    ]
  );

  const showAddNotesButton =
    !props.isLoading &&
    props.canCreateNotes &&
    !expandNoteDetails &&
    !showArchivedNotes &&
    !window.getFlag('rep-dashboard-ui-upgrade');

  return (
    <WidgetCard className={notesWidgetClasses}>
      <WidgetCard.Header
        className={classNames('notesWidget__header', {
          'notesWidget__header--archived': showArchivedNotes,
        })}
      >
        {!props.isLoading ? (
          <WidgetCard.Title>
            <NotesWidgetTitle
              totalArchivedNotes={archivedNotes.length}
              onClickBack={() => {
                if (expandNoteDetails) {
                  setExpandNoteDetails(false);
                  setExpandedNote(Object);
                } else {
                  setShowArchivedNotes(false);
                  props.onClickViewArchivedNotes(props.widgetId, false);
                }
              }}
              totalNotes={props.totalNotes}
              isShowingArchivedNotes={showArchivedNotes}
              isShowingNoteDetails={expandNoteDetails}
              notesName={props.widgetName}
              onUpdateNotesName={onUpdateNotesName}
              expandedNoteTitle={expandedNote.title}
            />
          </WidgetCard.Title>
        ) : null}
        <div className="notesWidget__headerRightDetails">
          {showAddNotesButton ? (
            <div className="notesWidget__addNoteButton">
              <i
                className="notesWidget__addNoteIcon icon-add"
                onClick={() => {
                  props.onAddNote(
                    {
                      ...annotationEmptyData(
                        transformSelectedAnnotationTypes(
                          props.selectedAnnotationTypes
                        )
                      ),
                    },
                    props.widgetId,
                    props.widgetName,
                    props.selectedAnnotationTypes,
                    props.selectedPopulation,
                    props.selectedTimeScope,
                    props.selectedTimeRange
                  );
                }}
              />
            </div>
          ) : null}
          {props.canManageDashboard &&
          !props.isLoading &&
          !expandNoteDetails ? (
            <WidgetMenu
              isArchiveView={showArchivedNotes}
              onClickDuplicate={() => {
                props.onDuplicate();
              }}
              onClickNotesWidgetSettings={() => {
                props.onEdit(
                  props.widgetId,
                  props.widgetName,
                  props.selectedAnnotationTypes,
                  props.selectedPopulation,
                  props.selectedTimeScope
                );
              }}
              onClickRemoveNotesWidget={() => {
                setFeebackModalStatus('confirm');
                setFeebackModalMessage(i18n.t('Remove Notes widget?'));
              }}
              onClickViewArchivedNotes={() => {
                setShowArchivedNotes(true);
                props.onClickViewArchivedNotes(props.widgetId, true);
              }}
              onClickAddNotes={() => {
                props.onAddNote(
                  {
                    ...annotationEmptyData(
                      transformSelectedAnnotationTypes(
                        props.selectedAnnotationTypes
                      )
                    ),
                  },
                  props.widgetId,
                  props.widgetName,
                  props.selectedAnnotationTypes,
                  props.selectedPopulation,
                  props.selectedTimeScope,
                  props.selectedTimeRange
                );
              }}
              containerType={props.containerType}
            />
          ) : null}
        </div>
      </WidgetCard.Header>
      <div
        className={`notesWidget__content${classNameSuffix}`}
        onScroll={_debounce(handleScroll, 100)}
        ref={contentElementRef}
      >
        {props.isLoading || !props.canViewNotes ? (
          <div className="notesWidget__loadingImage">
            <img
              src={getPlaceholderImgPath('annotation')}
              alt="notes placeholder"
            />
          </div>
        ) : (
          getNoteView(props.annotations)
        )}
        {getForbiddenMessage()}
      </div>

      <AppStatus
        status={feedbackModalStatus}
        message={feedbackModalMessage}
        confirmButtonText={i18n.t('Remove')}
        hideConfirmation={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        close={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        confirmAction={() => {
          props.onRemove();
        }}
      />
      <AppStatus
        status={props.notesModalStatus}
        message={props.notesModalMessage}
        close={() => props.hideNotesModalStatus()}
      />
      <AppStatus
        status={props.notesWidgetStatus}
        message={props.notesWidgetMessage}
        secondaryMessage={props.notesWidgetSecondaryMessage}
        close={() => props.hideNotesWidgetStatus()}
        confirmAction={props.deleteAttachment}
        deleteAllButtonText={props.t('Delete')}
      />
    </WidgetCard>
  );
};

NotesWidget.defaultProps = {
  annotations: [],
};

export const NotesWidgetTranslated = withNamespaces()(NotesWidget);
export default NotesWidget;
