// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal } from '@kitman/components';
import type {
  SummaryDonutGraphData,
  GraphType,
} from '@kitman/modules/src/analysis/shared/types';
import SummaryDonutGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryDonutGraph';
import { SummaryDonutGraphTableTranslated as SummaryDonutGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryDonutGraphTable';
import SummaryDonutDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryDonutDefaultSortConfig';

type Props = {
  graphData: SummaryDonutGraphData,
  graphType: GraphType,
  openRenameGraphModal: Function,
  isGraphExpanded: boolean,
  closeGraphModal: Function,
  canSaveGraph?: boolean,
};

class SummaryDonut extends Component<Props> {
  getGraph(expanded?: ?boolean) {
    return this.props.graphType !== 'table' ? (
      <SummaryDonutGraph
        graphData={this.props.graphData}
        openRenameGraphModal={this.props.openRenameGraphModal}
        graphStyle={{ marginTop: '40px', height: expanded ? '80%' : 'auto' }}
        graphType={this.props.graphType}
        canSaveGraph={this.props.canSaveGraph}
        showTitle
        sorting={this.props.graphData.sorting || SummaryDonutDefaultSortConfig}
      />
    ) : (
      <SummaryDonutGraphTable
        graphData={this.props.graphData}
        showTitle
        openRenameGraphModal={this.props.openRenameGraphModal}
        canSaveGraph={this.props.canSaveGraph}
      />
    );
  }

  render() {
    return (
      <>
        <div className="graphView__graphContainer">{this.getGraph()}</div>

        <Modal
          isOpen={this.props.isGraphExpanded}
          close={this.props.closeGraphModal}
          fullscreen
        >
          {this.getGraph(true)}
        </Modal>
      </>
    );
  }
}

export const SummaryDonutTranslated = withNamespaces()(SummaryDonut);
export default SummaryDonut;
