// @flow
import { Component } from 'react';
import { LegacyModal as Modal } from '@kitman/components';
import type {
  ValueVisualisationData,
  GraphType,
} from '@kitman/modules/src/analysis/shared/types';
import { ValueVisualisationGraphTranslated as ValueVisualisationGraph } from '@kitman/modules/src/analysis/shared/components/GraphWidget/ValueVisualisationGraph';
import { ValueVisualisationTableTranslated as ValueVisualisationTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/ValueVisualisationTable';

type Props = {
  graphData: ValueVisualisationData,
  graphType: GraphType,
  openRenameGraphModal: Function,
  isGraphExpanded: boolean,
  closeGraphModal: Function,
  canSaveGraph?: boolean,
};

class ValueVisualisation extends Component<Props> {
  getGraph() {
    return this.props.graphType === 'value' ? (
      <ValueVisualisationGraph
        graphData={this.props.graphData}
        openRenameGraphModal={this.props.openRenameGraphModal}
        canSaveGraph={this.props.canSaveGraph}
        showTitle
      />
    ) : (
      <ValueVisualisationTable
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
          {this.getGraph()}
        </Modal>
      </>
    );
  }
}

export default ValueVisualisation;
