// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal } from '@kitman/components';
import type {
  SummaryBarGraphData,
  GraphType,
} from '@kitman/modules/src/analysis/shared/types';
import SummaryBarGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraph';
import { SummaryBarGraphTableTranslated as SummaryBarGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraphTable';
import SummaryBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryBarDefaultSortConfig';

type Props = {
  graphData: SummaryBarGraphData,
  graphType: GraphType,
  openRenameGraphModal: Function,
  isGraphExpanded: boolean,
  closeGraphModal: Function,
  canSaveGraph?: boolean,
};

class SummaryBar extends Component<Props> {
  getGraph() {
    return this.props.graphType !== 'table' ? (
      <SummaryBarGraph
        graphData={this.props.graphData}
        graphStyle={{ marginTop: '40px' }}
        openRenameGraphModal={this.props.openRenameGraphModal}
        graphType={this.props.graphType}
        canSaveGraph={this.props.canSaveGraph}
        showTitle
        sorting={this.props.graphData.sorting || SummaryBarDefaultSortConfig}
      />
    ) : (
      <SummaryBarGraphTable
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
          {this.getGraph()}
        </Modal>
      </>
    );
  }
}

export const SummaryBarTranslated = withNamespaces()(SummaryBar);
export default SummaryBar;
