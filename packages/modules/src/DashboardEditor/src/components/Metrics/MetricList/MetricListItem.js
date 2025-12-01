// @flow
import { Component } from 'react';
import classNames from 'classnames';
import i18n from '@kitman/common/src/utils/i18n';
import type { Status } from '@kitman/common/src/types/Status';
import { withNamespaces, setI18n } from 'react-i18next';
import { SortableHandle } from 'react-sortable-hoc';

type Props = {
  status: Status,
  selected: boolean,
  isDisabled: boolean,
  onStatusItemClick: ($PropertyType<Status, 'status_id'>) => void,
};

// set the i18n instance
setI18n(i18n);

class StatusListItem extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.getHandle = this.getHandle.bind(this);
  }

  getLocalisedUnit(status: Status) {
    return status.localised_unit ? (
      <span>
        {' ('}
        {status.localised_unit})
      </span>
    ) : null;
  }

  getHandle = () => {
    const DragHandle = SortableHandle(() => (
      <span className="statusList__icon icon-reorder-vertical" />
    ));
    return this.props.isDisabled ? (
      <span className="statusList__icon icon-reorder-vertical disabled" />
    ) : (
      <DragHandle />
    );
  };

  render() {
    const itemClassName = classNames('statusList__item', {
      selected: this.props.selected,
      disabled: this.props.isDisabled,
    });
    const labelClassName = classNames('statusList__name', {
      disabled: this.props.isDisabled,
    });

    const unit = this.getLocalisedUnit(this.props.status);
    const label = this.props.status.name || i18n.t('New Metric');

    return (
      <li
        className={itemClassName}
        onClick={() =>
          this.props.onStatusItemClick(this.props.status.status_id)
        }
      >
        {this.getHandle()}
        <span className={labelClassName}>
          {label}
          {unit}
        </span>
      </li>
    );
  }
}

export const StatusListItemTranslated = withNamespaces()(StatusListItem);
export default StatusListItem;
