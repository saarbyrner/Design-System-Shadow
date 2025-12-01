// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal } from '@kitman/components';
import type {
  LongitudinalGraphData,
  GraphType,
} from '@kitman/modules/src/analysis/shared/types';
import { LongitudinalGraphTableTranslated as LongitudinalGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/LongitudinalGraphTable';
import LongitudinalGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/LongitudinalGraph';

type Props = {
  graphType: GraphType,
  graphData: LongitudinalGraphData,
  updateAggregationPeriod: Function,
  openRenameGraphModal: Function,
  isGraphExpanded: boolean,
  closeGraphModal: Function,
  canSaveGraph?: boolean,
};

class Longitudinal extends Component<Props> {
  getGraph() {
    return (
      <div>
        {this.props.graphType !== 'table' ? (
          <LongitudinalGraph
            key={this.props.graphType}
            graphData={this.props.graphData}
            graphType={this.props.graphType}
            updateAggregationPeriod={(aggregationPeriod) => {
              this.props.updateAggregationPeriod(aggregationPeriod);
            }}
            openRenameGraphModal={this.props.openRenameGraphModal}
            graphStyle={{
              // It must be a padding and not a margin otherwise
              // the injury decorators icons are outside the graph container
              paddingTop: '40px',
            }}
            canSaveGraph={this.props.canSaveGraph}
            showTitle
          />
        ) : (
          <LongitudinalGraphTable
            graphData={this.props.graphData}
            showTitle
            openRenameGraphModal={this.props.openRenameGraphModal}
            canSaveGraph={this.props.canSaveGraph}
          />
        )}
      </div>
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

export const LongitudinalTranslated = withNamespaces()(Longitudinal);
export default Longitudinal;
