import { connect } from 'react-redux';
import {
  addPopulation,
  deletePopulation,
  addMetrics,
  removeMetrics,
  updateAthletes,
  updateScaleType,
  updateCalculation,
  updateDateRange,
  updateComparisonGroup,
  populateDrillsForm,
  populateDrills,
  populateGames,
  populateTrainingSessions,
  updateEventBreakdown,
  updateSelectedGames,
  updateSelectedTrainingSessions,
  updateTimePeriodLength,
  updateLastXTimePeriod,
  updateTimePeriodLengthOffset,
  updateLastXTimePeriodOffset,
  addFilter,
  removeFilter,
  updateEventTypeFilters,
  updateTrainingSessionTypeFilters,
} from '../../../actions/GraphForm/Summary';

import { createGraph } from '../../../actions';

import { FormSummaryTranslated as FormSummary } from '../../../components/GraphForm/Summary';

const mapStateToProps = (state) => {
  return {
    athletes: state.StaticData.athletesDropdown,
    scaleType: state.GraphFormSummary.scale_type,
    metrics: state.StaticData.availableVariables,
    selectedMetrics: state.GraphFormSummary.metrics.map(
      (metric) => metric.source_key
    ),
    population: state.GraphFormSummary.population,
    comparisonGroupIndex: state.GraphFormSummary.comparisonGroupIndex,
    turnaroundList: state.StaticData.turnaroundList,
    eventTypes: state.StaticData.eventTypes,
    trainingSessionTypes: state.StaticData.trainingSessionTypes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createGraph: () => {
    dispatch(createGraph());
  },
  addPopulation: () => {
    dispatch(addPopulation());
  },
  deletePopulation: (index) => {
    dispatch(deletePopulation(index));
  },
  addMetrics: (metrics) => {
    dispatch(addMetrics(metrics));
  },
  removeMetrics: (metrics) => {
    dispatch(removeMetrics(metrics));
  },
  updateAthletes: (populationIndex, athletesId) => {
    dispatch(updateAthletes(populationIndex, athletesId));
  },
  updateScaleType: (scaleType) => {
    dispatch(updateScaleType(scaleType));
  },
  updateCalculation: (populationIndex, calculationId) => {
    dispatch(updateCalculation(populationIndex, calculationId));
  },
  updateDateRange: (populationIndex, dateRange) => {
    dispatch(updateDateRange(populationIndex, dateRange));
  },
  updateComparisonGroup: (populationIndex) => {
    dispatch(updateComparisonGroup(populationIndex));
  },
  populateDrillsForm: (populationIndex, itemKey) => {
    dispatch(populateDrillsForm(populationIndex, itemKey));
  },
  populateDrills: (populationIndex, eventId) => {
    dispatch(populateDrills(populationIndex, eventId));
  },
  populateGames: (populationIndex, dateRange) => {
    dispatch(populateGames(populationIndex, dateRange));
  },
  populateTrainingSessions: (populationIndex, dateRange) => {
    dispatch(populateTrainingSessions(populationIndex, dateRange));
  },
  updateEventBreakdown: (populationIndex, breakdownTypeId) => {
    dispatch(updateEventBreakdown(populationIndex, breakdownTypeId));
  },
  updateSelectedGames: (populationIndex, eventId, selectionType) => {
    dispatch(updateSelectedGames(populationIndex, eventId, selectionType));
  },
  updateSelectedTrainingSessions: (populationIndex, eventId, selectionType) => {
    dispatch(
      updateSelectedTrainingSessions(populationIndex, eventId, selectionType)
    );
  },
  updateTimePeriodLength: (timePeriodLength, populationIndex) => {
    dispatch(updateTimePeriodLength(timePeriodLength, populationIndex));
  },
  updateLastXTimePeriod: (lastXTimePeriod, populationIndex) => {
    dispatch(updateLastXTimePeriod(lastXTimePeriod, populationIndex));
  },
  updateTimePeriodLengthOffset: (timePeriodLengthOffset, populationIndex) => {
    dispatch(
      updateTimePeriodLengthOffset(timePeriodLengthOffset, populationIndex)
    );
  },
  updateLastXTimePeriodOffset: (lastXTimePeriodOffset, populationIndex) => {
    dispatch(
      updateLastXTimePeriodOffset(lastXTimePeriodOffset, populationIndex)
    );
  },
  updateEventTypeFilters: (populationIndex, eventTypeFilters) => {
    dispatch(updateEventTypeFilters(populationIndex, eventTypeFilters));
  },
  updateTrainingSessionTypeFilters: (
    populationIndex,
    trainingSessionTypeFilters
  ) => {
    dispatch(
      updateTrainingSessionTypeFilters(
        populationIndex,
        trainingSessionTypeFilters
      )
    );
  },
  addFilter: (populationIndex) => {
    dispatch(addFilter(populationIndex));
  },
  removeFilter: (populationIndex) => {
    dispatch(removeFilter(populationIndex));
  },
});

const FormSummaryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormSummary);

export default FormSummaryContainer;
