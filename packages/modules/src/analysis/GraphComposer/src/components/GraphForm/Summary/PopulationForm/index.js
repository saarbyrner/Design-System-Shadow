// @flow
import { withNamespaces } from 'react-i18next';
import {
  Dropdown,
  IconButton,
  InputRadio,
  LastXPeriodOffset,
} from '@kitman/components';
import { getCalculationsByType } from '@kitman/common/src/utils/status_utils';
import { FilterSectionTranslated as FilterSection } from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/FilterSection';
import { SessionDateRangeTranslated as SessionDateRange } from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/SessionDateRangeSection';
import { EVENT_TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DropdownItem, GroupItems } from '@kitman/components/src/types';
import type { Population } from '@kitman/modules/src/analysis/GraphComposer/src/types';

type Props = {
  index: number,
  athletes: Array<DropdownItem>,
  population: Population,
  comparisonGroupIndex: number,
  deletePopulation: Function,
  updateAthletes: Function,
  updateCalculation: Function,
  updateDateRange: Function,
  updateComparisonGroup: Function,
  turnaroundList: Array<Turnaround>,
  isComparisonGroupDisabled: boolean,
  isDeleteDisabled: boolean,
  populateDrillsForm: Function,
  populateDrills: Function,
  updateSelectedGames: Function,
  updateSelectedTrainingSessions: Function,
  updateEventBreakdown: Function,
  populateTrainingSessions: Function,
  populateGames: Function,
  updateTimePeriodLength: Function,
  updateLastXTimePeriod: Function,
  updateTimePeriodLengthOffset: Function,
  updateLastXTimePeriodOffset: Function,
  scaleType: string,
  eventTypes: GroupItems,
  trainingSessionTypes: GroupItems,
  updateEventTypeFilters: Function,
  updateTrainingSessionTypeFilters: Function,
  addFilter: Function,
  removeFilter: Function,
};

const PopulationForm = (props: I18nProps<Props>) => (
  <>
    <div className="graphComposerFormSection__comparisonGroup">
      <InputRadio
        inputName="comparison_group"
        option={{
          value: props.index,
          name: props.t('Comparison Group'),
        }}
        value={props.comparisonGroupIndex}
        change={() => props.updateComparisonGroup(props.index)}
        index={props.index}
        disabled={props.isComparisonGroupDisabled}
        buttonSide="left"
      />
    </div>
    <div className="graphComposerFormSection__deletePopulationBtn">
      <IconButton
        icon="icon-close"
        onClick={props.deletePopulation}
        isDisabled={props.isDeleteDisabled}
        isSmall
        isTransparent
      />
    </div>
    <div className="row statusForm__row">
      <SessionDateRange
        graphGroup="summary"
        metricIndex={props.index}
        populateDrillsForm={props.populateDrillsForm}
        trainingSessions={props.population.training_sessions || []}
        games={props.population.games || []}
        drills={props.population.drills || []}
        updateDateRange={props.updateDateRange}
        populateDrills={props.populateDrills}
        updateSelectedGames={props.updateSelectedGames}
        updateEventBreakdown={props.updateEventBreakdown}
        updateSelectedTrainingSessions={props.updateSelectedTrainingSessions}
        selectedGames={props.population.selected_games || []}
        selectedTrainingSessions={
          props.population.selected_training_sessions || []
        }
        eventBreakdown={props.population.event_breakdown || null}
        populateTrainingSessions={props.populateTrainingSessions}
        populateGames={props.populateGames}
        eventTypeTimePeriod={props.population.event_type_time_period || null}
        timePeriodLength={props.population.time_period_length || null}
        onUpdateTimePeriodLength={(timePeriodLength) =>
          props.updateTimePeriodLength(timePeriodLength, props.index)
        }
        lastXTimePeriod={props.population.last_x_time_period || 'days'}
        onUpdateLastXTimePeriod={(lastXTimePeriod) =>
          props.updateLastXTimePeriod(lastXTimePeriod, props.index)
        }
        dateRange={props.population.dateRange}
        turnaroundList={props.turnaroundList}
      />
    </div>

    {window.getFlag('graphing-offset-calc') &&
      props.population.event_type_time_period ===
        EVENT_TIME_PERIODS.lastXDays && (
        <div className="row statusForm__row">
          <LastXPeriodOffset
            metricIndex={props.index}
            timePeriodLengthOffset={
              props.population.time_period_length_offset || null
            }
            lastXTimePeriodOffset={
              props.population.last_x_time_period_offset || 'days'
            }
            onUpdateTimePeriodLengthOffset={(timePeriodLengthOffset) =>
              props.updateTimePeriodLengthOffset(
                timePeriodLengthOffset,
                props.index
              )
            }
            onUpdateLastXTimePeriodOffset={(lastXTimePeriodOffset) =>
              props.updateLastXTimePeriodOffset(
                lastXTimePeriodOffset,
                props.index
              )
            }
            radioName={`rollingDateOffsetRadios__${props.index}`}
          />
        </div>
      )}

    <div className="row statusForm__row">
      <div className="col-xl-6">
        <Dropdown
          items={props.athletes}
          onChange={(athletesId) =>
            props.updateAthletes(props.index, athletesId)
          }
          value={props.population.athletes}
          label={props.t('#sport_specific__Athletes')}
          searchable
        />
      </div>
    </div>
    <div
      className={`row statusForm__row ${
        !window.getFlag('metric-session-filter')
          ? 'statusForm__row--last'
          : ''
      }`}
    >
      <div className="col-xl-4">
        <Dropdown
          items={
            props.scaleType === 'denormalized'
              ? getCalculationsByType('simple_and_last')
              : getCalculationsByType('simple')
          }
          onChange={(calculationId) =>
            props.updateCalculation(props.index, calculationId)
          }
          value={props.population.calculation}
          label={props.t('Calculation')}
        />
      </div>
    </div>

    {window.getFlag('metric-session-filter') && (
      <FilterSection
        metricType="metric"
        filters={props.population.filters}
        addFilter={() => props.addFilter(props.index)}
        removeFilter={() => props.removeFilter(props.index)}
        updateEventTypeFilters={(eventTypeFilters) => {
          props.updateEventTypeFilters(props.index, eventTypeFilters);
        }}
        updateTrainingSessionTypeFilters={(trainingSessionTypeFilter) => {
          props.updateTrainingSessionTypeFilters(
            props.index,
            trainingSessionTypeFilter
          );
        }}
        eventTypes={props.eventTypes}
        trainingSessionTypes={props.trainingSessionTypes}
      />
    )}
  </>
);

export const PopulationFormTranslated = withNamespaces()(PopulationForm);
export default PopulationForm;
