// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onChange?: (Object, ?Object) => void,
  firstPeriodLength?: ?number,
  secondPeriodLength?: ?number,
};

// TODO: Migrate this to use redux rather than internal variables
export class EvaluativeComparativeSelectorComponent extends Component<
  I18nProps<Props>
> {
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
      <div className="evaluative-comparative">
        <div className="evaluative-comparative__label-cont">
          <label
            className="evaluative-comparative__label"
            htmlFor="Evaluated Period"
          >
            {this.props.t('Evaluated Period')}
          </label>
          <label
            className="evaluative-comparative__label"
            htmlFor="Comparative Period"
          >
            {this.props.t('Comparative Period')}
          </label>
        </div>
        <div className="evaluative-comparative__inputs">
          <div className="evaluative-comparative__input-cont">
            <span className="evaluative-comparative__descriptor">
              {this.props.t('Days')}
            </span>
            <input
              onChange={this.periodLengthChange}
              className="evaluative-comparative__input km-input-control"
              type="number"
              value={this.props.firstPeriodLength || ''}
            />
          </div>

          <div className="evaluative-comparative__input-cont">
            <span className="evaluative-comparative__descriptor">
              {this.props.t('Days')}
            </span>
            <input
              onChange={this.secondPeriodLengthChange}
              className="evaluative-comparative__input km-input-control"
              type="number"
              value={this.props.secondPeriodLength || ''}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(EvaluativeComparativeSelectorComponent);
