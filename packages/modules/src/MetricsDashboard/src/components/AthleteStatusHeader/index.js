// @flow
import type { Node } from 'react';

import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { IconButton, TooltipMenu } from '@kitman/components';
import type { Status } from '@kitman/common/src/types/Status';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getEmptyCells } from '@kitman/common/src/utils/dashboard';
import AlarmsEditorButton from '../../containers/AlarmsEditorButton';

type Props = {
  statusOrder: Array<string>,
  statusMap: { string: Status },
  canManageDashboard?: boolean,
  currentDashboardId: string,
  dummyCellsNumber: number,
  updateSort: Function,
};

export class AthleteStatusHeader extends Component<I18nProps<Props>> {
  dummyStatusesCount: ?number;

  constructor(props: I18nProps<Props>) {
    super(props);

    const minimumNumberOfCells = 8;
    this.dummyStatusesCount =
      minimumNumberOfCells - this.props.statusOrder.length;
  }

  getAddStatusBtn() {
    return this.props.canManageDashboard ? (
      <IconButton
        icon="icon-add"
        onClick={() => {
          window.location.assign(
            `/dashboards/${this.props.currentDashboardId}/edit`
          );
        }}
        text={this.props.t('Add Metric')}
      />
    ) : null;
  }

  manageStatusMenu(status: Status) {
    const menuItems = () =>
      this.props.canManageDashboard
        ? [
            {
              description: this.props.t('Edit this metric'),
              href: `/dashboards/${this.props.currentDashboardId}/edit?status=${status.status_id}`,
              icon: 'icon-edit',
            },
            {
              description: this.props.t('Sort: High to Low'),
              onClick: () =>
                this.props.updateSort(
                  'high_to_low',
                  status.status_id,
                  this.props.statusMap[status.status_id].source_key
                ),
              icon: 'icon-sort-high-low',
            },
            {
              description: this.props.t('Sort: Low to High'),
              onClick: () =>
                this.props.updateSort(
                  'low_to_high',
                  status.status_id,
                  this.props.statusMap[status.status_id].source_key
                ),
              icon: 'icon-sort-low-high',
            },
          ]
        : [
            {
              description: this.props.t('Sort: High to Low'),
              onClick: () =>
                this.props.updateSort(
                  'high_to_low',
                  status.status_id,
                  this.props.statusMap[status.status_id].source_key
                ),
              icon: 'icon-sort-high-low',
            },
            {
              description: this.props.t('Sort: Low to High'),
              onClick: () =>
                this.props.updateSort(
                  'low_to_high',
                  status.status_id,
                  this.props.statusMap[status.status_id].source_key
                ),
              icon: 'icon-sort-low-high',
            },
          ];

    if (menuItems().length === 0) {
      return null;
    }

    return (
      <TooltipMenu
        offset={[-10, 10]}
        tooltipTriggerElement={<i className="icon-more" />}
        menuItems={menuItems()}
        externalItem={<AlarmsEditorButton statusId={status.status_id} />}
        externalItemOrder={1}
      />
    );
  }

  /* eslint-disable no-undef */
  intercomContact() {
    // Flow is switched off for this line because of Intercom
    // $FlowFixMe
    if (typeof Intercom !== 'undefined') {
      Intercom('showNewMessage');
    }
  }

  truncateStatusName(statusName: string) {
    const truncationLimit = 50;
    const ending = '...';
    const truncatedStatusName = statusName.substring(
      0,
      truncationLimit - ending.length
    );
    return statusName.length > truncationLimit
      ? `${truncatedStatusName.trim()}${ending}`
      : statusName;
  }

  /* eslint-enable no-undef */
  renderStatuses(): Node {
    if (this.props.statusOrder.length === 0) {
      return (
        <div className="tableHeadMessage">
          <span className="tableHeadMessage__text">
            {this.props.t('There are no metrics for this dashboard.')}
          </span>
          {this.getAddStatusBtn()}
        </div>
      );
    }

    let statusesHtml = this.props.statusOrder.map((statusId, index) => {
      const status = this.props.statusMap[statusId];

      // work around to ensure unique key because we don't return
      // a new status object on saving with a unique id - we just refresh the page
      const uniqueKey = `${index}_${statusId}`;

      return (
        <div key={uniqueKey} className="athleteStatusHeader__status">
          {this.manageStatusMenu(status)}
          <div>
            {this.truncateStatusName(status.name)}
            <span className="athleteStatusHeader__statusUnit">
              {status.localised_unit ? `(${status.localised_unit})` : null}
            </span>
          </div>
        </div>
      );
    });

    // if we have less than the minimum cells, we need to populate the status header
    // with blank ones
    const emptyStatuses = getEmptyCells(
      this.props.dummyCellsNumber,
      'athleteStatusHeader__status'
    );
    statusesHtml = statusesHtml.concat(emptyStatuses);

    return statusesHtml;
  }

  render() {
    return (
      <div className="athleteStatusHeader">
        <div className="athleteStatusHeader__athleteTitle" />
        <div className="athleteStatusHeader__statusesContainer js-scrollableTable__header">
          {this.renderStatuses()}
        </div>
      </div>
    );
  }
}

export const AthleteStatusHeaderTranslated =
  withNamespaces()(AthleteStatusHeader);
export default AthleteStatusHeader;
