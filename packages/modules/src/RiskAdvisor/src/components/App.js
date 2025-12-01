// @flow
import $ from 'jquery';
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TabBar } from '@kitman/components';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import RenameVariableModal from '../containers/RenameVariableModal';
import AppStatus from '../containers/AppStatus';
import GenerateMetricStatus from '../containers/GenerateMetricStatus';
import Toast from '../containers/Toast';
import { InjuryRiskMetricsTabTranslated as InjuryRiskMetricsTab } from './injuryRiskMetricsTab';
import DataSourcePanel from '../containers/DataSourcePanel';

type Props = {
  turnaroundList: Array<Turnaround>,
  allVariables: Array<InjuryVariable>,
  currentVariable: InjuryVariable,
  graphData: {
    summary: ?Object,
    value: ?Object,
  },
  canCreateMetric: boolean,
  canViewMetrics: boolean,
  onSelectInjuryVariable: Function,
  onAddNewInjuryVariable: Function,
  onCancelEditInjuryVariable: Function,
  onSaveVariable: Function,
  buildVariableGraphs: Function,
};

const App = (props: I18nProps<Props>) => {
  const [dataSources, setDataSources] = useState<{ [string]: string }>({});
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const [variableOptions, setVariableOptions] = useState([]);

  const isVariableSaved = !!props.currentVariable.variable_uuid;

  const isVariablePresent = props.currentVariable.name !== '';

  useEffect(() => {
    const activeOptions = [];
    const archivedOptions = [
      {
        isGroupOption: true,
        id: 0,
        name: props.t('Archived'),
      },
    ];
    if (props.allVariables.length > 0) {
      props.allVariables.forEach((variable) => {
        // $FlowFixMe variable length is already checked
        if (variable.archived) {
          archivedOptions.push({
            // $FlowFixMe variable length is already checked
            id: variable.id,
            // $FlowFixMe variable length is already checked
            name: variable.name,
          });
        } else {
          activeOptions.push({
            // $FlowFixMe variable length is already checked
            id: variable.id,
            // $FlowFixMe variable length is already checked
            name: variable.name,
          });
        }
      });
      const allOptions = activeOptions.concat(archivedOptions);
      setVariableOptions(allOptions);
    } else {
      setVariableOptions([]);
    }
  }, [props.allVariables]);

  const fetchDataSources = () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: '/administration/metrics',
        contentType: 'application/json',
      })
        .done((data) => {
          resolve(data);
        })
        .fail(() => {
          reject();
        });
    });
  };

  useEffect(() => {
    fetchDataSources().then(
      (responseData) => {
        setDataSources(responseData.sources);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  const isMetricBeingCreated = () =>
    props.allVariables.some((variable) => variable.status === 'in_progress');

  const injuriesPresent = () => {
    const summaryDataPoints =
      props.graphData.summary?.metrics[0]?.series[0]?.datapoints;
    const summaryDataPointWithValueExists = summaryDataPoints
      ? !!summaryDataPoints.find((dataPoint) => dataPoint.y > 0)
      : false;
    const valueDataExists = props.graphData.value
      ? props.graphData.value.metrics[0]?.series[0]?.value > 0
      : false;

    return summaryDataPointWithValueExists || valueDataExists;
  };

  const getSelectedDataSources = () => {
    if (!props.currentVariable.excluded_sources) {
      return [];
    }

    const selectedSources = [];
    Object.keys(dataSources).forEach((key) => {
      if (!props.currentVariable.excluded_sources.includes(key)) {
        selectedSources.push(dataSources[key]);
      }
    });
    return selectedSources;
  };

  const injuryRiskMetricsTab = {
    title: props.t('Injury risk metrics'),
    content: (
      <InjuryRiskMetricsTab
        turnaroundList={props.turnaroundList}
        selectedDataSources={getSelectedDataSources()}
        dataSources={dataSources}
        onSelectInjuryVariable={props.onSelectInjuryVariable}
        onAddNewInjuryVariable={props.onAddNewInjuryVariable}
        onCancelEditInjuryVariable={props.onCancelEditInjuryVariable}
        onSaveVariable={props.onSaveVariable}
        buildVariableGraphs={props.buildVariableGraphs}
        currentVariable={props.currentVariable}
        variableOptions={variableOptions}
        isVariableSaved={isVariableSaved}
        isVariablePresent={isVariablePresent}
        isMetricBeingCreated={isMetricBeingCreated()}
        injuriesPresent={injuriesPresent()}
        canCreateMetric={props.canCreateMetric}
        canViewMetrics={props.canViewMetrics}
      />
    ),
  };
  return (
    <div className="riskAdvisor">
      <TabBar tabPanes={[injuryRiskMetricsTab]} />
      <RenameVariableModal />
      <Toast />
      <AppStatus confirmButtonText={props.t('Exit')} />
      <GenerateMetricStatus confirmButtonText={props.t('Proceed')} />
      <DataSourcePanel
        dataSources={dataSources}
        requestStatus={requestStatus}
      />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
