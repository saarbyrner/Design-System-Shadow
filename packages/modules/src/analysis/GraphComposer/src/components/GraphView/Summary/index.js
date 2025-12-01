// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal } from '@kitman/components';
import type {
  SummaryGraphData,
  GraphType,
} from '@kitman/modules/src/analysis/shared/types';
import { SummaryGraphTableTranslated as SummaryGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryGraphTable';
import SummaryGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryGraph';

type Props = {
  graphType: GraphType,
  graphData: SummaryGraphData,
  openRenameGraphModal: Function,
  isGraphExpanded: boolean,
  closeGraphModal: Function,
  canSaveGraph?: boolean,
};

class Summary extends Component<Props> {
  getGraph(expanded?: ?boolean) {
    return this.props.graphType !== 'table' ? (
      <SummaryGraph
        key={this.props.graphType}
        graphData={this.props.graphData}
        graphStyle={{ marginTop: '40px', height: expanded ? '80%' : 'auto' }}
        openRenameGraphModal={this.props.openRenameGraphModal}
        graphType={this.props.graphType}
        canSaveGraph={this.props.canSaveGraph}
        showTitle
      />
    ) : (
      <SummaryGraphTable
        graphData={this.props.graphData}
        openRenameGraphModal={this.props.openRenameGraphModal}
        canSaveGraph={this.props.canSaveGraph}
        showTitle
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

export const SummaryTranslated = withNamespaces()(Summary);
export default Summary;
