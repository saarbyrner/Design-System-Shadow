// @flow
/* eslint-disable max-statements, react/sort-comp */
import { Component } from 'react';
import $ from 'jquery';
import i18n from '@kitman/common/src/utils/i18n';
import { withNamespaces, setI18n } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { AppStatus } from '@kitman/components';
import type { Status } from '@kitman/common/src/types/Status';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import { blankStatus } from '@kitman/common/src/utils/status_utils'; // TODO: shouldn't be using redux reducers in this format
import type { StatusVariable, ModalStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { MetricListTranslated as MetricList } from './MetricList';
import { AddEditMetricTranslated as AddEditMetric } from './AddEditMetric';

type Props = {
  availableVariables: Array<StatusVariable>,
  currentDashboardId: string,
  statusIds: Array<$PropertyType<Status, 'status_id'>>,
  statusesById: { [$PropertyType<Status, 'status_id'>]: Status },
  currentStatusId: string,
  alarmDefinitions: { [$PropertyType<Status, 'status_id'>]: Alarm },
};

// set the i18n instance
setI18n(i18n);

class Metrics extends Component<
  I18nProps<Props>,
  {
    statusesById: { [$PropertyType<Status, 'status_id'>]: Status },
    statusIds: Array<$PropertyType<Status, 'status_id'>>,
    currentStatus: Status,
    isAddingNewStatus: boolean,
    statusChanged: boolean,
    feedbackModalStatus: ModalStatus,
    feedbackModalMessage: string | null,
  }
> {
  setVariable: (Status) => void;

  feedbackModalTimeout: TimeoutID;

  constructor(props: I18nProps<Props>) {
    super(props);

    const statusIds = this.props.statusIds;
    // if the selected status id does not exist any more, just select the first one
    const currentStatusId =
      this.props.currentStatusId &&
      statusIds.indexOf(this.props.currentStatusId) !== -1
        ? this.props.currentStatusId
        : statusIds[0];

    // create a cloned currentStatus object so we can revert to the
    // original from statusesById if necessary
    const currentStatus = Object.assign(
      {},
      this.props.statusesById[currentStatusId]
    );

    this.state = {
      statusesById: this.props.statusesById,
      statusIds,
      currentStatus,
      isAddingNewStatus: false,
      statusChanged: false,
      feedbackModalStatus: null,
      feedbackModalMessage: null,
    };

    this.updateCurrentStatus = this.updateCurrentStatus.bind(this);
    this.saveStatus = this.saveStatus.bind(this);
    this.deleteCurrentStatus = this.deleteCurrentStatus.bind(this);
    this.confirmDeleteAction = this.confirmDeleteAction.bind(this);
    this.reorderStatuses = this.reorderStatuses.bind(this);
    this.onStatusItemClick = this.onStatusItemClick.bind(this);
    this.hideFeedbackModal = this.hideFeedbackModal.bind(this);
    this.addStatusBtnClick = this.addStatusBtnClick.bind(this);
    this.cancelBtnClick = this.cancelBtnClick.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.statusIds.length === 0) {
      this.setState(this.stateUpdatedWithNewStatus(this.state));
    }
  }

  onStatusItemClick = (newStatusId: $PropertyType<Status, 'status_id'>) => {
    if (this.state.isAddingNewStatus || this.state.statusChanged) {
      return;
    }

    this.setState({
      currentStatus: this.state.statusesById[newStatusId],
      isAddingNewStatus: false,
    });
  };

  updateCurrentStatus = (updatedStatus: Status) => {
    const hasChanges = this.hasStatusChanged(
      this.state.statusesById[this.state.currentStatus.status_id],
      updatedStatus
    );

    this.setState({
      currentStatus: updatedStatus,
      statusChanged: hasChanges,
    });
  };

  hasStatusChanged(originalStatus: Status, updateStatus: Status): boolean {
    return !isEqual(originalStatus, updateStatus);
  }

  addStatusBtnClick = () => {
    // $FlowFixMe: third party library not imported (Google analytics)
    if (typeof ga === 'function') {
      // eslint-disable-next-line no-undef
      ga(
        'send',
        'event',
        'Dashboard Editor',
        'trigger_add_status',
        'Add Status'
      );
    }
    // Add a new status to the state
    this.setState(this.stateUpdatedWithNewStatus(this.state));
  };

  stateUpdatedWithNewStatus(state: Object = {}): Object {
    const newStatus = blankStatus();
    const newStatusId = newStatus.status_id;
    const statusesById = Object.assign({}, state.statusesById, {
      [newStatusId]: newStatus,
    });
    let statusIds = [];
    statusIds = statusIds.concat(newStatusId, state.statusIds);

    return {
      currentStatus: newStatus,
      statusesById,
      statusIds,
      isAddingNewStatus: true,
    };
  }

  stateUpdatedWithDeletedStatus(state: Object = {}) {
    const statusesById = Object.assign({}, state.statusesById);
    const statusIds = state.statusIds.slice(0);

    const deletedPos = statusIds.indexOf(state.currentStatus.status_id);

    // The status to select will the the next status in the list, unless the last status is being
    // removed, where we show the previous status
    const nextStatusID =
      deletedPos === statusIds.length - 1
        ? statusIds[statusIds.length - 2]
        : statusIds[deletedPos + 1];

    // Remove the deleted status from the cloned state variables
    delete statusesById[this.state.currentStatus.status_id];
    statusIds.splice(deletedPos, 1);

    const newCurrentStatus = Object.assign(
      {},
      this.state.statusesById[nextStatusID]
    );

    let newState = {
      statusesById,
      statusIds,
      currentStatus: newCurrentStatus,
      isAddingNewStatus: false,
    };

    // If we've deleted the last status, add a blank one as there should always be one.
    if (statusIds.length === 0) {
      newState = this.stateUpdatedWithNewStatus(newState);
    }

    return newState;
  }

  cancelBtnClick = () => {
    if (this.state.isAddingNewStatus) {
      // $FlowFixMe: third party library not imported (Google analytics)
      if (typeof ga === 'function') {
        // eslint-disable-next-line no-undef
        ga(
          'send',
          'event',
          'Dashboard Editor',
          'trigger_cancel_add_status',
          'Cancel Add Status'
        );
      }
      this.setState(this.stateUpdatedWhenAddCancelled());
    } else {
      this.setState(this.stateUpdatedWhenStatusReset());
    }
  };

  stateUpdatedWhenStatusReset() {
    // Reset any changes in currentStatus by pulling it from statusesById 'source of truth'
    const newCurrentStatus = Object.assign(
      {},
      this.state.statusesById[this.state.currentStatus.status_id]
    );

    return {
      currentStatus: newCurrentStatus,
      statusChanged: false,
    };
  }

  stateUpdatedWhenAddCancelled(): Object {
    const newStatusesById = Object.assign({}, this.state.statusesById);
    delete newStatusesById[this.state.statusIds[0]];
    const newCurrentStatus = Object.assign(
      {},
      newStatusesById[this.state.statusIds[1]]
    );

    return {
      statusesById: newStatusesById,
      statusIds: this.state.statusIds.slice(1),
      currentStatus: newCurrentStatus,
      isAddingNewStatus: false,
      statusChanged: false,
    };
  }

  showSuccessFeedback() {
    this.setState({
      feedbackModalStatus: 'success',
      feedbackModalMessage: this.props.t('Success'),
    });

    // hide modal after a second
    this.feedbackModalTimeout = setTimeout(() => {
      this.hideFeedbackModal();
    }, 1000);
  }

  showErrorFeedback() {
    this.setState({
      feedbackModalStatus: 'error',
    });
  }

  hideFeedbackModal = () => {
    this.setState({
      feedbackModalStatus: null,
      feedbackModalMessage: null,
    });

    if (this.feedbackModalTimeout) {
      clearTimeout(this.feedbackModalTimeout);
    }
  };

  saveStatus = () => {
    if (this.state.currentStatus.is_custom_name) {
      // $FlowFixMe: third party library not imported (Google analytics)
      if (typeof ga === 'function') {
        // eslint-disable-next-line no-undef
        ga(
          'send',
          'event',
          'Dashboard Editor',
          'status_name_saved',
          'Renamed Status'
        );
      }
    }

    this.setState({
      feedbackModalStatus: 'loading',
      feedbackModalMessage: this.props.t('Saving status...'),
    });
    $.ajax({
      method: this.state.isAddingNewStatus ? 'POST' : 'PATCH',
      url: this.state.isAddingNewStatus
        ? `/dashboards/${this.props.currentDashboardId}/statuses/`
        : `/dashboards/${this.props.currentDashboardId}/statuses/${this.state.currentStatus.status_id}`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify(this.state.currentStatus),
    })
      .done((response) => {
        // $FlowFixMe: third party library not imported (Google analytics)
        if (typeof ga === 'function') {
          // eslint-disable-next-line no-undef
          ga(
            'send',
            'event',
            'Dashboard Editor',
            'save_status',
            'Save Status Success'
          );
        }

        const statusesById = Object.assign({}, this.state.statusesById);
        statusesById[response.status.status_id] = response.status;

        const newCurrentStatus = Object.assign({}, response.status);

        this.setState({
          statusesById,
          statusIds: this.state.statusIds,
          currentStatus: newCurrentStatus,
          isAddingNewStatus: false,
          statusChanged: false,
        });
        this.showSuccessFeedback();
      })
      .fail(() => {
        this.showErrorFeedback();
      });
  };

  deleteCurrentStatus = () => {
    // $FlowFixMe: third party library not imported (Google analytics)
    if (typeof ga === 'function') {
      // eslint-disable-next-line no-undef
      ga(
        'send',
        'event',
        'Dashboard Editor',
        'trigger_delete_status',
        'Delete Status'
      );
    }
    this.setState({
      feedbackModalStatus: 'confirm',
      feedbackModalMessage: this.props.t('Delete metric {{statusName}}?', {
        statusName: this.state.currentStatus.name,
      }),
    });
  };

  confirmDeleteAction = () => {
    $.ajax({
      method: 'DELETE',
      url: `/dashboards/${this.props.currentDashboardId}/statuses/${this.state.currentStatus.status_id}`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done(() => {
        // $FlowFixMe: third party library not imported (Google analytics)
        if (typeof ga === 'function') {
          // eslint-disable-next-line no-undef
          ga(
            'send',
            'event',
            'Dashboard Editor',
            'delete_status',
            'Delete Status Success'
          );
        }
        this.setState(this.stateUpdatedWithDeletedStatus(this.state));
        this.showSuccessFeedback();
      })
      .fail(() => {
        this.showErrorFeedback();
      });
  };

  reorderStatuses = (statusIds: Array<$PropertyType<Status, 'status_id'>>) => {
    // Set the order immediately so that the statusList doesn't jump about on a slow connection
    // Revert the original order if the save fails.
    const previousOrder = this.state.statusIds.slice(0);
    this.setState({ statusIds });

    $.ajax({
      method: 'PATCH',
      url: `/dashboards/${this.props.currentDashboardId}/reorder_statuses`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({ status_ids: statusIds }),
    }).fail(() => {
      this.setState({ statusIds: previousOrder });
      this.showErrorFeedback();
      return false;
    });
    return true;
  };

  statusHasAlarms() {
    const alarms = this.props.alarmDefinitions;
    return (
      Object.keys(alarms).indexOf(this.state.currentStatus.status_id) !== -1
    );
  }

  render() {
    const orderedStatuses = this.state.statusIds.map(
      (id) => this.state.statusesById[id]
    );
    const availableVariables = this.props.availableVariables;
    const hasAlarms = this.statusHasAlarms();

    return (
      <div>
        <div className="dashboardEditor__container">
          <MetricList
            statuses={orderedStatuses}
            currentStatus={this.state.currentStatus}
            statusChanged={this.state.statusChanged}
            isAddingNewStatus={this.state.isAddingNewStatus}
            onStatusItemClick={this.onStatusItemClick}
            addStatusBtnClick={this.addStatusBtnClick}
            onStatusReorder={this.reorderStatuses}
            statusesPerPage={9}
          />
          <AddEditMetric
            /*
             * We must have a key on this component. It enforces the form to remount when selecting another status.
             * <CustomTimePeriod /> is not a fully controlled form element. It initiates the value on mount, then
             * manage his value regardless of the props. So if we don't remount it, the value would remain the same
             * when selecting another status.
             */
            key={this.state.currentStatus.status_id}
            status={this.state.currentStatus}
            isAddingNewStatus={this.state.isAddingNewStatus}
            statusChanged={this.state.statusChanged}
            updateStatus={this.updateCurrentStatus}
            saveStatus={this.saveStatus}
            deleteStatus={this.deleteCurrentStatus}
            cancelBtnClick={this.cancelBtnClick}
            availableVariables={availableVariables}
            dashboardIsEmpty={this.state.statusIds.length === 1}
            hasAlarms={hasAlarms}
          />
          <AppStatus
            status={this.state.feedbackModalStatus}
            message={this.state.feedbackModalMessage}
            close={this.hideFeedbackModal}
            confirmAction={this.confirmDeleteAction}
            hideConfirmation={this.hideFeedbackModal}
            confirmButtonText={this.props.t('Delete')}
          />
        </div>
      </div>
    );
  }
}

export const MetricsTranslated = withNamespaces()(Metrics);
export default Metrics;
