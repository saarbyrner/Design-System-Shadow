/* eslint-disable react/sort-comp */
// @flow
import { Component } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import type { SquadAthletes } from '@kitman/components/src/types';
import { TrackEvent } from '@kitman/common/src/utils';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import { withNamespaces } from 'react-i18next';
import { AppStatus, PageHeader, PrintHeader } from '@kitman/components';
import { isSelectionEmpty } from '@kitman/components/src/AthleteSelector/utils';
import type { ModalStatus } from '@kitman/common/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { buildPivotUrlParams } from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import colors from '@kitman/common/src/variables/colors';
import {
  getGraphTitles,
  formatGraphTitlesToString,
} from '@kitman/modules/src/analysis/shared/utils';
import type {
  Dashboard,
  WidgetLayout,
} from '@kitman/modules/src/analysis/shared/types';
import _orderBy from 'lodash/orderBy';
import type { ChartWidgetData } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { emptySquadAthletes } from './utils';
import GraphLinksModal from '../containers/GraphLinksModal';
import AddWidgetDropdown from '../containers/AddWidgetDropdown';
import ProfileWidget from './ProfileWidget';
import HeaderWidget from '../containers/HeaderWidget';
import HeaderWidgetModal from '../containers/HeaderWidgetModal';
import TableWidget from '../containers/TableWidget';
import NotesWidget from '../containers/NotesWidget';
import AnnotationModal from '../containers/AnnotationModal';
import NotesWidgetSettingsModal from '../containers/NotesWidgetSettingsModal';
import ProfileWidgetModal from '../containers/ProfileWidgetModal';
import TableWidgetModal from '../containers/TableWidget/Modal';
import ActionsWidgetModal from '../containers/ActionsWidgetModal';
import ActionsWidget from '../containers/ActionsWidget';
import DuplicateDashboardModal from '../containers/DuplicateDashboardModal';
import DuplicateWidgetModal from '../containers/DuplicateWidgetModal';
import PrintBuilder from '../containers/PrintBuilder';
import { GraphWidgetTranslated as GraphWidget } from './GraphWidget';
import { EmptyDashboardTranslated as EmptyDashboard } from './EmptyDashboard';
import { DashboardHeaderTranslated as DashboardHeader } from './DashboardHeader';
import { PivotSlidingPanelTranslated as PivotSlidingPanel } from './PivotSlidingPanel';
import TableFormattingPanel from '../containers/TableWidget/FormattingPanel';
import TableRowPanel from '../containers/TableWidget/RowPanel';
import TableColumnPanel from '../containers/TableWidget/ColumnPanel';
import TableColumnFormulaPanel from '../containers/TableWidget/ColumnFormulaPanel';
import NoteDetailModal from '../containers/NoteDetailModal';
import { ReorderModalTranslated as ReorderModal } from './ReorderModal';
import Toast from '../containers/Toast';
import DevelopmentGoalForm from '../containers/DevelopmentGoalForm';
import DevelopmentGoalWidget from '../containers/DevelopmentGoalWidget';
import type {
  ContainerType,
  WidgetData,
  HeaderWidgetData,
  User,
} from '../types';
import WidgetDataFetch from '../containers/WidgetDataFetch';
import { AddNewChartModal } from './ChartBuilder';
import { ChartWidgetTranslated as ChartWidget } from './ChartWidget';

