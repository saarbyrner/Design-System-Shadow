// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { TrackEvent } from '@kitman/common/src/utils';
import { TooltipMenu } from '@kitman/components';

type Props = {
  canEditNotes: boolean,
  placement?: string,
  offset?: Array<number>,
  isArchived: boolean,
  onClickArchive: Function,
  onClickEdit: Function,
  onClickDuplicate: Function,
  onClickRestore: Function,
  kitmanDesignSystem?: boolean,
  icon?: string,
};

const AnnotationMenu = (props: Props) => {
  const editNoteBtn = {
    description: i18n.t('Edit Note'),
    icon: 'icon-edit',
    isDisabled: props.isArchived,
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Edit Note');
      props.onClickEdit();
    },
  };

  const duplicateNoteBtn = {
    description: i18n.t('Duplicate Note'),
    icon: 'icon-duplicate',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Duplicate Note');
      props.onClickDuplicate();
    },
    isDisabled: props.isArchived,
  };

  const archiveNoteBtn = {
    description: i18n.t('Archive Note'),
    icon: 'icon-archive',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Archive Note');
      props.onClickArchive();
    },
  };

  const restoreNoteBtn = {
    description: i18n.t('Restore Note'),
    icon: 'icon-restore',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Restore Note');
      props.onClickRestore();
    },
  };

  const menuItems = props.isArchived
    ? [editNoteBtn, duplicateNoteBtn, restoreNoteBtn]
    : [editNoteBtn, duplicateNoteBtn, archiveNoteBtn];

  return (
    <div className="noteMenu">
      {props.canEditNotes && (
        <TooltipMenu
          placement={props.placement || 'bottom-end'}
          offset={props.offset || [20, 12]}
          menuItems={menuItems}
          tooltipTriggerElement={
            <button type="button" className="noteMenu__button">
              <i className={props.icon || 'icon-more'} />
            </button>
          }
          kitmanDesignSystem={props.kitmanDesignSystem}
        />
      )}
    </div>
  );
};

export default AnnotationMenu;
