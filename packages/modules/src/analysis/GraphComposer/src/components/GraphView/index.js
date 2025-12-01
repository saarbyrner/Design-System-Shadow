// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import { TextButton } from '@kitman/components';
import type {
  GraphType,
  GraphGroup,
  SummaryGraphData,
  LongitudinalGraphData,
  SummaryBarGraphData,
  SummaryStackBarGraphData,
  SummaryDonutGraphData,
  ValueVisualisationData,
} from '@kitman/modules/src/analysis/shared/types';
import {
  getGraphTitles,
  formatGraphTitlesToString,
} from '@kitman/modules/src/analysis/shared/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { RenameModalTranslated as RenameModal } from '@kitman/modules/src/analysis/shared/components/GraphWidget/RenameModal';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import Longitudinal from './Longitudinal';
import Summary from './Summary';
import SummaryBar from './SummaryBar';
import SummaryStackBar from './SummaryStackBar';
import SummaryDonut from './SummaryDonut';
import ValueVisualisation from './ValueVisualisation';
import ActionBar from './ActionBar';

type Props = {
  graphData:
    | SummaryGraphData
    | LongitudinalGraphData
    | SummaryBarGraphData
    | SummaryStackBarGraphData
    | SummaryDonutGraphData
    | ValueVisualisationData,
  graphType: GraphType,
  canBuildGraph: boolean,
  canSaveGraph: boolean,
  containerType: string,
  isEditingDashboard: boolean,
  isEditingGraph: boolean,
  hasGraphData: boolean,
  graphGroup: GraphGroup,
  saveGraph: Function,
  openDashboardSelectorModal: Function,
  updateGraphType: Function,
  updateDecorators: Function,
  closeRenameGraphModal: Function,
  onRenameValueChange: (string) => void,
  onRenameConfirm: (?string, string) => void,
  renameModal: {
    graphTitle: ?string,
    updatedGraphTitle: ?string,
    isOpen: boolean,
  },
  updateAggregationPeriod: Function,
  openRenameGraphModal: Function,
};

const GraphView = (props: I18nProps<Props>) => {
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const { trackEvent } = useEventTracking();

  const onClickSave = () => {
    if (
      !props.isEditingDashboard &&
      props.containerType === 'AnalyticalDashboard'
    ) {
      props.openDashboardSelectorModal();
    } else {
      props.saveGraph();
    }
    // GA tracking
    TrackEvent('Graph Builder', 'Click', 'Save Graph');
    // Mixpanel
    const event = props.isEditingGraph ? 'Edit' : 'Add';
    trackEvent(`${event} Graph Widget`);
  };

  const getSaveButton = () => {
    const saveButtonText = props.isEditingGraph
      ? props.t('Save Changes')
      : props.t('Save Graph');

    return props.canSaveGraph ? (
      <div className="graphComposer__footer d-print-none">
        <TextButton
          text={saveButtonText}
          type="primary"
          onClick={onClickSave}
        />
      </div>
    ) : null;
  };

  const getRenameModal = () => {
    const inputValue =
      props.renameModal.updatedGraphTitle !== null
        ? props.renameModal.updatedGraphTitle
        : props.renameModal.graphTitle ||
          formatGraphTitlesToString(getGraphTitles(props.graphData));

    return (
      <RenameModal
        isRenameModalOpen={props.renameModal.isOpen}
        closeRenameModal={props.closeRenameGraphModal}
        value={inputValue}
        onChange={props.onRenameValueChange}
        onConfirm={() =>
          props.onRenameConfirm(
            props.renameModal.updatedGraphTitle,
            props.graphData.graphGroup
          )
        }
        feedbackModalStatus={null}
        feedbackModalMessage={null}
        hideFeedbackModal={() => {}}
      />
    );
  };

  const renderGraph = () => {
    switch (props.graphGroup) {
      case 'longitudinal': {
        // $FlowFixMe
        const graphData: LongitudinalGraphData = props.graphData;
        return (
          <Longitudinal
            isGraphExpanded={isGraphExpanded}
            closeGraphModal={() => setIsGraphExpanded(false)}
            updateAggregationPeriod={props.updateAggregationPeriod}
            openRenameGraphModal={props.openRenameGraphModal}
            graphData={graphData}
            graphType={props.graphType}
            canSaveGraph={props.canSaveGraph}
          />
        );
      }
      case 'summary': {
        // $FlowFixMe
        const graphData: SummaryGraphData = props.graphData;
        return (
          <Summary
            isGraphExpanded={isGraphExpanded}
            closeGraphModal={() => setIsGraphExpanded(false)}
            openRenameGraphModal={props.openRenameGraphModal}
            graphData={graphData}
            graphType={props.graphType}
            canSaveGraph={props.canSaveGraph}
          />
        );
      }
      case 'summary_bar': {
        // $FlowFixMe
        const graphData: SummaryBarGraphData = props.graphData;
        return (
          <SummaryBar
            isGraphExpanded={isGraphExpanded}
            closeGraphModal={() => setIsGraphExpanded(false)}
            openRenameGraphModal={props.openRenameGraphModal}
            graphData={graphData}
            graphType={props.graphType}
            canSaveGraph={props.canSaveGraph}
          />
        );
      }
      case 'summary_stack_bar': {
        // $FlowFixMe
        const graphData: SummaryStackBarGraphData = props.graphData;
        return (
          <SummaryStackBar
            isGraphExpanded={isGraphExpanded}
            closeGraphModal={() => setIsGraphExpanded(false)}
            openRenameGraphModal={props.openRenameGraphModal}
            graphData={graphData}
            graphType={props.graphType}
            canSaveGraph={props.canSaveGraph}
          />
        );
      }
      case 'summary_donut': {
        // $FlowFixMe
        const graphData: SummaryDonutGraphData = props.graphData;
        return (
          <SummaryDonut
            isGraphExpanded={isGraphExpanded}
            closeGraphModal={() => setIsGraphExpanded(false)}
            openRenameGraphModal={props.openRenameGraphModal}
            graphData={graphData}
            graphType={props.graphType}
            canSaveGraph={props.canSaveGraph}
          />
        );
      }
      case 'value_visualisation': {
        // $FlowFixMe
        const graphData: ValueVisualisationData = props.graphData;
        return (
          <ValueVisualisation
            isGraphExpanded={isGraphExpanded}
            closeGraphModal={() => setIsGraphExpanded(false)}
            openRenameGraphModal={props.openRenameGraphModal}
            graphData={graphData}
            graphType={props.graphType}
            canSaveGraph={props.canSaveGraph}
          />
        );
      }
      default:
        return null;
    }
  };

  if (!props.hasGraphData) {
    if (props.canBuildGraph) {
      window.location.hash = '#create';
    }

    return (
      <p className="graphComposer__noPermissionText">
        {props.t('You do not have the permission to create graphs')}
      </p>
    );
  }

  return (
    <div className="graphView">
      <div>
        <ActionBar
          graphGroup={props.graphGroup}
          graphType={props.graphType}
          updateGraphType={(graphType) =>
            props.updateGraphType(graphType, props.graphGroup)
          }
          graphData={props.graphData}
          updateDecorators={(decorators) =>
            props.updateDecorators(props.graphGroup, decorators)
          }
          canBuildGraph={props.canBuildGraph}
          openGraphModal={() => setIsGraphExpanded(true)}
        />

        {renderGraph()}

        {getSaveButton()}

        {getRenameModal()}
      </div>
    </div>
  );
};

export const GraphViewTranslated = withNamespaces()(GraphView);
export default GraphView;
