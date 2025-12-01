// @flow
import StatusForm from '@kitman/modules/src/StatusForm';
import { withNamespaces } from 'react-i18next';

import { AthleteSelector, LastXPeriodOffset } from '@kitman/components';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import { SessionDateRangeTranslated as SessionDateRange } from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/SessionDateRangeSection';
import { FilterSectionTranslated as FilterSection } from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/FilterSection';

// Types
import type { SquadAthletes, GroupItems } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Metric } from '@kitman/common/src/types/Metric';
import type {
  DateRange,
  QuestionnaireVariable,
} from '@kitman/common/src/types';
import type { GraphGroup } from '@kitman/modules/src/analysis/shared/types';

type Props = {
  graphGroup: GraphGroup,
  squadAthletes: SquadAthletes,
  turnaroundList: Array<Turnaround>,
  availableVariables: Array<QuestionnaireVariable>,
  updateStatus: Function,
  updateSquadSelection: Function,
  updateDateRange: Function,
  populateDrills: Function,
  updateSelectedGames: Function,
  updateSelectedTrainingSessions: Function,
  updateEventBreakdown: Function,
  populateTrainingSessions: Function,
  populateGames: Function,
  populateDrillsForm: Function,
  metric: Metric,
  updateTimePeriodLength: Function,
  updateLastXTimePeriod: Function,
  updateTimePeriodLengthOffset: Function,
  updateLastXTimePeriodOffset: Function,
  updateEventTypeFilters: Function,
  updateTrainingSessionTypeFilters: Function,
  addFilter: Function,
  removeFilter: Function,
  eventTypes: GroupItems,
  trainingSessionTypes: GroupItems,
  dateRange: DateRange,
  index: number,
};

const MetricSection = (props: I18nProps<Props>) => {
  const hasAbsoluteSummaries =
    (window.getFlag('graph-pipeline-migration-value_visualisation') &&
      props.graphGroup === 'value_visualisation') ||
    (window.getFlag('graph-pipeline-migration-summary_donut') &&
      props.graphGroup === 'summary_donut') ||
    (window.getFlag('graph-pipeline-migration-summary_stack_bar') &&
      props.graphGroup === 'summary_stack_bar') ||
    (window.getFlag('graph-pipeline-migration-summary_bar') &&
      props.graphGroup === 'summary_bar') ||
    (window.getFlag('graph-pipeline-migration-longitudinal') &&
      props.graphGroup === 'longitudinal');

  const getSummaryWhitelist = () => {
    const needsWhitelist =
      props.graphGroup === 'summary_bar' ||
      props.graphGroup === 'value_visualisation' ||
      props.metric.status.event_type_time_period === 'game' ||
      props.metric.status.event_type_time_period === 'training_session';

    if (!needsWhitelist) {
      return null;
    }

    return hasAbsoluteSummaries
      ? [
          'sum_absolute',
          'sum',
          'min_absolute',
          'min',
          'max_absolute',
          'max',
          'mean',
          'count',
          'count_absolute',
          'last',
        ]
      : ['last', 'sum', 'mean', 'count', 'min', 'max'];
  };

  return (
    <>
      <div className="row statusForm__row">
        <SessionDateRange
          graphGroup={props.graphGroup}
          metricIndex={props.index}
          populateDrillsForm={props.populateDrillsForm}
          trainingSessions={props.metric.status.training_sessions}
          games={props.metric.status.games}
          drills={props.metric.status.drills}
          updateDateRange={props.updateDateRange}
          populateDrills={props.populateDrills}
          updateSelectedGames={props.updateSelectedGames}
          updateEventBreakdown={props.updateEventBreakdown}
          updateSelectedTrainingSessions={props.updateSelectedTrainingSessions}
          selectedGames={props.metric.status.selected_games}
          selectedTrainingSessions={
            props.metric.status.selected_training_sessions
          }
          eventBreakdown={props.metric.status.event_breakdown}
          populateTrainingSessions={props.populateTrainingSessions}
          populateGames={props.populateGames}
          eventTypeTimePeriod={props.metric.status.event_type_time_period}
          dateRange={props.dateRange}
          timePeriodLength={props.metric.status.time_period_length}
          onUpdateTimePeriodLength={props.updateTimePeriodLength}
          lastXTimePeriod={props.metric.status.last_x_time_period || 'days'}
          onUpdateLastXTimePeriod={props.updateLastXTimePeriod}
          turnaroundList={props.turnaroundList}
        />
      </div>

      {window.getFlag('graphing-offset-calc') &&
        props.metric.status.event_type_time_period ===
          TIME_PERIODS.lastXDays && (
          <div className="row statusForm__row">
            <LastXPeriodOffset
              disabled={props.graphGroup !== 'summary' && props.index > 0}
              metricIndex={props.index}
              timePeriodLengthOffset={
                props.metric.status.time_period_length_offset
              }
              onUpdateTimePeriodLengthOffset={
                props.updateTimePeriodLengthOffset
              }
              lastXTimePeriodOffset={
                props.metric.status.last_x_time_period_offset || 'days'
              }
              onUpdateLastXTimePeriodOffset={props.updateLastXTimePeriodOffset}
              radioName={`rollingDateOffsetRadios__${props.index}`}
            />
          </div>
        )}

      <div className="row statusForm__row">
        <div className="col-xl-6">
          <AthleteSelector
            label={props.t('#sport_specific__Athletes')}
            squadAthletes={props.squadAthletes}
            selectedSquadAthletes={props.metric.squad_selection}
            onSelectSquadAthletes={(squadAthletesSelection) => {
              props.updateSquadSelection(props.index, squadAthletesSelection);
            }}
            singleSelection={props.graphGroup === 'value_visualisation'}
          />
        </div>
      </div>

      <StatusForm
        lastXPeriodRadioName={`statusForm__lastX__${props.index}`}
        updatedStatus={props.metric.status}
        availableVariables={props.availableVariables}
        onChange={(status) => {
          props.updateStatus(props.index, status);
        }}
        summaryWhiteList={getSummaryWhitelist()}
        withAbsoluteSummaries={hasAbsoluteSummaries}
        noPeriodSelector={
          props.graphGroup === 'summary_bar' ||
          props.graphGroup === 'value_visualisation'
        }
        t={props.t}
      />

      {window.getFlag('metric-session-filter') && (
        <FilterSection
          metricType={props.metric.type}
          filters={props.metric.filters}
          addFilter={() => props.addFilter(props.index)}
          removeFilter={() => props.removeFilter(props.index)}
          updateEventTypeFilters={(eventTypeFilters) => {
            props.updateEventTypeFilters(props.index, eventTypeFilters);
          }}
          updateTrainingSessionTypeFilters={(trainingSessionTypeFilters) => {
            props.updateTrainingSessionTypeFilters(
              props.index,
              trainingSessionTypeFilters
            );
          }}
          eventTypes={props.eventTypes}
          trainingSessionTypes={props.trainingSessionTypes}
        />
      )}
    </>
  );
};

export const MetricSectionTranslated = withNamespaces()(MetricSection);
export default MetricSection;
