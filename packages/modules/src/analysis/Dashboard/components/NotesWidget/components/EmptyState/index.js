// @flow
import i18n from '@kitman/common/src/utils/i18n';

type Props = {
  canCreateNotes: boolean,
  isArchiveView: boolean,
  onClickAddNote: Function,
};

const EmptyState = (props: Props) => {
  if (props.canCreateNotes && !props.isArchiveView) {
    return (
      <div
        className="emptyState__button"
        onClick={() => {
          props.onClickAddNote();
        }}
      >
        <i className="emptyState__icon icon-widget-notes" />
        <span className="emptyState__text">{i18n.t('Add Note')}</span>
      </div>
    );
  }

  return (
    <p className="emptyState__noNotesText">
      {props.isArchiveView
        ? i18n.t('There are no archived notes')
        : i18n.t('There are no notes')}
    </p>
  );
};

export default EmptyState;
