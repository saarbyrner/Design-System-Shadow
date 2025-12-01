// @flow
/* eslint-disable no-use-before-define */
import type { DateRange } from '@kitman/common/src/types';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type {
  SummaryGraphData,
  LongitudinalGraphData,
  SummaryBarGraphData,
  SummaryStackBarGraphData,
  SummaryDonutGraphData,
  Dashboard,
} from '@kitman/modules/src/analysis/shared/types';
import type { TableWidgetMetric } from './components/TableWidget/types';

export type HeaderWidgetData = {
  background_color: string,
  date_range?: DateRange,
  font_color: string,
  name_from_container: boolean,
  organisation_logo_url: string,
  organisation_name: string,
  population: SquadAthletesSelection,
  show_organisation_logo: boolean,
  show_organisation_name: boolean,
  hide_organisation_details: boolean,
  squad_name: string,
  time_period?: string,
  user: {
    fullname: string,
  },
  widget_name: string,
};

export type ProfileWidgetInfoField = {
  name: string,
  value: string | number,
};

export type WidgetData = {
  id: number,
  rows: number,
  cols: number,
  vertical_position: number,
  horizontal_position: number,
  print_rows: number,
  print_cols: number,
  print_vertical_position: number,
  print_horizontal_position: number,
  rows_range: Array<number>,
  cols_range: Array<number>,
  widget_type: string,
  widget: Object,
  widget_render: Object,
  isLoading: boolean,
  error: boolean,
  cached_at: Date,
};

export type WidgetShape<WidgetRender, WidgetType: string> = {
  id: number,
  rows: number,
  cols: number,
  vertical_position: number,
  horizontal_position: number,
  print_rows: number,
  print_cols: number,
  print_vertical_position: number,
  print_horizontal_position: number,
  rows_range: Array<number>,
  cols_range: Array<number>,
  widget_type: WidgetType,
  widget: WidgetRender,
  widget_render: WidgetRender,
  cached_at: Date,
};

export type GraphData =
  | SummaryGraphData
  | LongitudinalGraphData
  | SummaryBarGraphData
  | SummaryStackBarGraphData
  | SummaryDonutGraphData;

export type ContainerType = 'AnalyticalDashboard' | 'HomeDashboard';

export type User = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

export type Annotation = {
  id: number,
  title: string,
  annotation_date: string,
  organisation_annotation_type: {
    id: number,
    name: string,
  },
  annotationable: {
    id: number,
    fullname: string,
    avatar_url: string,
  },
  annotation_actions: Array<Actions>,
  content: string,
  created_by: {
    id: number,
    fullname: string,
  },
  created_at: string,
  // NOTE: updated_by may not be present where data was migrated without this info
  updated_by?: {
    id: number,
    fullname: string,
  },
  updated_at: string,
};

export type Actions = {
  id: number,
  content: string,
  completed: boolean,
  due_date: ?string,
  annotation: Annotation,
  users: Array<User>,
};

export type ActionsTableColumn = 'due_date' | 'time_remaining' | 'assignment';

export type InitialData = {
  availableVariables: Array<TableWidgetMetric>,
  organisationAnnotationTypes: Array<{
    id: number,
    name: string,
    type: string,
  }>,
  graphColours: Object,
  orgLogoPath: string,
  orgName: string,
  organisationModules: string[],
  squadName: string,
  turnaroundList: Array<{ id: number, name: string, from: string, to: string }>,
  currentUser: User,
  users: Array<User>,
  dashboard: Dashboard,
  dashboardList: Array<Dashboard>,
  containerType: string,
  dashboardManager: boolean,
  homepageManager: boolean,
  chartBuilder: boolean,
  canViewNotes: boolean,
  canViewMetrics: boolean,
  canCreateNotes: boolean,
  canEditNotes: boolean,
  canViewDevelopmentGoals: boolean,
  canCreateDevelopmentGoals: boolean,
  canEditDevelopmentGoals: boolean,
  canDeleteDevelopmentGoals: boolean,
  canSeeHiddenVariables: boolean,
};

export const LOADING_LEVEL = {
  IDLE: 0,
  INITIAL_LOAD: 1,
  LONG_LOAD: 2,
};
