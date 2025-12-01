// @flow
import i18n from '@kitman/common/src/utils/i18n';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import { TrackEvent, trackIntercomEvent } from '@kitman/common/src/utils';
import { TextButton, TooltipMenu } from '@kitman/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { emptySquadAthletes } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { ContainerType } from '@kitman/modules/src/analysis/Dashboard/types';

type Props = {
  containerType: ContainerType,
  dashboard: Dashboard,
  isGraphBuilder: boolean,
  canViewNotes: boolean,
  hasDevelopmentGoalsModule: boolean,
  onClickAddActionsWidget: Function,
  onClickOpenHeaderWidgetModal: Function,
  onClickOpenProfileWidgetModal: Function,
  onClickOpenNotesWidgetSettingsModal: Function,
  onClickOpenTableWidgetModal: Function,
  onClickAddDevelopmentGoalWidget: Function,
  pivotedAthletes?: SquadAthletesSelection,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  developmentGoalTerminology: ?string,
  annotationTypes: Array<Object>,
  onAddChart: Function,
};

function AddWidgetDropdown(props: Props) {
  const { trackEvent } = useEventTracking();

  const getCreateGraphUrl = () => {
    if (props.containerType === 'HomeDashboard') {
      return `/analysis/graph/builder?home_dashboard_id=${props.dashboard.id}#create`;
    }
    return `/analysis/graph/builder?analytical_dashboard_id=${props.dashboard.id}#create`;
  };

  const addGraph = {
    description: i18n.t('Graph'),
    href: getCreateGraphUrl(),
    icon: 'icon-bar-graph',
    onClick: () => {
      // GA tracking
      TrackEvent('Graph Dashboard', 'Click', 'Widget dropdown - Add Graph');
      // Mixpanel
      trackEvent('View Graph Builder');
    },
  };

  const addHeader = {
    description: i18n.t('Header'),
    icon: 'icon-widget-header',
    onClick: () => {
      trackIntercomEvent('header-widget-modal-open');
      props.onClickOpenHeaderWidgetModal(
        null,
        props.dashboard.name,
        props.pivotedAthletes &&
          !_isEqual(props.pivotedAthletes, _cloneDeep(emptySquadAthletes))
          ? props.pivotedAthletes
          : _cloneDeep(emptySquadAthletes),
        '#ffffff',
        true,
        true,
        false
      );
      TrackEvent('Graph Dashboard', 'Click', 'Widget dropdown - Header');
    },
  };

  const getAthleteId = () => {
    if (props.pivotedAthletes && props.pivotedAthletes.athletes.length === 1) {
      return props.pivotedAthletes.athletes[0].toString();
    }
    return null;
  };

  const addProfile = {
    description: i18n.t('Profile'),
    icon: 'icon-widget-profile',
    onClick: () => {
      trackIntercomEvent('profile-widget-modal-open');
      props.onClickOpenProfileWidgetModal(null, getAthleteId(), false, false, [
        { name: 'name' },
        { name: 'availability' },
        { name: 'date_of_birth' },
        { name: 'position' },
      ]);
      TrackEvent('Graph Dashboard', 'Click', 'Widget dropdown - Profile');
    },
  };

  const addNotes = {
    description: i18n.t('Notes'),
    icon: 'icon-widget-notes',
    onClick: () => {
      trackIntercomEvent('note-widget-modal-open');
      props.onClickOpenNotesWidgetSettingsModal(
        null,
        '',
        [],
        props.pivotedAthletes &&
          !_isEqual(props.pivotedAthletes, emptySquadAthletes)
          ? props.pivotedAthletes
          : {
              applies_to_squad: true,
              position_groups: [],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
        {
          time_period: props.pivotedTimePeriod
            ? props.pivotedTimePeriod
            : TIME_PERIODS.thisSeason,
          start_time:
            props.pivotedDateRange && props.pivotedDateRange.start_date
              ? props.pivotedDateRange.start_date
              : undefined,
          end_time:
            props.pivotedDateRange && props.pivotedDateRange.end_date
              ? props.pivotedDateRange.end_date
              : undefined,
          time_period_length: props.pivotedTimePeriodLength
            ? props.pivotedTimePeriodLength
            : null,
        }
      );
    },
  };

  const addTable = {
    description: i18n.t('Table'),
    icon: 'icon-table',
    onClick: () => {
      props.onClickOpenTableWidgetModal();
    },
  };

  const addActions = {
    description: i18n.t('Actions'),
    icon: 'icon-questionnaire',
    onClick: () => {
      props.onClickAddActionsWidget(
        null,
        props.annotationTypes
          .filter(
            (annotationType) =>
              annotationType.type === 'OrganisationAnnotationTypes::Evaluation'
          )
          .map((annotationType) => annotationType.id),
        props.pivotedAthletes &&
          !_isEqual(props.pivotedAthletes, emptySquadAthletes)
          ? props.pivotedAthletes
          : {
              applies_to_squad: true,
              position_groups: [],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
        []
      );
    },
  };

  const addChartWidget = {
    description: i18n.t('Chart'),
    icon: 'icon-combination-graph',
    onClick: props.onAddChart,
  };

  const addDevelopmentGoal = {
    description:
      props.developmentGoalTerminology || i18n.t('Development goals'),
    icon: 'icon-widget-notes',
    onClick: () => {
      props.onClickAddDevelopmentGoalWidget();
      TrackEvent('Analysis Dahsboard', 'Add', 'Development Goal Widget');
      trackEvent('Add development goal widget');
    },
  };

  const getTooltipMenuItems = () => {
    const tooltipMenuItems: Array<TooltipItem> = [];

    if (
      (props.isGraphBuilder && props.containerType === 'AnalyticalDashboard') ||
      (props.containerType === 'HomeDashboard' &&
        window.getFlag('rep-enable-graphs-on-homepage'))
    ) {
      tooltipMenuItems.push(addGraph);
    }

    if (window.getFlag('rep-charts-v2')) {
      tooltipMenuItems.push(addChartWidget);
    }

    if (props.containerType === 'AnalyticalDashboard') {
      tooltipMenuItems.push(addProfile, addHeader);
    }

    if (window.getFlag('evaluation-note')) {
      if (
        props.containerType === 'AnalyticalDashboard' ||
        (props.containerType === 'HomeDashboard' && props.canViewNotes)
      ) {
        tooltipMenuItems.push(addNotes);
      }
    }

    tooltipMenuItems.push(addTable);

    if (
      window.getFlag('web-home-page') &&
      props.containerType === 'HomeDashboard'
    ) {
      if (
        props.containerType === 'AnalyticalDashboard' ||
        (props.containerType === 'HomeDashboard' && props.canViewNotes)
      ) {
        tooltipMenuItems.push(addActions);
      }
    }

    if (
      props.containerType === 'AnalyticalDashboard' &&
      props.hasDevelopmentGoalsModule
    ) {
      tooltipMenuItems.push(addDevelopmentGoal);
    }

    return tooltipMenuItems;
  };

  return (
    <div className="addWidgetDropdown">
      <TooltipMenu
        placement="bottom-end"
        offset={[0, 10]}
        menuItems={getTooltipMenuItems()}
        tooltipTriggerElement={
          <TextButton
            text={i18n.t('Add widget')}
            iconAfter="icon-chevron-down"
            type="primary"
            onClick={() =>
              TrackEvent('Graph Dashboard', 'Click', 'Add Widget Button')
            }
            kitmanDesignSystem
          />
        }
        kitmanDesignSystem
      />
    </div>
  );
}

export default AddWidgetDropdown;
