// @flow
import { useEffect } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  exposureOptions,
  mechanismOptions,
} from '../../../resources/filterOptions';
import { EditFormTranslated as EditForm } from './EditForm';

type Props = {
  variable: InjuryVariable,
  selectedDataSources: Array<string>,
  dataSources: { [string]: string },
  bodyAreaOptions: Array<SelectOption>,
  isVariableSaved: boolean,
  isKitmanAdmin: boolean,
  pipelineArnOptions: Array<SelectOption>,
  turnaroundList: Array<Turnaround>,
  positionGroupOptions: Array<SelectOption>,
  severityOptions: Array<SelectOption>,
  onSelectSeverities: Function,
  onChangeDateRange: Function,
  onSelectPositionGroups: Function,
  onSelectExposures: Function,
  onSelectMechanisms: Function,
  onApplyVariableFilters: Function,
  onSelectBodyArea: Function,
  onToggleHideVariable: Function,
  onSelectPipelineArn: Function,
  toggleDataSourcePanel: Function,
};

const VariableForm = (props: I18nProps<Props>) => {
  useEffect(() => {
    // we call this instead of the "Apply" button click whenever fields for the variable change
    // that would affect the results shown in the graphs
    if (!props.isVariableSaved) {
      props.onApplyVariableFilters();
    }
  }, [
    props.variable.date_range,
    props.variable.filter,
    props.variable.excluded_sources,
    props.variable.excluded_variables,
    props.variable.id,
  ]);

  const displaySelectedFilterNames = (
    options: Array<Object>,
    selectedOptions: Array<any>
  ) => {
    const optionsById = options.reduce((byIdHash, item) => {
      // eslint-disable-next-line no-param-reassign
      byIdHash[item.value] = item.label;
      return byIdHash;
    }, {});

    return selectedOptions.map((optionId) => (
      <span className="riskAdvisor__savedVariableVal" key={optionId}>
        {optionsById[optionId]}
      </span>
    ));
  };

  const formatRange = (startDate: moment, endDate: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatRange(startDate, endDate);
    }

    return `${startDate.format('D MMM YYYY')} - ${endDate.format(
      'D MMM YYYY'
    )}`;
  };

  const displayIncludedDataSources = () => {
    if (
      props.selectedDataSources.length === 0 ||
      Object.keys(props.dataSources).length === props.selectedDataSources.length
    ) {
      return <p>{props.t('All available data sources')}</p>;
    }
    return <span>{props.selectedDataSources.join(', ')}</span>;
  };

  const renderFilterContents = () => {
    return props.isVariableSaved ? (
      <>
        <div className="riskAdvisor__variableFormRow">
          <span className="riskAdvisor__savedVariableLabel">
            {props.t('Date range')}
          </span>
          <span className="riskAdvisor__savedVariableVal">
            {formatRange(
              moment(
                props.variable.date_range.start_date,
                DateFormatter.dateTransferFormat
              ),
              moment(
                props.variable.date_range.end_date,
                DateFormatter.dateTransferFormat
              )
            )}
          </span>
        </div>
        <div className="riskAdvisor__variableFormRow">
          <span className="riskAdvisor__savedVariableLabel">
            {props.t('Position Group')}
          </span>
          {props.variable.filter.position_group_ids?.length ? (
            displaySelectedFilterNames(
              props.positionGroupOptions,
              props.variable.filter.position_group_ids
            )
          ) : (
            <span className="riskAdvisor__savedVariableVal">
              {props.t('All Position Groups')}
            </span>
          )}
        </div>
        <div className="riskAdvisor__variableFormRow">
          <span className="riskAdvisor__savedVariableLabel">
            {props.t('Exposure')}
          </span>
          {props.variable.filter.exposure_types?.length ? (
            displaySelectedFilterNames(
              exposureOptions(),
              props.variable.filter.exposure_types
            )
          ) : (
            <span className="riskAdvisor__savedVariableVal">
              {props.t('All types')}
            </span>
          )}
        </div>
        <div className="riskAdvisor__variableFormRow">
          <span className="riskAdvisor__savedVariableLabel">
            {props.t('Mechanisms')}
          </span>
          {props.variable.filter.mechanisms?.length ? (
            displaySelectedFilterNames(
              mechanismOptions(),
              props.variable.filter.mechanisms
            )
          ) : (
            <span className="riskAdvisor__savedVariableVal">
              {props.t('All mechanisms')}
            </span>
          )}
        </div>
        <div className="riskAdvisor__variableFormRow">
          <span className="riskAdvisor__savedVariableLabel">
            {props.t('Body area')}
          </span>
          {props.variable.filter.osics_body_area_ids?.length ? (
            displaySelectedFilterNames(
              props.bodyAreaOptions,
              props.variable.filter.osics_body_area_ids
            )
          ) : (
            <span className="riskAdvisor__savedVariableVal">
              {props.t('All body areas')}
            </span>
          )}
        </div>
        {window.getFlag('risk-advisor-metric-creation-filter-on-injuries-causing-unavailability') && (
          <div className="riskAdvisor__variableFormRow">
            <span className="riskAdvisor__savedVariableLabel">
              {props.t('Severity')}
            </span>
            {props.variable.filter.severity?.length ? (
              displaySelectedFilterNames(
                props.severityOptions,
                props.variable.filter.severity
              )
            ) : (
              <span className="riskAdvisor__savedVariableVal">
                {props.t('All Severities')}
              </span>
            )}
          </div>
        )}
        <div className="riskAdvisor__variableFormRow">
          <span className="riskAdvisor__savedVariableLabel">
            {props.t('Data sources')}
          </span>
          {displayIncludedDataSources()}
        </div>
      </>
    ) : (
      <EditForm
        variable={props.variable}
        selectedDataSources={props.selectedDataSources}
        dataSources={props.dataSources}
        isVariableSaved={props.isVariableSaved}
        bodyAreaOptions={props.bodyAreaOptions}
        isKitmanAdmin={props.isKitmanAdmin}
        pipelineArnOptions={props.pipelineArnOptions}
        severityOptions={props.severityOptions}
        onSelectSeverities={props.onSelectSeverities}
        turnaroundList={props.turnaroundList}
        positionGroupOptions={props.positionGroupOptions}
        onChangeDateRange={props.onChangeDateRange}
        onSelectPositionGroups={props.onSelectPositionGroups}
        onSelectExposures={props.onSelectExposures}
        onSelectMechanisms={props.onSelectMechanisms}
        onSelectBodyArea={props.onSelectBodyArea}
        onToggleHideVariable={props.onToggleHideVariable}
        onSelectPipelineArn={props.onSelectPipelineArn}
        toggleDataSourcePanel={props.toggleDataSourcePanel}
      />
    );
  };

  return props.variable.name !== '' ? (
    <div className="riskAdvisor__variableForm">
      <h5>{props.t('Filters')}</h5>
      {renderFilterContents()}
    </div>
  ) : null;
};

export const VariableFormTranslated = withNamespaces()(VariableForm);
export default VariableForm;
