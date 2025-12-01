// @flow
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import type { Squad } from '@kitman/common/src/types/Squad';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import { isSelectionEmpty } from '@kitman/components/src/AthleteSelector/utils';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import { emptySquadAthletes } from '../utils';
import type { HeaderWidgetData, WidgetData, User } from '../../types';
import HeaderWidget from '../HeaderWidget';
import { GraphWidgetTranslated as GraphWidget } from '../GraphWidget';
import NotesWidget from '../../containers/NotesWidget';
import ProfileWidget from '../ProfileWidget';
import TableWidget from '../../containers/TableWidget';
import ActionsWidget from '../../containers/ActionsWidget';
import DevelopmentGoalWidget from '../../containers/DevelopmentGoalWidget';
import { ChartWidgetTranslated as ChartWidget } from '../ChartWidget';

type Props = {
  annotationTypes: Array<Object>,
  dashboard: Dashboard,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  widgetData: WidgetData,
  currentUser: User,
  appliedSquadAthletes: SquadAthletesSelection,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
};

const WidgetRenderer = (props: Props) => {
  let widget;

  const getHeaderWidget = (
    widgetId: number,
    headerWidgetData: HeaderWidgetData
  ) => {
    const widgetName = headerWidgetData.name_from_container
      ? props.dashboard.name
      : headerWidgetData.widget_name;

    return (
      <HeaderWidget
        backgroundColor={headerWidgetData.background_color}
        canManageDashboard={false}
        userName={headerWidgetData.user.fullname}
        name={widgetName}
        onDelete={() => {}}
        onDuplicate={() => {}}
        onEdit={() => {}}
        orgLogo={headerWidgetData.organisation_logo_url}
        orgName={headerWidgetData.organisation_name}
        selectedDateRange={headerWidgetData.date_range}
        selectedPopulation={headerWidgetData.population}
        selectedTimePeriod={headerWidgetData.time_period}
        showOrgLogo={headerWidgetData.show_organisation_logo}
        showOrgName={headerWidgetData.show_organisation_name}
        squadAthletes={props.squadAthletes}
        squadName={headerWidgetData.squad_name}
        squads={props.squads}
        widgetId={widgetId}
      />
    );
  };

  const getGraphWidget = (graphWidgetData: WidgetData) => {
    const graphName = graphWidgetData.widget.name || '';

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
        graphData={graphData}
        dashboardId={props.dashboard.id}
        reloadGraph={() => {}}
        onClickOpenGraphLinksModal={() => {}}
        onDeleteGraph={() => {}}
        onDuplicate={() => {}}
        onSortGraph={() => {}}
        onUpdateAggregationPeriod={() => {}}
        canManageDashboard={false}
      />
    );
  };

  const getNotesWidget = (widgetData: WidgetData) => {
    return (
      <NotesWidget
        annotations={widgetData.widget_render.annotations}
        users={[]}
        canManageDashboard={false}
        hasError={widgetData.widget_render.error}
        isLoading={
          widgetData.widget_render.isLoading ||
          // eslint-disable-next-line no-underscore-dangle
          widgetData.widget_render.__async__
        }
        nextPage={widgetData.widget_render.next_page}
        onDuplicate={() => {}}
        onEdit={() => {}}
        onRemove={() => {}}
        selectedAnnotationTypes={widgetData.widget.widget_annotation_types}
        selectedPopulation={widgetData.widget.population}
        selectedTimeScope={widgetData.widget.time_scope}
        selectedTimeRange={widgetData.widget_render.time_range}
        totalNotes={widgetData.widget_render.total_count}
        widgetId={widgetData.id}
        widgetName={widgetData.widget.name}
        annotationTypes={props.annotationTypes}
      />
    );
  };

  const getProfileWidget = (widgetData: WidgetData) => {
    return (
      <ProfileWidget
        athleteId={widgetData.widget.athlete_id}
        availabilityStatus={widgetData.widget_render.availability_status}
        canManageDashboard={false}
        fieldInformation={widgetData.widget_render.field_values}
        imageUrl={widgetData.widget_render.avatar_url}
        onDelete={() => {}}
        onDuplicate={() => {}}
        onEdit={() => {}}
        selectedInfoFields={widgetData.widget.fields}
        showAvailabilityIndicator={widgetData.widget.avatar_availability}
        showError={
          !isSelectionEmpty(props.appliedSquadAthletes) &&
          props.appliedSquadAthletes.athletes.length !== 1
        }
        showSquadNumber={widgetData.widget.avatar_squad_number}
        widgetId={widgetData.id}
        backgroundColour={widgetData.widget.background_colour}
      />
    );
  };

  const getTableWidget = (widgetData: WidgetData) => {
    const appliedTablePopulation =
      props.appliedSquadAthletes &&
      !_isEqual(props.appliedSquadAthletes, _cloneDeep(emptySquadAthletes))
        ? props.appliedSquadAthletes
        : widgetData.widget.table_container.population;

    return (
      <TableWidget
        appliedTimeScopes={widgetData.widget.table_container.time_scopes}
        onDelete={() => {}}
        onDuplicate={() => {}}
        pivotedPopulation={appliedTablePopulation}
        pivotedDateRange={props.pivotedDateRange}
        pivotedTimePeriod={props.pivotedTimePeriod}
        pivotedTimePeriodLength={props.pivotedTimePeriodLength}
        showSummary={
          widgetData.widget.table_container.config?.show_summary || false
        }
        squadAthletes={props.squadAthletes}
        squads={props.squads}
        tableContainerId={widgetData.widget.table_container.id}
        tableName={widgetData.widget_render.name}
        tableType={
          widgetData.widget.table_container.config?.table_type || 'COMPARISON'
        }
        widgetId={widgetData.id}
        renderedByPrintBuilder
      />
    );
  };

  const getActionsWidget = (widgetData: WidgetData) => {
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
        annotationTypes={props.annotationTypes}
        squadAthletes={props.squadAthletes}
        squads={props.squads}
        currentUser={props.currentUser}
      />
    );
  };

  const getChartWidget = (widgetData: WidgetData) => {
    const pivotData = {
      pivotedDateRange: props.pivotedDateRange,
      pivotedPopulation: (props.appliedSquadAthletes: Object),
      pivotedTimePeriod: props.pivotedTimePeriod,
      pivotedTimePeriodLength: props.pivotedTimePeriodLength,
    };

    /** $FlowIgnore[incompatible-type]
     * Safe to ignore: `ChartWidget` only rendered when `widgetData.widget_type === 'chart'`
     * Flow does not seem to detect this
     */
    return (
      <ChartWidget
        // $FlowIgnore[incompatible-type]
        widgetData={widgetData}
        pivotData={pivotData}
      />
    );
  };

  const getDevelopmentGoalWidget = (widgetData: WidgetData) => {
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
  };

  if (props.widgetData.widget_type === 'header') {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getHeaderWidget(props.widgetData.id, props.widgetData.widget_render)}
      </div>
    );
  } else if (props.widgetData.widget_type === 'graph') {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getGraphWidget(props.widgetData)}
      </div>
    );
  } else if (
    props.widgetData.widget_type === 'annotation' &&
    window.getFlag('evaluation-note')
  ) {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getNotesWidget(props.widgetData)}
      </div>
    );
  } else if (props.widgetData.widget_type === 'athlete_profile') {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getProfileWidget(props.widgetData)}
      </div>
    );
  } else if (props.widgetData.widget_type === 'table') {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getTableWidget(props.widgetData)}
      </div>
    );
  } else if (props.widgetData.widget_type === 'action') {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getActionsWidget(props.widgetData)}
      </div>
    );
  } else if (props.widgetData.widget_type === 'development_goal') {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getDevelopmentGoalWidget(props.widgetData)}
      </div>
    );
  } else if (props.widgetData.widget_type === 'chart') {
    widget = (
      <div className="analyticalDashboard__widget">
        {!window.getFlag('rep-print-builder-new-layout') && (
          <div className="printBuilder__widgetDragHandle">
            <i className="icon-reorder-vertical" />
          </div>
        )}
        {getChartWidget(props.widgetData)}
      </div>
    );
  } else {
    // We need to return an empty div with a random key
    // so that the react-grid-layout library doesn't fail
    // and kill the dashboard. This is only ever seen if
    // a widget is created and then the relevant flag is
    // turned off.
    widget = (
      <div
        className="analyticalDashboard__blankWidgetDiv"
        key={Math.floor(Math.random() * 100)}
      />
    );
  }

  return widget;
};

export default WidgetRenderer;
