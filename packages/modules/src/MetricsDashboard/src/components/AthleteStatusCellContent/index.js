// @flow
/* eslint-disable react/sort-comp */
import type { Node } from 'react';

import { Component } from 'react';
import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { getAlarmColour } from '@kitman/common/src/utils';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import type { Status } from '@kitman/common/src/types/Status';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { SparklineTranslated as Sparkline } from '../Sparkline';

type Props = {
  statusValue?: ?number | ?string,
  status: Status,
  datapointsUsed?: number,
  alarms: Array<Alarm>,
  athleteId: string,
  canViewGraph: boolean,
};

class AthleteStatusCellContent extends Component<
  I18nProps<Props>,
  {
    isTooltipVisible: boolean,
  }
> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      isTooltipVisible: false,
    };

    this.onHideTooltip = this.onHideTooltip.bind(this);
    this.onShowTooltip = this.onShowTooltip.bind(this);
    this.deeplinkPath = this.deeplinkPath.bind(this);
  }

  // Tries shallow compare and then does deep compare
  // Code from http://benchling.engineering/performance-engineering-with-react/
  shouldComponentUpdate(nextProps: Props, nextState?: Object) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  alarmsHtml(alarms: Array<Alarm>, type: $PropertyType<Status, 'type'>): Node {
    if (alarms.length === 0) {
      return null;
    }

    return alarms.map((alarm) => {
      const classes = classNames('sparklineTooltip__alarmsItem', {
        [`sparklineTooltip__alarmsItem--${alarm.colour}`]:
          alarm.colour || false,
      });

      const alarmText =
        alarm.label && alarm.label !== ''
          ? alarm.label
          : this.alarmText(alarm.condition, alarm.value, type);
      return (
        <span key={alarm.alarm_id} className={classes}>
          {alarmText}
        </span>
      );
    });
  }

  alarmText(
    condition: $PropertyType<Alarm, 'condition'>,
    value: number,
    type: $PropertyType<Status, 'type'>
  ) {
    const formattedValue = this.formatValue(value, type);
    switch (condition) {
      case 'greater_than':
        return `> ${formattedValue}`;
      case 'less_than':
        return `< ${formattedValue}`;
      case 'equals':
        // No = when type is boolean
        if (type === 'boolean') {
          return formattedValue;
        }
        return `= ${formattedValue}`;
      default:
        return value;
    }
  }

  formatValue(value: number, type: $PropertyType<Status, 'type'>) {
    switch (type) {
      case 'boolean':
        return value === 1 ? this.props.t('Yes') : this.props.t('No');
      case 'sleep_duration':
        return this.formatSleepDuration(value);
      default:
        return value;
    }
  }

  formatSleepDuration(value: number) {
    const hours = Math.floor(value / 60);
    let minutes = value % 60;
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  }

  deeplinkPath = () => {
    return `/analysis/graph/builder?deeplink=status&status_id=${this.props.status.status_id}&athlete_id=${this.props.athleteId}#graphView`;
  };

  tooltipContent(
    status: Status,
    datapointsUsed: ?number,
    alarms: Array<Alarm>
  ) {
    const subtitle = status.localised_unit ? (
      <span className="sparklineTooltip__subtitle">
        {' '}
        ({status.localised_unit})
      </span>
    ) : (
      ''
    );

    const alarmColour =
      alarms.length > 0 ? getAlarmColour(alarms[0].colour) : null;
    const detailLink = this.props.canViewGraph ? (
      <a href={this.deeplinkPath()} className="sparklineTooltip__detailLink">
        {this.props.t('More details')}
      </a>
    ) : null;

    return (
      <div className="sparklineTooltip">
        <h3 className="sparklineTooltip__title">
          {status.name}
          {subtitle}
        </h3>
        <div className="sparklineTooltip__chart">
          <Sparkline
            status={status}
            athleteId={this.props.athleteId}
            isVisible={this.state.isTooltipVisible}
            alarmColour={alarmColour}
            numberOfDatapoints={datapointsUsed}
          />
        </div>
        <div className="sparklineTooltip__footer">
          {status.description} -{' '}
          <span>
            {this.props.t('Includes')} <strong>{datapointsUsed}</strong>{' '}
            {this.props.t('data point', { count: datapointsUsed })}
          </span>{' '}
          <div>
            <div className="sparklineTooltip__alarmCounter">
              <strong>{alarms.length}</strong>{' '}
              {this.props.t('alarm', { count: alarms.length })}{' '}
            </div>
            {this.alarmsHtml(alarms, status.type)}
          </div>
          {detailLink}
        </div>
      </div>
    );
  }

  statusContent(status: Status) {
    return (
      <Tippy
        placement="bottom-start"
        content={
          <div className="sparklinesTooltipContainer">
            {this.tooltipContent(
              status,
              this.props.datapointsUsed,
              this.props.alarms
            )}
          </div>
        }
        theme="neutral-tooltip"
        maxWidth="none"
        interactive
        delay={[500, 0]}
        onShow={() => this.onShowTooltip()}
        onHide={() => this.onHideTooltip()}
        appendTo={document.body}
      >
        <button type="button">
          {this.renderStatus(this.props.statusValue)}
        </button>
      </Tippy>
    );
  }

  onHideTooltip = () => {
    this.setState({
      isTooltipVisible: false,
    });
  };

  onShowTooltip = () => {
    // $FlowFixMe: third party library not imported (Google analytics)
    if (typeof ga === 'function') {
      ga('send', 'event', 'Sparkline', 'show', this.props.status.name); // eslint-disable-line no-undef
    }

    this.setState({
      isTooltipVisible: true,
    });
  };

  renderStatus(statusValue: ?number | ?string) {
    return typeof statusValue === 'number' || typeof statusValue === 'string'
      ? `${statusValue}`
      : '-';
  }

  render() {
    const classes = ['athleteStatusCellContent'];
    if (this.props.alarms.length > 0 && this.props.alarms[0].colour) {
      classes.push(
        `athleteStatusCellContent--alarm_${this.props.alarms[0].colour}`
      );
    }
    return (
      <div className={classes.join(' ')}>
        {this.props.status ? this.statusContent(this.props.status) : null}
      </div>
    );
  }
}

export default AthleteStatusCellContent;
