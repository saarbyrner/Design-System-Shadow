// @flow
import _difference from 'lodash/difference';
import type { DropdownItem, GroupItems } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { StatusVariable } from '@kitman/common/src/types';
import {
  FormValidator,
  MultiSelect,
  IconButton,
  RadioList,
  TextButton,
} from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import { formatAvailableVariables } from '@kitman/common/src/utils/formatAvailableVariables';
import { withNamespaces } from 'react-i18next';
import FormSection from '../FormSection';
import { PopulationFormTranslated as PopulationForm } from './PopulationForm';

import type { Population } from '../../../types';

type Props = {
  athletes: Array<DropdownItem>,
  scaleType: string,
  createGraph: Function,
  addPopulation: Function,
  deletePopulation: Function,
  addMetrics: Function,
  removeMetrics: Function,
  updateAthletes: Function,
  updateScaleType: Function,
  updateCalculation: Function,
  updateDateRange: Function,
  updateComparisonGroup: Function,
  metrics: Array<StatusVariable>,
  selectedMetrics: Array<string>,
  population: Array<Population>,
  comparisonGroupIndex: number,
  turnaroundList: Array<Turnaround>,
  populateDrillsForm: Function,
  populateDrills: Function,
  populateGames: Function,
  populateTrainingSessions: Function,
  updateEventBreakdown: Function,
  updateSelectedGames: Function,
  updateSelectedTrainingSessions: Function,
  updateTimePeriodLength: Function,
  updateLastXTimePeriod: Function,
  updateTimePeriodLengthOffset: Function,
  updateLastXTimePeriodOffset: Function,
  eventTypes: GroupItems,
  trainingSessionTypes: GroupItems,
  updateEventTypeFilters: Function,
  updateTrainingSessionTypeFilters: Function,
  addFilter: Function,
  removeFilter: Function,
};

const FormSummary = (props: I18nProps<Props>) => (
  <FormValidator successAction={props.createGraph}>
    <FormSection title={props.t('Metric Data')} border="bottom">
      <div className="row statusForm__row">
        <div className="col-xl-8">
          <MultiSelect
            label={props.t('Data Source')}
            name="MetricDataSelect"
            items={formatAvailableVariables(props.metrics)}
            selectedItems={props.selectedMetrics}
            onChange={(newMetricSelection) => {
              if (newMetricSelection.length > props.selectedMetrics.length) {
                props.addMetrics(
                  _difference(newMetricSelection, props.selectedMetrics)
                );
              } else {
                props.removeMetrics(
                  _difference(props.selectedMetrics, newMetricSelection)
                );
              }
            }}
          />
        </div>
      </div>

      <div className="row statusForm__row statusForm__row--scaleType">
        <div className="col-xl-12">
          <RadioList
            radioName="scale_type"
            label={props.t('Axis Scale')}
            options={[
              {
                name: props.t('Z-Score'),
                value: 'normalized',
              },
              {
                name: props.t('Raw'),
                value: 'denormalized',
              },
            ]}
            change={props.updateScaleType}
            value={props.scaleType}
          />
        </div>
      </div>
    </FormSection>

    {props.population.map((population, index) => (
      <FormSection
        key={index} // eslint-disable-line react/no-array-index-key
        title={props.t('Population')}
        border="bottom"
        sectionNumber={index + 1}
      >
        <PopulationForm
          key={index} // eslint-disable-line react/no-array-index-key
          index={index}
          athletes={props.athletes}
          deletePopulation={() => props.deletePopulation(index)}
          updateAthletes={(populationIndex, athletesId) =>
            props.updateAthletes(populationIndex, athletesId)
          }
          updateCalculation={(populationIndex, calculationId) =>
            props.updateCalculation(populationIndex, calculationId)
          }
          updateDateRange={(populationIndex, dateRange) =>
            props.updateDateRange(populationIndex, dateRange)
          }
          updateComparisonGroup={(populationIndex) =>
            props.updateComparisonGroup(populationIndex)
          }
          population={population}
          comparisonGroupIndex={props.comparisonGroupIndex}
          turnaroundList={props.turnaroundList}
          isComparisonGroupDisabled={
            props.scaleType === 'denormalized' || props.population.length <= 1
          }
          isDeleteDisabled={props.population.length <= 1}
          populateDrillsForm={props.populateDrillsForm}
          populateDrills={props.populateDrills}
          populateGames={props.populateGames}
          updateEventBreakdown={props.updateEventBreakdown}
          updateSelectedGames={props.updateSelectedGames}
          updateSelectedTrainingSessions={props.updateSelectedTrainingSessions}
          updateTimePeriodLength={(timePeriodLength, populationIndex) =>
            props.updateTimePeriodLength(timePeriodLength, populationIndex)
          }
          updateLastXTimePeriod={(lastXTimePeriod, populationIndex) =>
            props.updateLastXTimePeriod(lastXTimePeriod, populationIndex)
          }
          updateTimePeriodLengthOffset={(
            timePeriodLengthOffset,
            populationIndex
          ) =>
            props.updateTimePeriodLengthOffset(
              timePeriodLengthOffset,
              populationIndex
            )
          }
          updateLastXTimePeriodOffset={(
            lastXTimePeriodOffset,
            populationIndex
          ) =>
            props.updateLastXTimePeriodOffset(
              lastXTimePeriodOffset,
              populationIndex
            )
          }
          populateTrainingSessions={props.populateTrainingSessions}
          scaleType={props.scaleType}
          eventTypes={props.eventTypes}
          trainingSessionTypes={props.trainingSessionTypes}
          updateEventTypeFilters={props.updateEventTypeFilters}
          updateTrainingSessionTypeFilters={
            props.updateTrainingSessionTypeFilters
          }
          addFilter={props.addFilter}
          removeFilter={props.removeFilter}
        />
      </FormSection>
    ))}

    <div className="graphComposer__addMetricBtn">
      <IconButton
        text={props.t('#sport_specific__Add_Athletes')}
        icon="icon-add"
        onClick={props.addPopulation}
        isSmall
      />
    </div>

    <div className="graphComposer__formFooter">
      <TextButton
        text={props.t('Build Graph')}
        type="primary"
        onClick={() => TrackEvent('Graph Builder', 'Click', 'Build Graph')}
        isSubmit
      />
    </div>
  </FormValidator>
);

export const FormSummaryTranslated = withNamespaces()(FormSummary);
export default FormSummary;
