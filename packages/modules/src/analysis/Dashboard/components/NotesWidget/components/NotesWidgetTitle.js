// @flow
import { useState, useCallback, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import { EditInPlace } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../style';

type Props = {
  totalArchivedNotes: number,
  onClickBack: Function,
  totalNotes: number,
  isShowingArchivedNotes: boolean,
  isShowingNoteDetails: boolean,
  expandedNoteTitle?: string,
  notesName: string,
  onUpdateNotesName: Function,
};

function NotesWidgetTitle(props: I18nProps<Props>) {
  const shouldDisplayBackArrow =
    props.isShowingArchivedNotes || props.isShowingNoteDetails;

  const defaultName = props.t('Notes');
  const [notesWidgetName, setNotesWidgetName] = useState(
    !props.notesName || props.notesName === '' ? defaultName : props.notesName
  );

  const updateName = useCallback((name) => {
    setNotesWidgetName(name);
    props.onUpdateNotesName(name);
  }, []);

  // Handling case for new name being set as empty string
  useEffect(() => {
    if (notesWidgetName === '' || props.notesName === '') {
      setNotesWidgetName(defaultName);
    }
  }, [defaultName, props.notesName, notesWidgetName]);

  const isDashboardUIUpgradeFF =
    window.getFlag('rep-dashboard-ui-upgrade');

  return (
    <span
      className={classNames('notesWidget__title', {
        'notesWidget__title--archived': props.isShowingArchivedNotes,
      })}
    >
      {shouldDisplayBackArrow ? (
        <i
          className={classNames(
            'notesWidget__headerBackArrow icon-arrow-left',
            {
              'notesWidget__headerBackArrow--archived':
                props.isShowingArchivedNotes,
            }
          )}
          onClick={props.onClickBack}
        />
      ) : null}
      {shouldDisplayBackArrow ? (
        <h6 className="notesWidget__titleText">
          {props.isShowingNoteDetails && props.expandedNoteTitle}
          {props.isShowingArchivedNotes &&
            `${props.t('Archived Notes')} (${props.totalArchivedNotes})`}
        </h6>
      ) : (
        <EditInPlace
          editOnTextOnly={isDashboardUIUpgradeFF}
          value={notesWidgetName}
          onChange={updateName}
          titleRenderer={(title) => {
            if (isDashboardUIUpgradeFF) {
              return (
                <>
                  {title}
                  <span css={style.totalNotes}>[ {props.totalNotes} ]</span>
                </>
              );
            }
            return `${title} (${props.totalNotes})`;
          }}
        />
      )}
    </span>
  );
}

export const NotesWidgetTitleTranslated = withNamespaces()(NotesWidgetTitle);
export default NotesWidgetTitle;
