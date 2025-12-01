// @flow
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import type { DropdownItem } from '@kitman/components/src/types';
import type { Status } from '@kitman/common/src/types/Status';
import type {
  StatusVariable,
  QuestionnaireVariable,
} from '@kitman/common/src/types';
import { Dropdown, PeriodScopeSelector } from '@kitman/components';
import {
  getPeriodScope,
  availableSummaries,
  availableTimePeriods,
  settingsBySummary,
} from '@kitman/common/src/utils/status_utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import MetricSelector from './MetricSelector';
import { SecondMetricSelectorTranslated as SecondMetricSelector } from './TrainingEfficiencyIndex/SecondMetricSelector';
import { AcuteChronicSettingsTranslated as AcuteChronicSettings } from './AcuteChronicSettings';
// set the i18n instance
setI18n(i18n);

type Props = {
  availableVariables: Array<QuestionnaireVariable>,
  updatedStatus: Status,
  onChange: Function,
  lockStatusMetric?: boolean,
  noPeriodSelector?: boolean,
  summaryWhiteList?: ?Array<string>,
  lastXPeriodRadioName?: ?string,
  withAbsoluteSummaries?: ?boolean,
};

class StatusForm extends Component<
  I18nProps<Props>,
  {
    value: Status,
    availableTimePeriods: Array<DropdownItem>,
  }
