// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal } from '@kitman/components';
import type {
  SummaryStackBarGraphData,
  GraphType,
} from '@kitman/modules/src/analysis/shared/types';
import SummaryStackBarGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryStackBarGraph';
import SummaryStackBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryStackBarDefaultSortConfig';

type Props = {
  graphData: SummaryStackBarGraphData,
  graphType: GraphType,
  openRenameGraphModal: Function,
  isGraphExpanded: boolean,
  closeGraphModal: Function,
  canSaveGraph?: boolean,
};

class SummaryStackBar extends Component<Props> {
  getGraph() {
    return this.props.graphType !== 'table' ? (
      <SummaryStackBarGraph
        graphData={this.props.graphData}
        openRenameGraphModal={this.props.openRenameGraphModal}
        graphType={this.props.graphType}
        graphStyle={{ marginTop: '40px' }}
        canSaveGraph={this.props.canSaveGraph}
        showTitle
        sorting={
          this.props.graphData.sorting || SummaryStackBarDefaultSortConfig
        }
      />
    ) : null; // TODO: Create summary stack bar table
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

export const SummaryStackBarTranslated = withNamespaces()(SummaryStackBar);
export default SummaryStackBar;
