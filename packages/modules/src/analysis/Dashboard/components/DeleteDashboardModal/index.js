// @flow
import { Component } from 'react';
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';

import { TrackEvent } from '@kitman/common/src/utils';
import { AppStatus } from '@kitman/components';
import type { ModalStatus } from '@kitman/common/src/types';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  dashboard: Dashboard,
  modalType: ?ModalStatus,
  onClickCloseButton: Function,
  onRequestStart: Function,
  onRequestFail: Function,
};

class DeleteDashboardModal extends Component<I18nProps<Props>> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.deleteDashboard = this.deleteDashboard.bind(this);
    this.getModalMessage = this.getModalMessage.bind(this);
  }

  deleteDashboard = () => {
    const self = this;
    this.props.onRequestStart();

    $.ajax({
      method: 'DELETE',
      url: `/analysis/dashboard/${self.props.dashboard.id}`,
      contentType: 'application/json',
    })
      .done(() => {
        // Redirect to the first dashboard
        window.location.assign('/analysis/dashboard');
      })
      .fail(() => {
        this.props.onRequestFail();
      });

    TrackEvent('Graph Dashboard', 'Click', 'Confirm Delete Dashboard');
  };

  getModalMessage = () => {
    return this.props.modalType === 'confirm'
      ? this.props.t(
          'Are you sure you want to delete the “{{- dashboardName}}” dashboard and all its content?',
          { dashboardName: this.props.dashboard.name }
        )
      : null;
  };

  render() {
    return (
      <AppStatus
        status={this.props.modalType}
        message={this.getModalMessage()}
        confirmButtonText={this.props.t('Delete')}
        close={() => this.props.onClickCloseButton()}
        hideConfirmation={() => {
          this.props.onClickCloseButton();
          TrackEvent('Graph Dashboard', 'Click', 'Cancel Delete Dashboard');
        }}
        confirmAction={this.deleteDashboard}
      />
    );
  }
}
export default DeleteDashboardModal;
export const DeleteDashboardModalTranslated =
  withNamespaces()(DeleteDashboardModal);