> {
  styles: Object;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      value: props.updatedStatus,
      availableTimePeriods: availableTimePeriods(
        props.updatedStatus.summary
      ).filter((timeScope) => timeScope.id !== 'this_season_so_far'),
    };

    this.setVariable = this.setVariable.bind(this);
    this.setSummary = this.setSummary.bind(this);
    this.setPeriodScope = this.setPeriodScope.bind(this);
    this.setPeriodLength = this.setPeriodLength.bind(this);
    this.setBothPeriodLengths = this.setBothPeriodLengths.bind(this);
    this.setZScoreRolling = this.setZScoreRolling.bind(this);
    this.setSettings = this.setSettings.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps: I18nProps<Props>) {
    this.setState({
      value: newProps.updatedStatus,
      availableTimePeriods: availableTimePeriods(
        newProps.updatedStatus.summary
      ).filter((timeScope) => timeScope.id !== 'this_season_so_far'),
    });
  }

  setVariable = (variable: StatusVariable, index: number) => {
    let newValue = null;
    if (index === 0) {
      newValue = Object.assign({}, this.state.value, {
        source_key: variable.source_key,
        type: variable.type,
        summary: null,
        period_scope: null,
        period_length: null,
        second_period_length: null,
        variables: this.buildVariables(variable, index),
        settings: {},
      });
    } else {
      newValue = Object.assign({}, this.state.value, {
        variables: this.buildVariables(variable, index),
      });
    }

    this.setState({
      value: newValue,
    });

    this.props.onChange(newValue);
  };

  setSettings = (settings: Object) => {
    const newValue = Object.assign({}, this.state.value, { settings });

    this.setState({ value: newValue });

    this.props.onChange(newValue);
  };

  splitSourceAndVariable(sourceKey: string) {
    const index = sourceKey.indexOf('|');
    const source = sourceKey.substr(0, index);
    const variable = sourceKey.substr(index + 1);
    return { source, variable };
  }

  buildVariables(variable: StatusVariable, index: number) {
    const sourceVariable = this.splitSourceAndVariable(variable.source_key);
    const newVariable = {
      source: sourceVariable.source,
      variable: sourceVariable.variable,
    };
    if (index === 0) {
      return [newVariable];
    }

    const newVariables: Array<any> = this.state.value.variables.slice();
    newVariables[index] = newVariable;
    return newVariables;
  }

  setSummary = (summary: string) => {
    const newValue = Object.assign({}, this.state.value, {
      summary,
      period_scope: getPeriodScope(summary),
      period_length: null,
      second_period_length: null,
      settings: settingsBySummary(summary),
    });

    this.setState({
      value: newValue,
      availableTimePeriods: availableTimePeriods(summary).filter(
        (timeScope) => timeScope.id !== 'this_season_so_far'
      ),
    });

    this.props.onChange(newValue);
  };

  setPeriodScope = (periodScope: ?string) => {
    const newValue = Object.assign({}, this.state.value, {
      period_scope: periodScope,
      period_length: null,
      second_period_length: null,
    });

    this.setState({
      value: newValue,
    });

    this.props.onChange(newValue);
  };

  setPeriodLength = (periodLength: ?number) => {
    const newValue = Object.assign({}, this.state.value, {
      period_length: periodLength,
    });

    this.setState({
      value: newValue,
    });

    this.props.onChange(newValue);
  };

  setBothPeriodLengths = (
    periodLengthValues: ?{ first: ?number, second: ?number }
  ) => {
    const newValue = Object.assign({}, this.state.value, {
      period_length: periodLengthValues ? periodLengthValues.first : null,
      second_period_length: periodLengthValues
        ? periodLengthValues.second
        : null,
    });

    this.setState({
      value: newValue,
    });

    this.props.onChange(newValue);
  };

  setZScoreRolling = (
    operator?: string,
    periodLength: ?number,
    secondPeriodAllTime?: boolean,
    secondPeriodLength: ?number
  ) => {
    const newValue = Object.assign({}, this.state.value, {
      operator,
      period_length: periodLength,
      second_period_all_time: secondPeriodAllTime,
      second_period_length: secondPeriodLength,
    });

    this.setState({
      value: newValue,
    });

    this.props.onChange(newValue);
  };

  getPeriodSelector() {
    if (this.props.noPeriodSelector) {
      return null;
    }

    return (
      <div className="statusForm__row">
        <PeriodScopeSelector
          lastXPeriodRadioName={this.props.lastXPeriodRadioName}
          summary={this.state.value.summary}
          periodScope={this.state.value.period_scope}
          periodLength={this.state.value.period_length || null}
          secondPeriodLength={this.state.value.second_period_length || null}
          availableTimePeriods={this.state.availableTimePeriods}
          operator={this.state.value.operator}
          secondPeriodAllTime={this.state.value.second_period_all_time}
          setPeriodScope={(periodScope) => this.setPeriodScope(periodScope)}
          setPeriodLength={(periodLength) => this.setPeriodLength(periodLength)}
          setBothPeriodLengths={(periodLengthValues) =>
            this.setBothPeriodLengths(periodLengthValues)
          }
          setZScoreRolling={(
            operator,
            periodLength,
            secondPeriodAllTime,
            secondPeriodLength
          ) =>
            this.setZScoreRolling(
              operator,
              periodLength,
              secondPeriodAllTime,
              secondPeriodLength
            )
          }
        />
      </div>
    );
  }

  getSummaries() {
    const getSplittedSourceKey = (child) =>
      this.state.value.source_key
        ? this.state.value.source_key.split('|')[child]
        : '';
    let summaries = availableSummaries(
      getSplittedSourceKey(0),
      getSplittedSourceKey(1),
      this.state.value.type,
      this.props.withAbsoluteSummaries
    );

    if (this.props.summaryWhiteList) {
      summaries = summaries.filter(
        // $FlowFixMe
        (summary) => this.props.summaryWhiteList.indexOf(summary.id) !== -1
      );
    }

    return summaries;
  }

  variableSourceKey(index: number) {
    const variable = this.state.value.variables[index];
    return variable ? `${variable.source}|${variable.variable}` : '';
  }

  renderEndOfFormCalculationSpecificFields() {
    switch (this.state.value.summary) {
      case 'acute_to_chronic_ratio':
      case 'ewma_acute_to_chronic_ratio':
        if (window.featureFlags['acute-chronic-inidividual']) {
          return (
            <AcuteChronicSettings
              onSettingsChange={this.setSettings}
              settings={this.state.value.settings}
            />
          );
        }
        return null;
      default:
        return null;
    }
  }

  renderCalculationSpecificFields() {
    switch (this.state.value.summary) {
      case 'training_efficiency_index':
        return (
          <SecondMetricSelector
            // $FlowFixMe: QuestionnaireVariable incompatible with StatusVariable
            availableVariables={this.props.availableVariables}
            onVariableChange={(variable) => this.setVariable(variable, 1)}
            onSettingsChange={this.setSettings}
            metricSourceKey={this.variableSourceKey(1)}
            settings={this.state.value.settings}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const summaries = this.getSummaries();

    return (
      <div className="statusForm">
        <div className="statusForm__row row">
          <div className="col-xl-8">
            <MetricSelector
              onChange={(variable) => this.setVariable(variable, 0)}
              availableVariables={this.props.availableVariables}
              isDisabled={this.props.lockStatusMetric}
              value={this.state.value.source_key}
            />
          </div>
        </div>
        <div className="statusForm__row row">
          <div className="col-xl-6">
            <Dropdown
              label={this.props.t('Calculation')}
              value={this.state.value.summary}
              items={summaries}
              disabled={!this.state.value.source_key}
              onChange={(summary) => this.setSummary(summary)}
            />
          </div>
        </div>
        {this.renderCalculationSpecificFields()}
        {this.getPeriodSelector()}
        {this.renderEndOfFormCalculationSpecificFields()}
      </div>
    );
  }
}

export const StatusFormTranslated = withNamespaces()(StatusForm);
export default StatusForm;
