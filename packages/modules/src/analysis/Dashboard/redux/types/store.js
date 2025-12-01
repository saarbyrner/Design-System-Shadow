// @flow
import type { ModalStatus, StatusVariable } from '@kitman/common/src/types';
import type {
  Annotation,
  AnnotationAction,
  AnnotationResponse,
} from '@kitman/common/src/types/Annotation';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type {
  Dashboard,
  WidgetLayout,
} from '@kitman/modules/src/analysis/shared/types';
import type {
  ContainerType,
  ProfileWidgetInfoField,
} from '@kitman/modules/src/analysis/Dashboard/types';
import type {
  FormulaInputParams,
  TableElementFilters,
  TableWidgetCalculationParams,
  TableWidgetColumn,
  TableWidgetElementSource,
  TableWidgetFormatRule,
  TableWidgetMetric,
  TableWidgetDataSource,
  TableWidgetRow,
  TableWidgetRowMetric,
  WidgetType,
  InheritGroupings,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { ChartBuilderState } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';

export type ColumnFormulaState = {
  isEditMode: boolean,
  isLoading: boolean,
  formulaId: ?number,
  widgetType: ?WidgetType,
  widgetId: ?number,
  columnId: ?number,
  columnName: ?string,
  tableContainerId: ?number,
  progressStep: number,
  inputs: FormulaInputParams,
  inheritGroupings?: InheritGroupings,
};

export type InjuryRiskMetricsState = {
  isLoading: boolean,
  hasErrored: boolean,
  metrics: Array<InjuryVariable>,
};

export type Store = {
  dashboard: {
    status: ModalStatus,
    appStatusText: ?string,
    dashboardLayout: Array<WidgetLayout>,
    isReorderModalOpen: boolean,
    isTableFormattingPanelOpen: boolean,
    isTableColumnPanelOpen: boolean,
    isTableRowPanelOpen: boolean,
    appliedSquadAthletes: SquadAthletesSelection,
    appliedDateRange: Object,
    appliedTimePeriod: string,
    appliedTimePeriodLength: ?number,
    activeDashboard: Dashboard,
  },
  graphLinksModal: {
    graphId: string,
    open: boolean,
    graphLinks: Array<{
      dashboardId: string,
      metrics: Array<string>,
    }>,
  },
  duplicateDashboardModal: {
    dashboardName: string,
    isOpen: boolean,
    status: ?string,
  },
  duplicateWidgetModal: {
    isNameEditable: boolean,
    isOpen: boolean,
    selectedDashboard: Dashboard,
    status: ?string,
    widgetId: number,
    widgetName: string,
    widgetType: string,
  },
  notesWidget: {
    notesModal: {
      isNotesModalOpen: boolean,
      status: ?string,
      message: ?string,
      widgetId: number,
    },
    notesWidgetStatus: {
      annotation: ?AnnotationResponse,
      fileId: ?number,
      status: ?string,
      message: ?string,
      secondaryMessage: ?string,
    },
    noteViewStatus: {
      status: ?string,
      message: ?string,
    },
    population: SquadAthletesSelection,
    time_scope: {
      time_period: string,
      start_time: string,
      end_time: string,
      time_period_length: number,
    },
    time_range: {
      start_time: string,
      end_time: string,
    },
    widget_annotation_types: Array<Object>,
    availableAthletes: Array<Object>,
    updatedAction: AnnotationAction,
    toast: {
      fileOrder: Array<?number>,
      fileMap: {
        [number]: File,
      },
    },
  },
  tableWidget: {
    appliedColumns: Array<TableWidgetColumn>,
    appliedMetrics: Array<TableWidgetRowMetric>,
    appliedRows: Array<TableWidgetRow>,
    columnPanel: {
      source: TableWidgetDataSource | null,
      columnId: number,
      isEditMode: boolean,
      tableContainerId: number,
      name: string,
      dataSource: TableWidgetElementSource,
      population: SquadAthletesSelection,
      calculation: string,
      calculation_params?: TableWidgetCalculationParams,
      time_scope: {
        time_period: string,
        start_time: string,
        end_time: string,
        time_period_length: ?number,
        time_period_length_offset: number,
      },
      filters: TableElementFilters,
      isLoading: boolean,
    },
    rowPanel: {
      source: TableWidgetDataSource | null,
      calculation: string,
      calculation_params?: TableWidgetCalculationParams,
      isEditMode: boolean,
      rowId: number,
      metrics: Array<TableWidgetMetric>,
      population: SquadAthletesSelection,
      time_scope: {
        time_period: string,
        start_time: string,
        end_time: string,
        time_period_length: ?number,
        isLoading: boolean,
      },
      filters: TableElementFilters,
    },
    formattingPanel: {
      formattableId: number,
      panelName: string,
      ruleUnit: string,
      appliedFormat: Array<TableWidgetFormatRule>,
    },
    showSummary: boolean,
    tableContainerId: number,
    tableName: string,
    tableType: 'COMPARISON' | 'SCORECARD' | 'LONGITUDINAL',
    widgetId: number,
    duplicateColumn: {
      loading: Array<number>,
      error: Array<number>,
    },
  },
  tableWidgetModal: {
    isOpen: boolean,
    status: ?string,
  },
  actionsWidgetModal: {
    isOpen: boolean,
  },
  annotation: Annotation,
  headerWidgetModal: {
    color: string,
    name: string,
    open: boolean,
    population: SquadAthletesSelection,
    showOrgLogo: boolean,
    showOrgName: boolean,
  },
  profileWidgetModal: {
    athlete_id: string,
    avatar_availability: boolean,
    avatar_squad_number: boolean,
    fields: Array<ProfileWidgetInfoField>,
    open: boolean,
    preview: Object,
    backgroundColour: string,
  },
  noteDetailModal: {
    isOpen: boolean,
    annotation: Annotation,
    requestStatus: 'success' | 'error' | 'loading',
  },
  notesWidgetSettingsModal: {
    isOpen: boolean,
    population: SquadAthletesSelection,
    time_scope: {
      time_period: string,
      start_time: string,
      end_time: string,
      time_period_length: number,
    },
    organisation_annotation_type_ids: Array<number>,
  },
  printBuilder: {
    isOpen: boolean,
  },
  staticData: {
    availableVariablesHash: Array<StatusVariable>,
    canManageDashboard: boolean,
    canViewNotes: boolean,
    canCreateNotes: boolean,
    canEditNotes: boolean,
    canViewDevelopmentGoals: boolean,
    canCreateDevelopmentGoals: boolean,
    canEditDevelopmentGoals: boolean,
    canDeleteDevelopmentGoals: boolean,
    canSeeHiddenVariables: boolean,
    hasDevelopmentGoalsModule: boolean,
    containerType: ContainerType,
  },
  injuryRiskMetrics: InjuryRiskMetricsState,
  developmentGoalForm: { isOpen: boolean },
  coachingPrinciples: { isEnabled: boolean },
  chartBuilder: ChartBuilderState,
  turnaroundList: Array<Object>,
  dashboardList: Array<Dashboard>,
  columnFormulaPanel: ColumnFormulaState,
};

export type Selector<T> = (state: Store) => T;
