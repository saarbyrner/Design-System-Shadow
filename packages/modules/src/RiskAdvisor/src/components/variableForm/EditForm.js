// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { colors } from '@kitman/common/src/variables';
import {
  Accordion,
  Checkbox,
  DateRangePicker,
  Select,
} from '@kitman/components';
import type { SelectOption } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  exposureOptions,
  mechanismOptions,
} from '../../../resources/filterOptions';

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
  onSelectBodyArea: Function,
  onToggleHideVariable: Function,
  onSelectPipelineArn: Function,
  toggleDataSourcePanel: Function,
};

const EditForm = (props: I18nProps<Props>) => {
  const [isAdminSectionOpen, setIsAdminSectionOpen] = useState(false);

  const renderHiddenSourcesText = () => {
    return (
      <p>
        {props.t('+ {{hiddenSourceNumber}} more', {
          hiddenSourceNumber: props.selectedDataSources.length - 3,
        })}
      </p>
    );
  };

  const renderSelectedDataSources = () => {
    if (
      Object.keys(props.dataSources).length === props.selectedDataSources.length
    ) {
      return <p>{props.t('All available data sources')}</p>;
    }
    return props.selectedDataSources.map((sourceName, index) => {
      if (index <= 2) {
        return <span key={sourceName}>{sourceName}</span>;
      }
      return null;
    });
  };

  return (
    <>
      <div className="riskAdvisor__variableFormRow">
        <label className="riskAdvisor__dateRangeLabel">
          {props.t('Date range')}
        </label>
        <DateRangePicker
          turnaroundList={props.turnaroundList}
          onChange={(dateRange) => props.onChangeDateRange(dateRange)}
          value={props.variable.date_range}
          position="center"
          disabled={props.isVariableSaved}
          maxDate={moment(new Date()).add(-1, 'days')}
          kitmanDesignSystem
        />
      </div>
      <div className="riskAdvisor__variableFormRow">
        <Select
          label={props.t('Position Group')}
          isMulti
          placeholder=""
          value={props.variable.filter.position_group_ids}
          onChange={(positionGroupIds) =>
            props.onSelectPositionGroups(positionGroupIds)
          }
          options={props.positionGroupOptions}
          isDisabled={props.isVariableSaved}
          allowSelectAll
        />
      </div>
      <div className="riskAdvisor__variableFormRow">
        <Select
          label={props.t('Exposure')}
          isMulti
          placeholder=""
          value={props.variable.filter.exposure_types}
          onChange={(exposureId) => props.onSelectExposures(exposureId)}
          options={exposureOptions()}
          isDisabled={props.isVariableSaved}
          allowSelectAll
        />
      </div>
      <div className="riskAdvisor__variableFormRow">
        <Select
          label={props.t('Mechanism')}
          isMulti
          placeholder=""
          value={props.variable.filter.mechanisms}
          onChange={(mechanismId) => props.onSelectMechanisms(mechanismId)}
          options={mechanismOptions()}
          isDisabled={props.isVariableSaved}
          allowSelectAll
        />
      </div>
      <div className="riskAdvisor__variableFormRow">
        <Select
          label={props.t('Body area')}
          isMulti
          placeholder=""
          value={props.variable.filter.osics_body_area_ids}
          onChange={(bodyAreaId) => props.onSelectBodyArea(bodyAreaId)}
          options={props.bodyAreaOptions}
          isDisabled={props.isVariableSaved}
          allowSelectAll
        />
      </div>
      {window.getFlag('risk-advisor-metric-creation-filter-on-injuries-causing-unavailability') && (
        <div className="riskAdvisor__variableFormRow">
          <Select
            label={props.t('Severity')}
            isMulti
            placeholder=""
            value={props.variable.filter.severity}
            onChange={(severityIds) => props.onSelectSeverities(severityIds)}
            options={props.severityOptions}
            isDisabled={props.isVariableSaved}
            allowSelectAll
          />
        </div>
      )}
      <div className="riskAdvisor__variableFormRow riskAdvisor__variableFormRow--buttonContainer">
        <div className="riskAdvisor__dataSourcesContainer">
          <i
            className="riskAdvisor__dataSourceEditBtn icon-edit"
            onClick={() => props.toggleDataSourcePanel()}
          />
          <span className="riskAdvisor__editDataSourceLabel">
            {props.t('Data sources')}
          </span>
          {props.selectedDataSources.length > 0 && (
            <div className="riskAdvisor__selectedDataSources">
              {renderSelectedDataSources()}
              {Object.keys(props.dataSources).length !==
                props.selectedDataSources.length &&
                props.selectedDataSources.length > 3 &&
                renderHiddenSourcesText()}
            </div>
          )}
        </div>
      </div>
      {props.isKitmanAdmin && (
        <div className="riskAdvisor__accordion">
          <Accordion
            title={props.t('Admin')}
            key="admin_settings"
            iconAlign="left"
            titleColour={colors.grey_300}
            content={
              <div className="riskAdvisor__accordionContent">
                <div className="riskAdvisor__variableFormRow">
                  <Checkbox
                    id="riskAdvisor_hideVariable"
                    label={props.t('Hide metric')}
                    isChecked={props.variable.is_hidden}
                    toggle={(checkbox) =>
                      props.onToggleHideVariable(checkbox.checked)
                    }
                    kitmanDesignSystem
                  />
                </div>
                <div className="riskAdvisor__variableFormRow">
                  <Select
                    label={props.t('Pipeline ARN')}
                    placeholder=""
                    value={props.variable.pipeline_arn}
                    onChange={(arn) => props.onSelectPipelineArn(arn)}
                    options={props.pipelineArnOptions}
                    isDisabled={props.isVariableSaved}
                  />
                </div>
              </div>
            }
            isOpen={isAdminSectionOpen}
            onChange={() => {
              setIsAdminSectionOpen(!isAdminSectionOpen);
            }}
          />
        </div>
      )}
    </>
  );
};

export const EditFormTranslated = withNamespaces()(EditForm);
export default EditForm;
