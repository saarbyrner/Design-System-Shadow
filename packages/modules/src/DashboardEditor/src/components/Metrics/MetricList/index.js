// @flow
import { Component } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { withNamespaces, setI18n } from 'react-i18next';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
import { IconButton } from '@kitman/components';
import type { Status } from '@kitman/common/src/types/Status';
import MetricListItem from './MetricListItem';

type Props = {
  statuses: Array<Status>,
  currentStatus: Status,
  onStatusItemClick: ($PropertyType<Status, 'status_id'>) => void,
  statusChanged: boolean,
  isAddingNewStatus: boolean,
  addStatusBtnClick: () => void,
  onStatusReorder: (Array<$PropertyType<Status, 'status_id'>>) => boolean,
  statusesPerPage: number,
};

// set the i18n instance
setI18n(i18n);

const SortableItem = SortableElement(
  ({ status, selected, isDisabled, onStatusItemClick }) => (
    <MetricListItem
      status={status}
      selected={selected}
      isDisabled={isDisabled}
      onStatusItemClick={onStatusItemClick}
    />
  )
);

const getStatusListItems = (
  statuses,
  currentStatus,
  onStatusItemClick,
  isDisabled
) =>
  statuses.map((status: Status, index: number) => {
    const uniqueKey = `${index}_${status.status_id}`;
    const selected = status.status_id === currentStatus.status_id;

    return [
      <SortableItem
        key={uniqueKey}
        index={index}
        uniqueKey={uniqueKey}
        status={status}
        selected={selected}
        disabled={isDisabled}
        // SortableElement HOC options are not passed to the wrapped
        // component and must be duplicated
        // See https://github.com/clauderic/react-sortable-hoc#wrapper-props-not-passed-down-to-wrapped-component
        isDisabled={isDisabled}
        onStatusItemClick={onStatusItemClick}
      />,
    ];
  });

// The React Sortable HOC functions return components
const SortableList = SortableContainer(
  ({ statuses, currentStatus, onStatusItemClick, isDisabled }) => (
    <ul className="statusList__sortableList">
      {getStatusListItems(
        statuses,
        currentStatus,
        onStatusItemClick,
        isDisabled
      )}
    </ul>
  )
);

class MetricList extends Component<Props> {
  onStatusReorder: (Array<$PropertyType<Status, 'status_id'>>) => boolean;

  constructor(props: Props) {
    super(props);

    this.onSortEnd = this.onSortEnd.bind(this);
    this.scrollToItem = this.scrollToItem.bind(this);
  }

  componentDidMount() {
    /* On first load scroll to the selected item */
    this.scrollToItem(document.getElementsByClassName('selected')[0]);
  }

  componentDidUpdate() {
    /* Scroll to the top of list when adding a new status */
    if (this.props.isAddingNewStatus) {
      this.scrollToItem(document.getElementsByClassName('statusList__item')[0]);
    }
  }

  onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number,
    newIndex: number,
  }) => {
    if (oldIndex === newIndex) {
      return;
    }

    const statusList = arrayMove(this.props.statuses, oldIndex, newIndex);

    this.props.onStatusReorder(statusList.map((status) => status.status_id));
  };

  scrollToItem = (itemElement?: Object) => {
    /* Element.scrollIntoView() is not supported in some old browsers and enzyme is complaining
    about it if its existence is not checked. */
    if (itemElement && itemElement.scrollIntoView) {
      itemElement.scrollIntoView();
    }
  };

  render() {
    return (
      <div className="statusList">
        <div className="statusList__header">
          <IconButton
            icon="icon-add"
            isDisabled={
              this.props.statusChanged || this.props.isAddingNewStatus
            }
            onClick={() => this.props.addStatusBtnClick()}
          />
        </div>
        <SortableList
          helperClass="statusList__item--reordering"
          onSortEnd={this.onSortEnd}
          statuses={this.props.statuses}
          currentStatus={this.props.currentStatus}
          onStatusItemClick={this.props.onStatusItemClick}
          isDisabled={this.props.statusChanged || this.props.isAddingNewStatus}
          statusesPerPage={this.props.statusesPerPage}
          useDragHandle
        />
      </div>
    );
  }
}

export const MetricListTranslated = withNamespaces()(MetricList);
export default MetricList;
