// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { Dropdown } from '@kitman/components';
import {
  availableZScoreRollingOperators,
  availableZScoreRollingComparativePeriods,
} from '@kitman/common/src/utils/status_utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  operator?: string,
  periodLength?: ?number,
  secondPeriodAllTime?: ?boolean,
  secondPeriodLength?: ?number,
  setZScoreRolling: (?string, ?number, ?boolean, ?number) => void,
};

export class ZScoreRollingComponent extends Component<I18nProps<Props>> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.operatorChanged = this.operatorChanged.bind(this);
    this.periodLengthChanged = this.periodLengthChanged.bind(this);
    this.secondPeriodAllTimeChanged =
      this.secondPeriodAllTimeChanged.bind(this);
    this.secondPeriodLengthChanged = this.secondPeriodLengthChanged.bind(this);
  }

  operatorChanged = (operatorId: string) => {
    this.props.setZScoreRolling(
      operatorId,
      this.props.periodLength,
      this.props.secondPeriodAllTime,
      this.props.secondPeriodLength
    );
  };

  periodLengthChanged = (event: Object) => {
    const value = event.target.value ? parseInt(event.target.value, 10) : null;
    this.props.setZScoreRolling(
      this.props.operator,
      value,
      this.props.secondPeriodAllTime,
      this.props.secondPeriodLength
    );
  };

  secondPeriodAllTimeChanged = (comparativePeriodId: string) => {
    let secondPeriodAllTime;
    let secondPeriodLength = this.props.secondPeriodLength;

    // if the selection in the dropdown is 'all' translate to
    // secondPeriodAllTime = true and set secondPeriodLength to null so and
    // previous value isn't kept around.
    if (comparativePeriodId === 'all') {
      secondPeriodAllTime = true;
      secondPeriodLength = null;
    } else {
      secondPeriodAllTime = false;
    }
    this.props.setZScoreRolling(
      this.props.operator,
      this.props.periodLength,
      secondPeriodAllTime,
      secondPeriodLength
    );
  };

  secondPeriodLengthChanged = (event: Object) => {
    const value = event.target.value ? parseInt(event.target.value, 10) : null;
    this.props.setZScoreRolling(
      this.props.operator,
      this.props.periodLength,
      this.props.secondPeriodAllTime,
      value
    );
  };

  comparativePeriodValue(secondPeriodAllTime: ?boolean) {
    switch (secondPeriodAllTime) {
      case true:
        return 'all';
      case false:
        return 'custom';
      default:
        return null;
    }
  }

  customEvaluativePeriod(
    secondPeriodAllTime: ?boolean,
    secondPeriodLength: ?number
  ) {
    if (secondPeriodAllTime == null || secondPeriodAllTime === true) {
      return null;
    }

    return (
      <div className="col-lg-3">
        <label className="zScoreRolling__label">&nbsp;</label>
        <div className="inputNumeric inputNumeric--fullWidth">
          <input
            onChange={this.secondPeriodLengthChanged}
            className="zScoreRolling__input km-input-control"
            type="number"
            value={secondPeriodLength || ''}
          />
          <span className="inputNumeric__descriptor">
            {this.props.t('Days')}
          </span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="row zScoreRolling">
        <div className="col-lg-2">
          <Dropdown
            onChange={this.operatorChanged}
            items={availableZScoreRollingOperators()}
            value={this.props.operator}
            disabled={false}
            label={this.props.t('Operator')}
          />
        </div>
        <div className="col-lg-3">
          <label className="zScoreRolling__label">
            {this.props.t('Evaluated Period')}
          </label>
          <div className="inputNumeric inputNumeric--fullWidth">
            <input
              onChange={this.periodLengthChanged}
              className="zScoreRolling__input km-input-control"
              type="number"
              value={this.props.periodLength || ''}
            />
            <span className="inputNumeric__descriptor">Days</span>
          </div>
        </div>
        <div className="col-lg-4">
          <Dropdown
            onChange={this.secondPeriodAllTimeChanged}
            items={availableZScoreRollingComparativePeriods()}
            value={this.comparativePeriodValue(this.props.secondPeriodAllTime)}
            disabled={false}
            label={this.props.t('Comparative Period')}
          />
        </div>
        {this.customEvaluativePeriod(
          this.props.secondPeriodAllTime,
          this.props.secondPeriodLength
        )}
      </div>
    );
  }
}

export default withNamespaces()(ZScoreRollingComponent);