type Props = {
  locale: string,
  containerType: ContainerType,
  annotationTypes: Array<Object>,
  appliedDateRange: Object,
  appliedSquadAthletes: Object,
  appliedTimePeriod: string,
  appliedTimePeriodLength: ?number,
  appStatusText: ?string,
  athletes: Array<Object>,
  canManageDashboard: boolean,
  canViewNotes: boolean,
  canViewMetrics: boolean,
  hasDevelopmentGoalsModule: boolean,
  dashboard: Dashboard,
  dashboardLayout: Array<WidgetLayout>,
  dashboardList: Array<Dashboard>,
  fetchAllWidgets: Function,
  fetchSingleWidget: Function,
  getAreCoachingPrinciplesEnabled: Function,
  isGraphBuilder: boolean,
  isPrinting: boolean,
  isReorderModalOpen: boolean,
  isSlidingPanelOpen: boolean,
  canSeeHiddenVariables: boolean,
  onClickAddActionsWidget: Function,
  onClickOpenDuplicateDashboardModal: Function,
  onClickOpenDuplicateWidgetModal: Function,
  onClickOpenGraphLinksModal: Function,
  onClickOpenHeaderWidgetModal: Function,
  onClickOpenNotesWidgetSettingsModal: Function,
  onClickAddDevelopmentGoalWidget: Function,
  onClickOpenPrintBuilder: Function,
  onClickOpenProfileWidgetModal: Function,
  onClickOpenReorderModal: Function,
  onClickOpenTableWidgetModal: Function,
  onCloseReorderModal: Function,
  onDeleteWidget: Function,
  onSortGraphWidget: Function,
  onUpdateAggregationPeriod: Function,
  onUpdateDashboard: Function,
  orgLogoPath: string,
  orgName: string,
  squadName: string,
  status: ModalStatus,
  toggleSlidingPanel: Function,
  turnaroundList: Array<Turnaround>,
  updateDashboardLayout: Function,
  currentUser: User,
  users: Array<{ id: number, name: string }>,
  widgets: Array<WidgetData>,
  isHeaderModalOpen: boolean,
  isProfileModalOpen: boolean,
  activeWidgets?: { [number]: ChartWidgetData },
  onDashboardRefresh?: Function,
};

const style = {
  highlightWidget: {
    border: `2.5px solid ${colors.p01}`,
    borderRadius: '10px',
  },
};

const DashboardGridLayout = WidthProvider(GridLayout);

