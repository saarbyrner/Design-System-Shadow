// @flow
/* eslint-disable react/sort-comp, max-statements */
import { createRef, Component } from 'react';
import $ from 'jquery';
import classNames from 'classnames';
import _isEqual from 'lodash/isEqual';
import { AppStatus, ErrorBoundary, TooltipMenu } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import type { ModalStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getGraphTitles,
  formatGraphTitlesToString,
  isDrillGraph,
} from '@kitman/modules/src/analysis/shared/utils';
import { RenameModalTranslated as RenameModal } from '@kitman/modules/src/analysis/shared/components/GraphWidget/RenameModal';
import SummaryDonutDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryDonutDefaultSortConfig';
import SummaryStackBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryStackBarDefaultSortConfig';
import SummaryBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryBarDefaultSortConfig';
import type {
  SummaryGraphData,
  LongitudinalGraphData,
  SummaryBarGraphData,
  SummaryStackBarGraphData,
  SummaryDonutGraphData,
} from '@kitman/modules/src/analysis/shared/types';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import Graph from '../Graph';
import { getPlaceholderImgPath } from '../utils';
import WidgetCard from '../WidgetCard';
import style from './style';

type Props = {
  containerType: string,
  graphData:
    | SummaryGraphData
    | LongitudinalGraphData
    | SummaryBarGraphData
    | SummaryStackBarGraphData
    | SummaryDonutGraphData,
  dashboardId: string,
  onClickOpenGraphLinksModal: Function,
  onDeleteGraph: Function,
  onDuplicate: Function,
  onSortGraph: Function,
  reloadGraph: Function,
  canManageDashboard: boolean,
  onUpdateAggregationPeriod: Function,
};

type State = {
  feedbackModalStatus: ?ModalStatus,
  feedbackModalMessage: ?string,
  secondaryButtonAction: Function,
  isRenameModalOpen: boolean,
  renameFeedbackModalStatus: ModalStatus,
  renameFeedbackModalMessage: ?string,
  graphTitle: ?string,
  condensed: boolean,
};

const isDashboardUIUpgradeFF = window.getFlag('rep-dashboard-ui-upgrade');

class GraphWidget extends Component<I18nProps<Props>, State> {
  sortButton: ?HTMLElement;

  menuButton: ?HTMLElement;

  widgetRef: Object;

  constructor(props: I18nProps<Props>) {
    super(props);
    this.widgetRef = createRef();

    this.state = {
      feedbackModalStatus: null,
      feedbackModalMessage: null,
      secondaryButtonAction: this.hideFeedbackModal,
      isRenameModalOpen: false,
      graphTitle: this.props.graphData.name,
      renameFeedbackModalStatus: null,
      renameFeedbackModalMessage: null,
      condensed: false,
    };

    this.hideFeedbackModal = this.hideFeedbackModal.bind(this);
    this.getSortTooltip = this.getSortTooltip.bind(this);
    this.getWidgetTootlip = this.getWidgetTootlip.bind(this);
    this.getGraphImage = this.getGraphImage.bind(this);
    this.onRenameValueChange = this.onRenameValueChange.bind(this);
    this.renameGraph = this.renameGraph.bind(this);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!this.widgetRef.current) {
      return;
    }

    const widgetWidth = this.widgetRef.current.offsetWidth;
    const widgetHeight = this.widgetRef.current.offsetHeight;

    const shouldWidgetBeCondensed = widgetWidth < 650 || widgetHeight < 430;

