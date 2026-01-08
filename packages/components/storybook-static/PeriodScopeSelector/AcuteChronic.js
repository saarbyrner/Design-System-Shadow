// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onChange?: (?Object) => void,
  firstPeriodLength?: ?number,
  secondPeriodLength?: ?number,
};

// TODO: Migrate this to use redux rather than internal variables
export class AcuteChronicComponent extends Component<I18nProps<Props>> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.periodLengthChange = this.periodLengthChange.bind(this);
    this.secondPeriodLengthChange = this.secondPeriodLengthChange.bind(this);
  }

  /**
   * periodLengthChange() sets the first period length
   * takes an onchange event
   */
  periodLengthChange = (event: Object) => {
    if (this.props.onChange) {
      this.props.onChange({
        first: event.target.value ? parseInt(event.target.value, 10) : null,
        second: this.props.secondPeriodLength,
      });
    }
  };

  /**
   * periodLengthChange() sets the second period length
   * takes an onchange event
   */
  secondPeriodLengthChange = (event: Object) => {
    if (this.props.onChange) {
      this.props.onChange({
        first: this.props.firstPeriodLength,
        second: event.target.value ? parseInt(event.target.value, 10) : null,
      });
    }
  };

  render() {
    return (
      <div className="acuteChronic">
        <div className="acuteChronic__label-cont">
          <label className="acuteChronic__label" htmlFor="Acute">
            {this.props.t('Acute')}
          </label>
          <label
            className="acuteChronic__label"
            htmlFor="Chronic"
          >{` ${this.props.t('Chronic')}`}</label>
        </div>
        <div className="acuteChronic__inputs">
          <div className="acuteChronic__input-cont">
            <span className="acuteChronic__descriptor">
              {this.props.t('Days')}
            </span>
            <input
              onChange={this.periodLengthChange}
              className="acuteChronic__input km-input-control"
              type="number"
              value={this.props.firstPeriodLength || ''}
            />
          </div>

          <span className="acuteChronic__seperator">{this.props.t('to')}</span>

          <div className="acuteChronic__input-cont">
            <span className="acuteChronic__descriptor">
              {this.props.t('Days')}
            </span>
            <input
              onChange={this.secondPeriodLengthChange}
              className="acuteChronic__input km-input-control"
              type="number"
              value={this.props.secondPeriodLength || ''}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(AcuteChronicComponent);