class App extends Component<I18nProps<Props>> {
  constructor(props: I18nProps<Props>) {
    super(props);
    this.redrawGraphs = this.redrawGraphs.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown, false);
    /**
     * On larger dashboards, this can be quite a heavy operation.
     * wrapped it in a timeout so the browser will prioritise other requests
     * that have to do with page setup and other elements (i.e. ui/squads)
     */
    this.props.getAreCoachingPrinciplesEnabled();
    const fetchAllWidgets = this.props.fetchAllWidgets;
    setTimeout(() => {
      fetchAllWidgets();
    });
  }

  componentDidUpdate(prevProps: I18nProps<Props>) {
    if (prevProps.dashboardLayout !== this.props.dashboardLayout) {
      this.redrawGraphs();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown, false);
  }

  onKeydown = (event: any) => {
    if (event.altKey && event.code === 'KeyR') {
      this.props.onClickOpenReorderModal();
    }
  };

  redrawGraphs = () => {
    // high charts will redraw graphs on a window resize event
    window.dispatchEvent(new Event('resize'));
  };

  resetGraphs() {
    window.location.search = '';
  }

  handleOnApply({
    selectedSquadAthletes,
    timePeriod,
    dateRange,
    timePeriodLength,
  }: {
    selectedSquadAthletes: SquadAthletes,
    timePeriod: string,
    dateRange: Object,
    timePeriodLength: ?number,
  }) {
    const isAthleteSelectionEmpty = _isEqual(
      selectedSquadAthletes,
      emptySquadAthletes
    );
    if (isAthleteSelectionEmpty && timePeriod === '' && _isEmpty(dateRange)) {
      this.resetGraphs();
    } else {
      window.location.search = buildPivotUrlParams({
        squadAthletesSelection: selectedSquadAthletes,
        timePeriod,
        dateRange,
        timePeriodLength,
      });
    }
  }

  getCreateGraphUrl() {
    return `/analysis/graph/builder?analytical_dashboard_id=${this.props.dashboard.id}#create`;
  }

  getHeaderWidget(widgetId: number, headerWidgetData: HeaderWidgetData) {
    const widgetName = headerWidgetData.name_from_container
      ? this.props.dashboard.name
      : headerWidgetData.widget_name;
    return (
      <HeaderWidget
        backgroundColor={headerWidgetData.background_color}
        canManageDashboard={this.props.canManageDashboard}
        userName={headerWidgetData.user.fullname}
        name={widgetName}
        onDelete={() => this.props.onDeleteWidget(widgetId)}
        onDuplicate={() => {
          this.props.onClickOpenDuplicateWidgetModal(
            widgetId,
            'header',
            true,
            widgetName
          );
        }}
        onEdit={(
          headerWidgetId,
          name,
          population,
          backgroundColor,
          showOrgLogo,
          showOrgName,
          hideOrgDetails
        ) =>
          this.props.onClickOpenHeaderWidgetModal(
            headerWidgetId,
            name,
            population,
            backgroundColor,
            showOrgLogo,
            showOrgName,
            hideOrgDetails
          )
        }
        orgLogo={headerWidgetData.organisation_logo_url}
        orgName={headerWidgetData.organisation_name}
        selectedDateRange={
          this.props.appliedDateRange || headerWidgetData.date_range
        }
        selectedPopulation={
          this.props.appliedSquadAthletes &&
          !_isEqual(
            this.props.appliedSquadAthletes,
            _cloneDeep(emptySquadAthletes)
          )
            ? this.props.appliedSquadAthletes
            : headerWidgetData.population
        }
        selectedTimePeriod={
          this.props.appliedTimePeriod || headerWidgetData.time_period
        }
        showOrgLogo={headerWidgetData.show_organisation_logo}
        showOrgName={headerWidgetData.show_organisation_name}
        hideOrgDetails={headerWidgetData.hide_organisation_details}
        squadName={headerWidgetData.squad_name}
        widgetId={widgetId}
      />
    );
  }

  getProfileWidget(widgetData: WidgetData) {
    return (
      <ProfileWidget
        athleteId={widgetData.widget.athlete_id}
        availabilityStatus={widgetData.widget_render.availability_status}
        canManageDashboard={this.props.canManageDashboard}
        fieldInformation={widgetData.widget_render.field_values}
        imageUrl={widgetData.widget_render.avatar_url}
        onDelete={() => this.props.onDeleteWidget(widgetData.id)}
        onDuplicate={() =>
          this.props.onClickOpenDuplicateWidgetModal(
            widgetData.id,
            widgetData.widget_type,
            false
          )
        }
        onEdit={(
          profileWidgetId,
          athleteId,
          showAvailabilityIndicator,
          showSquadNumber,
          selectedInfoFields,
          backgroundColour
        ) =>
          this.props.onClickOpenProfileWidgetModal(
            profileWidgetId,
            athleteId,
            showAvailabilityIndicator,
            showSquadNumber,
            selectedInfoFields,
            backgroundColour
          )
        }
        selectedInfoFields={widgetData.widget.fields}
        showAvailabilityIndicator={widgetData.widget.avatar_availability}
        showError={
          !isSelectionEmpty(this.props.appliedSquadAthletes) &&
          this.props.appliedSquadAthletes.athletes.length !== 1
        }
        showSquadNumber={widgetData.widget.avatar_squad_number}
        widgetId={widgetData.id}
        backgroundColour={widgetData.widget.background_colour}
      />
    );
  }

  getNotesWidget(widgetData: WidgetData) {
    return (
      <NotesWidget
        annotations={widgetData.widget_render.annotations}
        users={this.props.users}
        canManageDashboard={this.props.canManageDashboard}
        hasError={widgetData.widget_render.error}
        isLoading={
          widgetData.widget_render.isLoading ||
          // eslint-disable-next-line no-underscore-dangle
          widgetData.widget_render.__async__
        }
        nextPage={widgetData.widget_render.next_page}
        onDuplicate={() => {
          this.props.onClickOpenDuplicateWidgetModal(
            widgetData.id,
            widgetData.widget_type,
            false,
            widgetData.widget.name
          );
        }}
        onEdit={(
          notesWidgetSettingsId,
          notesWidgetSettingsName,
          selectedAnnotationTypes,
          selectedPopulation,
          selectedTimeScope
        ) => {
          this.props.onClickOpenNotesWidgetSettingsModal(
            notesWidgetSettingsId,
            notesWidgetSettingsName,
            selectedAnnotationTypes,
            selectedPopulation,
            selectedTimeScope
          );
        }}
        onRemove={() => this.props.onDeleteWidget(widgetData.id)}
        selectedAnnotationTypes={widgetData.widget.widget_annotation_types}
        selectedPopulation={widgetData.widget.population}
        selectedTimeScope={widgetData.widget.time_scope}
        selectedTimeRange={widgetData.widget_render.time_range}
        totalNotes={widgetData.widget_render.total_count}
        widgetId={widgetData.id}
        widgetName={widgetData.widget.name}
        annotationTypes={this.props.annotationTypes}
      />
    );
  }

  getGraphWidget(graphWidgetData: WidgetData) {
    const graphName =
      graphWidgetData.widget_render.name ||
      graphWidgetData.widget.name ||
      formatGraphTitlesToString(getGraphTitles(graphWidgetData.widget_render));

    const graphData = {
      ...graphWidgetData.widget_render,
      graphGroup: graphWidgetData.widget.configuration.graph_group,
      graphType: graphWidgetData.widget.configuration.graph_type,
      id: graphWidgetData.widget.analytical_dashboard_graph_id,
      isLoading:
        graphWidgetData.widget_render.isLoading ||
        // eslint-disable-next-line no-underscore-dangle
        graphWidgetData.widget_render.__async__,
      name: graphName,
      sorting: graphWidgetData.widget.configuration.sorting,
    };

    return (
      <GraphWidget
        containerType={this.props.containerType}
        graphData={graphData}
        dashboardId={this.props.dashboard.id}
        reloadGraph={() =>
          this.props.fetchSingleWidget(
            graphWidgetData.id,
            graphWidgetData.widget_type
          )
        }
        onClickOpenGraphLinksModal={() => {
          this.props.onClickOpenGraphLinksModal(graphData);
        }}
        onDeleteGraph={() => this.props.onDeleteWidget(graphWidgetData.id)}
        onDuplicate={() => {
          this.props.onClickOpenDuplicateWidgetModal(
            graphWidgetData.id,
            graphWidgetData.widget_type,
            true,
            graphName
          );
        }}
        onSortGraph={(sortingOptions) =>
          this.props.onSortGraphWidget(graphWidgetData.id, sortingOptions)
        }
        onUpdateAggregationPeriod={(graphId, aggregationPeriod) =>
          this.props.onUpdateAggregationPeriod(graphId, aggregationPeriod)
        }
        canManageDashboard={this.props.canManageDashboard}
      />
    );
  }

  getTableWidget(widgetData: WidgetData) {
    const widget = widgetData.widget;
    const widgetId = widgetData.id;
    const widgetName = widgetData.widget_render.name;
    const showSummary = widget.table_container.config?.show_summary || false;
    const tableType = widget.table_container.config?.table_type || 'COMPARISON';

    return (
      <TableWidget
        locale={this.props.locale}
        onDelete={() => this.props.onDeleteWidget(widgetId)}
        onDuplicate={() =>
          this.props.onClickOpenDuplicateWidgetModal(
            widgetId,
            widgetData.widget_type,
            true,
            widgetName
          )
        }
        pivotedDateRange={this.props.appliedDateRange}
        pivotedPopulation={this.props.appliedSquadAthletes}
        pivotedTimePeriod={this.props.appliedTimePeriod}
        pivotedTimePeriodLength={this.props.appliedTimePeriodLength}
        showSummary={showSummary}
        tableContainerId={widgetData.widget.table_container.id}
        tableName={widgetName}
        tableType={tableType}
        widgetId={widgetId}
        canManageDashboard={this.props.canManageDashboard}
      />
    );
  }

  getActionsWidget(widgetData: WidgetData) {
    return (
      <ActionsWidget
        widgetId={widgetData.id}
        widgetSettings={widgetData.widget}
        actions={widgetData.widget_render.actions}
        isLoading={
          widgetData.widget_render.isLoading ||
          // eslint-disable-next-line no-underscore-dangle
          widgetData.widget_render.__async__
        }
        nextId={widgetData.widget_render.next_id}
        annotationTypes={this.props.annotationTypes}
        currentUser={this.props.currentUser}
        onClickRemoveWidget={() => this.props.onDeleteWidget(widgetData.id)}
        onClickDuplicateWidget={() => {
          this.props.onClickOpenDuplicateWidgetModal(
            widgetData.id,
            widgetData.widget_type,
            false
          );
        }}
      />
    );
  }

  getDevelopmentGoalWidget(widgetData: WidgetData) {
    return (
      <DevelopmentGoalWidget
        developmentGoals={widgetData.widget_render.development_goals || []}
        nextId={widgetData.widget_render.next_id}
        widgetId={widgetData.id}
        hasError={widgetData.widget_render.error}
        isLoadingWidgetContent={
          widgetData.widget_render.isLoading ||
          // eslint-disable-next-line no-underscore-dangle
          widgetData.widget_render.__async__
        }
        totalCount={widgetData.widget_render.total_count}
      />
    );
  }

  getWidgets(widgetData: WidgetData) {
    const pivotData = {
      pivotedDateRange: this.props.appliedDateRange,
      pivotedPopulation: this.props.appliedSquadAthletes,
      pivotedTimePeriod: this.props.appliedTimePeriod,
      pivotedTimePeriodLength: this.props.appliedTimePeriodLength,
    };

    let widget;
    if (widgetData.widget_type === 'header') {
      widget = (
        <div className="analyticalDashboard__widget">
          {this.getHeaderWidget(widgetData.id, widgetData.widget_render)}
        </div>
      );
    } else if (widgetData.widget_type === 'graph') {
      widget = (
        <div className="analyticalDashboard__widget">
          {this.getGraphWidget(widgetData)}
        </div>
      );
    } else if (
      widgetData.widget_type === 'annotation' &&
      window.getFlag('evaluation-note')
    ) {
      widget = (
        <div className="analyticalDashboard__widget">
          {this.getNotesWidget(widgetData)}
        </div>
      );
    } else if (widgetData.widget_type === 'athlete_profile') {
      widget = (
        <div className="analyticalDashboard__widget">
          {this.getProfileWidget(widgetData)}
        </div>
      );
    } else if (widgetData.widget_type === 'table') {
      widget = (
        <div className="analyticalDashboard__widget">
          {this.getTableWidget(widgetData)}
        </div>
      );
    } else if (widgetData.widget_type === 'action') {
      widget = (
        <div className="analyticalDashboard__widget">
          {this.getActionsWidget(widgetData)}
        </div>
      );
    } else if (widgetData.widget_type === 'development_goal') {
      widget = (
        <div className="analyticalDashboard__widget">
          {this.getDevelopmentGoalWidget(widgetData)}
        </div>
      );
    } else if (widgetData.widget_type === 'chart') {
      const isWidgetInEditMode = !!this.props.activeWidgets?.[widgetData?.id];
      widget = (
        <div
          className="analyticalDashboard__widget"
          css={isWidgetInEditMode ? style.highlightWidget : ''}
        >
          {/** $FlowIgnore[incompatible-type]
           *
           * This gives the following error:
           *
           * Cannot create `ChartWidget` element because  string [1] is incompatible
           * with  string literal `chart` [2] in property `widgetData.widget_type`.Flow(incompatible-type)
           *
           * It is safe to ignore this in this case as this block is only rendered if `widgetData.widget_type === 'chart'`
           * Flow does not seem to detect this
           */}
          <ChartWidget
            // $FlowIgnore[incompatible-type]
            widgetData={widgetData}
            pivotData={pivotData}
            isDashboardManager={this.props.canManageDashboard}
          />
        </div>
      );
    } else {
      // We need to return an empty div with a random key
      // so that the react-grid-layout library doesn't fail
      // and kill the dashboard. This is only ever seen if
      // a widget is created and then the relevant flag is
      // turned off.
      return (
        <div
          className="analyticalDashboard__blankWidgetDiv"
          key={Math.floor(Math.random() * 100)}
        />
      );
    }

    return (
      <div key={widgetData.id}>
        <WidgetDataFetch widget={widgetData}>{widget}</WidgetDataFetch>
      </div>
    );
  }

  getWelcomeMessage() {
    let greeting = '';
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      greeting = this.props.t('Good morning {{username}}', {
        username: this.props.currentUser.firstname,
        interpolation: { escapeValue: false },
      });
    } else if (currentHour < 17) {
      greeting = this.props.t('Good afternoon {{username}}', {
        username: this.props.currentUser.firstname,
        interpolation: { escapeValue: false },
      });
    } else {
      greeting = this.props.t('Good evening {{username}}', {
        username: this.props.currentUser.firstname,
        interpolation: { escapeValue: false },
      });
    }

    return (
      <div className="analyticalDashboard__welcomeMessage">{greeting}</div>
    );
  }

  getWidgetDashboard() {
    const addWidgetElement = (
      <AddWidgetDropdown
        containerType={this.props.containerType}
        dashboard={this.props.dashboard}
        isGraphBuilder={this.props.isGraphBuilder}
        onClickAddActionsWidget={this.props.onClickAddActionsWidget}
        onClickOpenHeaderWidgetModal={this.props.onClickOpenHeaderWidgetModal}
        onClickOpenProfileWidgetModal={this.props.onClickOpenProfileWidgetModal}
        onClickOpenNotesWidgetSettingsModal={
          this.props.onClickOpenNotesWidgetSettingsModal
        }
        onClickOpenTableWidgetModal={this.props.onClickOpenTableWidgetModal}
        onClickAddDevelopmentGoalWidget={
          this.props.onClickAddDevelopmentGoalWidget
        }
        pivotedAthletes={this.props.appliedSquadAthletes}
        pivotedDateRange={this.props.appliedDateRange}
        pivotedTimePeriod={this.props.appliedTimePeriod}
        pivotedTimePeriodLength={this.props.appliedTimePeriodLength}
        canViewNotes={this.props.canViewNotes}
        hasDevelopmentGoalsModule={this.props.hasDevelopmentGoalsModule}
        annotationTypes={this.props.annotationTypes}
      />
    );
    // ordering widgets by their position in the dashboard.
    const orderedWidgets = _orderBy(
      this.props.widgets,
      ['vertical_position', 'horizontal_position'],
      ['asc', 'asc']
    );

    return (
      <>
        <DashboardGridLayout
          className="layout analyticalDashboard__gridContainer"
          isDraggable={false}
          isResizable={false}
          // This is important as the appStatus would be
          // confined to widget's boundaries if we would be using CSS Transform
          useCSSTransforms={false}
          layout={this.props.dashboardLayout}
          autoSize
          margin={[10, 10]}
          containerPadding={[0, 0]}
          rowHeight={100}
          cols={6}
        >
          {orderedWidgets.map((widgetData) => this.getWidgets(widgetData))}
        </DashboardGridLayout>
        <div className="text-center analyticalDashboard__footer">
          {this.props.canManageDashboard ? addWidgetElement : null}
        </div>
      </>
    );
  }

  render() {
    const dashboardFailedToLoad = this.props.status !== null;
    const isDashboardEmpty = this.props.widgets.length < 1;
    const dashboardContent = (
      <>
        {this.props.containerType === 'HomeDashboard' &&
          this.getWelcomeMessage()}
        {isDashboardEmpty ? (
          <EmptyDashboard
            containerType={this.props.containerType}
            dashboard={this.props.dashboard}
            isDashboardManager={this.props.canManageDashboard}
            isGraphBuilder={this.props.isGraphBuilder}
            createGraphUrl={this.getCreateGraphUrl()}
            onClickAddActionsWidget={this.props.onClickAddActionsWidget}
            onClickOpenHeaderWidgetModal={
              this.props.onClickOpenHeaderWidgetModal
            }
            onClickOpenProfileWidgetModal={
              this.props.onClickOpenProfileWidgetModal
            }
            onClickOpenNotesWidgetSettingsModal={
              this.props.onClickOpenNotesWidgetSettingsModal
            }
            onClickOpenTableWidgetModal={this.props.onClickOpenTableWidgetModal}
            onClickAddDevelopmentGoalWidget={
              this.props.onClickAddDevelopmentGoalWidget
            }
            canViewNotes={this.props.canViewNotes}
            hasDevelopmentGoalsModule={this.props.hasDevelopmentGoalsModule}
            annotationTypes={this.props.annotationTypes}
          />
        ) : (
          this.getWidgetDashboard()
        )}
      </>
    );

    return this.props.isPrinting ? (
      <>
        <PrintBuilder
          annotationTypes={this.props.annotationTypes}
          appliedSquadAthletes={this.props.appliedSquadAthletes}
          currentUser={this.props.currentUser}
          pivotedDateRange={this.props.appliedDateRange}
          pivotedTimePeriod={this.props.appliedTimePeriod}
          pivotedTimePeriodLength={this.props.appliedTimePeriodLength}
        />
        <Toast />
      </>
    ) : (
      <div className="analyticalDashboard">
        <PrintHeader
          logoPath="/img/kitman_logo_full_bleed.png"
          logoAlt="Kitman Logo"
          items={[
            {
              title: this.props.t('Dashboard Name'),
              value: this.props.dashboard.name,
            },
            {
              title: this.props.t('Organisation'),
              value: this.props.orgName,
            },
            {
              title: this.props.t('#sport_specific__Squad'),
              value: this.props.squadName,
            },
            {
              title: this.props.t('Report by'),
              value: this.props.currentUser.fullname,
            },
            {
              title: this.props.t('Report date'),
              value: window.featureFlags['standard-date-formatting']
                ? DateFormatter.formatStandard({ date: moment() })
                : moment().format('D MMM YYYY'),
            },
          ]}
        />
        <PageHeader>
          <DashboardHeader
            locale={this.props.locale}
            containerType={this.props.containerType}
            dashboard={this.props.dashboard}
            dashboardList={this.props.dashboardList}
            isDashboardEmpty={isDashboardEmpty}
            isDashboardManager={this.props.canManageDashboard}
            canViewNotes={this.props.canViewNotes}
            hasDevelopmentGoalsModule={this.props.hasDevelopmentGoalsModule}
            isGraphBuilder={this.props.isGraphBuilder}
            isSlidingPanelOpen={this.props.isSlidingPanelOpen}
            orgLogoPath={this.props.orgLogoPath}
            orgName={this.props.orgName}
            squadName={this.props.squadName}
            canSeeHiddenVariables={this.props.canSeeHiddenVariables}
            onClickAddActionsWidget={this.props.onClickAddActionsWidget}
            onClickAddDevelopmentGoalWidget={
              this.props.onClickAddDevelopmentGoalWidget
            }
            onClickOpenHeaderWidgetModal={
              this.props.onClickOpenHeaderWidgetModal
            }
            onClickOpenNotesWidgetSettingsModal={
              this.props.onClickOpenNotesWidgetSettingsModal
            }
            onClickOpenProfileWidgetModal={
              this.props.onClickOpenProfileWidgetModal
            }
            onClickOpenTableWidgetModal={this.props.onClickOpenTableWidgetModal}
            openDuplicateModal={() =>
              this.props.onClickOpenDuplicateDashboardModal(
                this.props.dashboard.name
              )
            }
            openPrintBuilder={() => this.props.onClickOpenPrintBuilder()}
            openReorderModal={() => this.props.onClickOpenReorderModal()}
            pivotedAthletes={this.props.appliedSquadAthletes}
            pivotedDateRange={this.props.appliedDateRange}
            pivotedTimePeriod={this.props.appliedTimePeriod}
            pivotedTimePeriodLength={this.props.appliedTimePeriodLength}
            toggleSlidingPanel={() => this.props.toggleSlidingPanel()}
            updateDashboard={(updatedDashboard) =>
              this.props.onUpdateDashboard(updatedDashboard)
            }
            annotationTypes={this.props.annotationTypes}
            refreshDashboard={this.props.onDashboardRefresh}
          />
        </PageHeader>
        {dashboardFailedToLoad ? (
          <div className="analyticalDashboard__loader">
            <AppStatus
              status={this.props.status}
              message={this.props.appStatusText}
              isEmbed
            />
          </div>
        ) : (
          dashboardContent
        )}
        {!window.getFlag('hide-pivot-graphing-dashboard') ? (
          <PivotSlidingPanel
            appliedSquadAthletes={this.props.appliedSquadAthletes}
            appliedDateRange={this.props.appliedDateRange}
            appliedTimePeriod={this.props.appliedTimePeriod}
            appliedTimePeriodLength={this.props.appliedTimePeriodLength}
            isOpen={this.props.isSlidingPanelOpen}
            onReset={() => this.resetGraphs()}
            onApply={({
              selectedSquadAthletes,
              timePeriod,
              dateRange,
              timePeriodLength,
            }) =>
              this.handleOnApply({
                selectedSquadAthletes,
                timePeriod,
                dateRange,
                timePeriodLength,
              })
            }
            t={this.props.t}
            togglePanel={() => {
              TrackEvent('Graph Dashboard', 'Click', 'Close Pivot Panel Icon');
              this.props.toggleSlidingPanel();
            }}
            turnaroundList={this.props.turnaroundList}
          />
        ) : null}
        <TableFormattingPanel canViewMetrics={this.props.canViewMetrics} />
        <TableRowPanel turnaroundList={this.props.turnaroundList} />
        <TableColumnPanel turnaroundList={this.props.turnaroundList} />
        {window.getFlag('rep-table-formula-columns') && (
          <TableColumnFormulaPanel />
        )}
        <TableWidgetModal />
        <ActionsWidgetModal annotationTypes={this.props.annotationTypes} />
        <ReorderModal
          containerType={this.props.containerType}
          dashboard={this.props.dashboard}
          layout={this.props.dashboardLayout}
          onApply={(updatedDashboard, newLayout) => {
            this.props.updateDashboardLayout(newLayout);
            this.props.onCloseReorderModal();
            this.props.onUpdateDashboard(updatedDashboard);
          }}
          isOpen={this.props.isReorderModalOpen}
          onCloseModal={() => this.props.onCloseReorderModal()}
          widgets={this.props.widgets}
        />
        <GraphLinksModal />
        {this.props.isHeaderModalOpen && (
          <HeaderWidgetModal
            canManageDashboard={this.props.canManageDashboard}
            userName={this.props.currentUser.fullname}
            dashboardName={this.props.dashboard.name}
            orgLogo={this.props.orgLogoPath}
            orgName={this.props.orgName}
            squadName={this.props.squadName}
          />
        )}
        {this.props.isProfileModalOpen && (
          <ProfileWidgetModal
            canManageDashboard={this.props.canManageDashboard}
          />
        )}
        <AnnotationModal
          annotationTypes={this.props.annotationTypes}
          users={this.props.users}
        />
        <NotesWidgetSettingsModal
          annotationTypes={this.props.annotationTypes}
          canManageDashboard={this.props.canManageDashboard}
          turnaroundList={this.props.turnaroundList}
        />
        <DuplicateWidgetModal
          dashboard={this.props.dashboard}
          dashboardList={this.props.dashboardList}
        />
        <DuplicateDashboardModal />
        <NoteDetailModal currentUser={this.props.currentUser} />
        <DevelopmentGoalForm />
        <Toast />
        <AddNewChartModal />
      </div>
    );
  }
}

export default App;
export const AppTranslated = withNamespaces()(App);