    if (shouldWidgetBeCondensed !== prevState.condensed) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ condensed: shouldWidgetBeCondensed });
    }
  }

  confirmDeleteGraph() {
    // close the menu
    if (this.menuButton) {
      this.menuButton.click();
    }

    const graphName =
      this.props.graphData.name ||
      formatGraphTitlesToString(getGraphTitles(this.props.graphData));

    this.setState({
      feedbackModalStatus: 'confirm',
      feedbackModalMessage: this.props.t(
        'Are you sure you want to delete the graph "{{- graphTitle}}"?',
        { graphTitle: graphName }
      ),
      secondaryButtonAction: this.hideFeedbackModal,
    });
  }

  showRequestError() {
    this.setState({
      feedbackModalStatus: 'error',
      feedbackModalMessage: null,
    });
  }

  hideFeedbackModal = () => {
    this.setState({
      feedbackModalStatus: null,
      feedbackModalMessage: null,
    });
  };

  getGraphUrl(hash: 'edit' | 'graphView') {
    if (this.props.containerType === 'HomeDashboard') {
      // $FlowFixMe graphData.id must exist in this case. It is optional only on the graph builder.
      return `/analysis/graph/builder?deeplink=home_dashboard&graph_id=${this.props.graphData.id}#${hash}`;
    }
    // $FlowFixMe graphData.id must exist in this case. It is optional only on the graph builder.
    return `/analysis/graph/builder?deeplink=analytical_dashboard&analytical_dashboard_id=${this.props.dashboardId}&graph_id=${this.props.graphData.id}#${hash}`;
  }

  getSortTooltip = () => {
    let selectedSortingOption = null;
    if (this.props.graphData.sorting !== undefined) {
      // Sortable graphs should have a default graphData.sorting
      selectedSortingOption = this.props.graphData.sorting;
    }

    const sortMenuItems: Array<TooltipItem> = [];
    if (
      (this.props.graphData.graphType === 'donut' ||
        this.props.graphData.graphType === 'pie') &&
      this.props.graphData.graphGroup === 'summary_donut'
    ) {
      // simple High Low

      const highLowSort = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
      };

      sortMenuItems.push({
        description: this.props.t('High - Low'),
        icon: _isEqual(selectedSortingOption, highLowSort)
          ? 'icon-check'
          : 'blank',
        onClick: () => {
          this.props.onSortGraph(highLowSort);
        },
      });

      // simple Low High

      const lowHighSort = {
        enabled: true,
        order: 'asc',
        metricIndex: 0,
      };

      sortMenuItems.push({
        description: this.props.t('Low - High'),
        icon: _isEqual(selectedSortingOption, lowHighSort)
          ? 'icon-check'
          : 'blank',
        onClick: () => {
          this.props.onSortGraph(lowHighSort);
        },
      });

      // Add default
      sortMenuItems.push({
        description: this.props.t('A - Z'),
        icon: _isEqual(selectedSortingOption, SummaryDonutDefaultSortConfig)
          ? 'icon-check'
          : 'blank',
        onClick: () => {
          this.props.onSortGraph(SummaryDonutDefaultSortConfig);
        },
      });
    } else if (
      (this.props.graphData.graphType === 'bar' ||
        this.props.graphData.graphType === 'column') &&
      (this.props.graphData.graphGroup === 'summary_bar' ||
        this.props.graphData.graphGroup === 'summary_column' ||
        this.props.graphData.graphGroup === 'summary_stack_bar' ||
        this.props.graphData.graphGroup === 'summary_stack_column')
    ) {
      if (this.props.graphData.metrics?.length > 0) {
        const isStackedGraph =
          this.props.graphData.graphGroup === 'summary_stack_bar' ||
          this.props.graphData.graphGroup === 'summary_stack_column';

        const defaultSort = isStackedGraph
          ? SummaryStackBarDefaultSortConfig
          : SummaryBarDefaultSortConfig;

        const isSortingByDefault = _isEqual(selectedSortingOption, defaultSort);

        this.props.graphData.metrics.forEach((metric, metricIndex) => {
          const highLowSort = {
            enabled: true,
            order: 'desc',
            metricIndex,
            sortKey: 'mainCategoryTotal',
            secondaryOrder: 'asc',
            secondarySortKey: 'mainCategoryName',
          };

          const lowHighSort = {
            enabled: true,
            order: 'asc',
            metricIndex,
            sortKey: 'mainCategoryTotal',
            secondaryOrder: 'asc',
            secondarySortKey: 'mainCategoryName',
          };

          const isSortingByHighLow = _isEqual(
            selectedSortingOption,
            highLowSort
          );
          const highLowMenuOption = {
            description: this.props.t('High - Low'),
            icon: isSortingByHighLow ? 'icon-check' : 'blank',
            isSelected: isSortingByHighLow,
            onClick: () => {
              this.props.onSortGraph(highLowSort);
            },
          };

          const isSortingByLowHigh = _isEqual(
            selectedSortingOption,
            lowHighSort
          );
          const lowHighMenuOption = {
            description: this.props.t('Low - High'),
            icon: isSortingByLowHigh ? 'icon-check' : 'blank',
            isSelected: isSortingByLowHigh,
            onClick: () => {
              this.props.onSortGraph(lowHighSort);
            },
          };

          // Checking here if multi metric and so need subMenu items
          if (this.props.graphData.metrics?.length > 1) {
            metric.series.forEach((item) => {
              sortMenuItems.push({
                icon: 'blank',
                isSelected:
                  !isSortingByDefault &&
                  selectedSortingOption !== null &&
                  // $FlowFixMe selectedSortingOption will have a metricIndex.
                  selectedSortingOption.metricIndex === metricIndex,
                description: item.name,
                subMenuItems: [highLowMenuOption, lowHighMenuOption],
                subMenuAlignment: 'left',
              });
            });
          } else {
            sortMenuItems.push(highLowMenuOption, lowHighMenuOption);
          }
        });

        const defaultAZ = {
          description: this.props.t('A - Z'),
          icon: isSortingByDefault ? 'icon-check' : 'blank',
          isSelected: isSortingByDefault,
          onClick: () => {
            this.props.onSortGraph(defaultSort);
          },
        };

        sortMenuItems.push(defaultAZ);
      }
    }

    return (
      <TooltipMenu
        placement="bottom-end"
        offset={[10, 10]}
        customClassnames={['tooltipMenu--graphSort']}
        externalItem={
          <span className="tooltipMenu--graphSort__title">
            {this.props.t('Sort by')}
          </span>
        }
        externalItemOrder={0}
        menuItems={sortMenuItems}
        onVisibleChange={(isVisible) => {
          if (isVisible) {
            TrackEvent('Graph Dashboard', 'Click', 'Open Sorting Menu');
          } else {
            TrackEvent('Graph Dashboard', 'Click', 'Close Sorting Menu');
          }
        }}
        tooltipTriggerElement={
          <button
            type="button"
            className="graphWidget__sortButton"
            ref={(sortButton) => {
              this.sortButton = sortButton;
            }}
          >
            <i className="icon-reorder" />
          </button>
        }
        kitmanDesignSystem
      />
    );
  };

  isGraphSortable() {
    if (
      (this.props.graphData.graphType === 'donut' ||
        this.props.graphData.graphType === 'pie') &&
      this.props.graphData.graphGroup === 'summary_donut' &&
      this.props.graphData.metrics?.length === 1
    ) {
      return true;
    }

    if (
      (this.props.graphData.graphType === 'bar' ||
        this.props.graphData.graphType === 'column') &&
      (this.props.graphData.graphGroup === 'summary_stack_bar' ||
        this.props.graphData.graphGroup === 'summary_stack_column') &&
      this.props.graphData.metrics?.length === 1
    ) {
      return true;
    }

    // Can sort summary_bar & summary_column with mutiple metrics
    if (
      (this.props.graphData.graphType === 'bar' ||
        this.props.graphData.graphType === 'column') &&
      (this.props.graphData.graphGroup === 'summary_bar' ||
        this.props.graphData.graphGroup === 'summary_column') &&
      this.props.graphData.metrics?.length > 0
    ) {
      return true;
    }

    return false;
  }

  getWidgetTootlip = () => {
    const isDisabled =
      this.props.graphData.isLoading || this.props.graphData.forbidden;

    const isGraphDataLoaded =
      !this.props.graphData.error &&
      !this.props.graphData.forbidden &&
      !this.props.graphData.isLoading;

    const editGraph = {
      description: this.props.t('Edit Graph'),
      href: this.getGraphUrl('graphView'),
      icon: 'icon-edit-graph',
      onClick: TrackEvent('Graph Dashboard', 'Click', 'Edit Graph'),
    };
    const renameGraph = {
      description: this.props.t('Rename Graph'),
      icon: 'icon-edit-name',
      onClick: () => this.renderRenameGraphModal(),
    };
    const linkGraph = {
      description: this.props.t('Link Graph to Dashboard'),
      icon: 'icon-link',
      onClick: () => {
        TrackEvent('Graph Dashboard', 'Click', 'Link Graph to dashboard');
        this.props.onClickOpenGraphLinksModal();
      },
      isDisabled: isGraphDataLoaded && isDrillGraph(this.props.graphData),
    };
    const duplicateWidget = {
      description: this.props.t('Duplicate Widget'),
      icon: 'icon-duplicate',
      onClick: () => {
        TrackEvent('Graph Dashboard', 'Click', 'Duplicate Graph Widget');
        this.props.onDuplicate('Graph');
      },
    };
    const deleteGraph = {
      description: this.props.t('Delete'),
      icon: 'icon-bin',
      onClick: () => {
        this.confirmDeleteGraph();
        TrackEvent('Graph Dashboard', 'Click', 'Delete Graph');
      },
    };

    let menuItems = [];

    if (this.props.graphData.error) {
      menuItems = [deleteGraph];
    } else {
      menuItems = [editGraph, renameGraph, linkGraph, deleteGraph];

      if (this.props.containerType === 'AnalyticalDashboard') {
        menuItems.push(duplicateWidget);
      }
    }

    return (
      <TooltipMenu
        placement="bottom-end"
        disable={isDisabled}
        offset={[10, 10]}
        menuItems={menuItems}
        onVisibleChange={(isVisible) => {
          if (isVisible) {
            TrackEvent('Graph Dashboard', 'Click', 'Open Meatball Menu');
          } else {
            TrackEvent('Graph Dashboard', 'Click', 'Close Meatball Menu');
          }
        }}
        tooltipTriggerElement={
          <button
            type="button"
            className={`graphWidget__menuButton ${
              isDisabled ? 'graphWidget__menuButton--disabled' : ''
            }`}
            ref={(menuButton) => {
              this.menuButton = menuButton;
            }}
            {...(isDashboardUIUpgradeFF ? { css: style.widgetMenu } : {})}
          >
            <WidgetCard.MenuIcon />
          </button>
        }
        kitmanDesignSystem
      />
    );
  };

  getGraphImage = () => {
    return (
      <div className="graphWidgetGraphImage">
        <img
          src={getPlaceholderImgPath(
            'graph',
            this.props.graphData.graphType,
            this.props.graphData.graphGroup
          )}
          alt="graph placeholder"
        />
      </div>
    );
  };

  getGraphForbiddenMessage() {
    return (
      <p className="graphWidget__noPermissionText">
        {this.props.t("You don't have permissions to see this graph")}
        <br />
        {this.props.t('Please contact your administrator to access this data.')}
      </p>
    );
  }

  onRenameValueChange = (value: string) => {
    this.setState({ graphTitle: value });
  };

  renderRenameGraphModal() {
    this.setState({
      isRenameModalOpen: true,
    });
  }

  closeRenameModal() {
    this.setState({
      isRenameModalOpen: false,
      graphTitle:
        this.props.graphData.name ||
        formatGraphTitlesToString(getGraphTitles(this.props.graphData)),
    });
  }

  renameGraph = (graphTitle: string) => {
    this.setState({
      renameFeedbackModalStatus: 'loading',
      renameFeedbackModalMessage: null,
    });

    $.ajax({
      method: 'PATCH',
      // $FlowFixMe graphData.id must exist in this case. It is optional only on the graph builder.
      url: `/analysis/graph/${this.props.graphData.id}`,
      data: JSON.stringify({ name: graphTitle }),
      contentType: 'application/json',
    })
      .done(() => {
        this.setState({
          renameFeedbackModalStatus: 'success',
          renameFeedbackModalMessage: this.props.t('Success'),
          isRenameModalOpen: false,
        });
        setTimeout(() => {
          this.setState({
            renameFeedbackModalStatus: null,
            renameFeedbackModalMessage: null,
          });
        }, 1500);
        this.props.reloadGraph();
      })
      .fail(() => {
        this.setState({
          renameFeedbackModalStatus: 'error',
          renameFeedbackModalMessage: null,
          isRenameModalOpen: false,
        });
      });
  };

  render() {
    const isGraphLoading = this.props.graphData.isLoading;
    const didGraphFailLoading = this.props.graphData.error;
    const isGraphViewForbidden = this.props.graphData.forbidden;
    const graphWidgetClass = classNames('graphWidget', {
      'graphWidget--loading': isGraphLoading,
      'graphWidget--error': didGraphFailLoading,
      'graphWidget--condensed': this.state.condensed,
    });
    let graphName = '';
    if (!isGraphLoading && !didGraphFailLoading && !isGraphViewForbidden) {
      graphName =
        this.props.graphData.name ||
        formatGraphTitlesToString(getGraphTitles(this.props.graphData));
    }

    const showSortTooltip =
      window.getFlag('graph-sorting') && this.isGraphSortable();

    return (
      <ErrorBoundary>
        <WidgetCard className={graphWidgetClass} innerRef={this.widgetRef}>
          <WidgetCard.Header className="graphWidget__header">
            {isDashboardUIUpgradeFF ? (
              <WidgetCard.Title>
                <h3 title={graphName}>
                  <span>{graphName}</span>
                </h3>
              </WidgetCard.Title>
            ) : (
              <h3 title={graphName}>
                <span>{graphName}</span>
              </h3>
            )}
            <div className="graphWidget__tooltips">
              {showSortTooltip && this.getSortTooltip()}
              {this.props.canManageDashboard ? this.getWidgetTootlip() : null}
            </div>
          </WidgetCard.Header>
          <div className="graphWidget__graph">
            {isGraphLoading || didGraphFailLoading || isGraphViewForbidden ? (
              this.getGraphImage()
            ) : (
              <Graph
                graphData={this.props.graphData}
                condensed={this.state.condensed}
                onUpdateAggregationPeriod={(aggregationPeriod) =>
                  this.props.onUpdateAggregationPeriod(
                    this.props.graphData.id,
                    aggregationPeriod
                  )
                }
              />
            )}
          </div>

          {isGraphViewForbidden ? this.getGraphForbiddenMessage() : null}
          <RenameModal
            isRenameModalOpen={this.state.isRenameModalOpen}
            closeRenameModal={() => this.closeRenameModal()}
            value={
              this.state.graphTitle !== null
                ? this.state.graphTitle
                : formatGraphTitlesToString(
                    getGraphTitles(this.props.graphData)
                  )
            }
            onChange={this.onRenameValueChange}
            onConfirm={this.renameGraph}
            feedbackModalStatus={this.state.renameFeedbackModalStatus}
            feedbackModalMessage={this.state.renameFeedbackModalMessage}
            hideFeedbackModal={() => {
              this.setState({
                renameFeedbackModalStatus: null,
                renameFeedbackModalMessage: null,
              });
            }}
          />

          <AppStatus
            status={this.state.feedbackModalStatus}
            message={this.state.feedbackModalMessage}
            confirmButtonText={this.props.t('Delete')}
            hideConfirmation={this.hideFeedbackModal}
            close={this.state.secondaryButtonAction}
            confirmAction={() => {
              this.props.onDeleteGraph();
              this.hideFeedbackModal();
            }}
          />

          {didGraphFailLoading && (
            <div className="graphWidget__graphErrorMessage">
              <AppStatus
                status="error"
                message={
                  this.props.graphData.errorMessage ||
                  this.props.t('Something went wrong!')
                }
                hideButtonText={this.props.t('Reload graph')}
                hideConfirmation={this.hideFeedbackModal}
                close={this.props.reloadGraph}
                isEmbed
              />
            </div>
          )}
        </WidgetCard>
      </ErrorBoundary>
    );
  }
}

export default GraphWidget;
export const GraphWidgetTranslated = withNamespaces()(GraphWidget);
