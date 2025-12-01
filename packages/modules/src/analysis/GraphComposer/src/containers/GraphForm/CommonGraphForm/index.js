import { connect } from 'react-redux';
import { getCategorySelections } from '../../../utils';
import {
  updateSquadSelection,
  updateStatus,
  updateTimePeriod,
  updateDateRange,
  updateTimePeriodLength,
  updateLastXTimePeriod,
  updateTimePeriodLengthOffset,
  updateLastXTimePeriodOffset,
  populateTrainingSessions,
  populateGames,
  populateDrills,
  updateSelectedGames,
  updateSelectedTrainingSessions,
  updateEventBreakdown,
  populateDrillsForm,
  updateCategory,
  updateCategoryDivision,
  updateCategorySelection,
  addFilter,
  removeFilter,
  updateTimeLossFilters,
  updateSessionTypeFilters,
  updateEventTypeFilters,
  updateTrainingSessionTypeFilters,
  updateCompetitionFilters,
  addOverlay,
  deleteOverlay,
  updateOverlaySummary,
  updateOverlayPopulation,
  updateOverlayTimePeriod,
  updateOverlayDateRange,
  updateMetricStyle,
  updateDataType,
  addMetric,
  deleteMetric,
  updateMeasurementType,
} from '../../../actions/GraphForm';
import { createGraph, searchIssuesPerCoding } from '../../../actions';
import { CommonGraphFormTranslated as CommonGraphForm } from '../../../components/GraphForm/CommonGraphForm';

const mapStateToProps = (state) => {
  return {
    squadAthletes: state.StaticData.squadAthletes,
    permittedSquads: state.StaticData.permittedSquads,
    metrics: state.GraphForm.metrics,
    timePeriod: state.GraphForm.time_period,
    dateRange: state.GraphForm.date_range,
    athleteGroupsDropdown: state.StaticData.athleteGroupsDropdown,
    availableVariables: state.StaticData.availableVariables,
    turnaroundList: state.StaticData.turnaroundList,
    graphGroup: state.GraphGroup,
    graphType: state.GraphFormType,
    canAccessMedicalGraph: state.StaticData.canAccessMedicalGraph,
    sessionsTypes: state.StaticData.sessionsTypes,
    eventTypes: state.StaticData.eventTypes,
    trainingSessionTypes: state.StaticData.trainingSessionTypes,
    timeLossTypes: state.StaticData.timeLossTypes,
    competitions: state.StaticData.competitions,
    categorySelections: getCategorySelections(
      state.GraphForm.metrics[0]?.main_category,
      state.GraphForm.metrics[0]?.category,
      state.StaticData
    ),
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateDataType: (dataType, metricIndex) => {
    dispatch(updateDataType(dataType, metricIndex));
  },
  addMetric: () => {
    dispatch(addMetric());
  },
  deleteMetric: (metric) => {
    dispatch(deleteMetric(metric));
  },
  addOverlay: (metric) => {
    dispatch(addOverlay(metric));
  },
  deleteOverlay: (metric, overlay) => {
    dispatch(deleteOverlay(metric, overlay));
  },
  updateStatus: (index, status) => {
    dispatch(updateStatus(index, status));
  },
  updateSquadSelection: (index, squadSelection) => {
    dispatch(updateSquadSelection(index, squadSelection));
  },
  updateTimePeriod: (timePeriod) => {
    dispatch(updateTimePeriod(timePeriod));
  },
  updateDateRange: (dateRange) => {
    dispatch(updateDateRange(dateRange));
  },
  updateOverlaySummary: (metricIndex, overlayIndex, summary) => {
    dispatch(updateOverlaySummary(metricIndex, overlayIndex, summary));
  },
  updateOverlayPopulation: (metricIndex, overlayIndex, population) => {
    dispatch(updateOverlayPopulation(metricIndex, overlayIndex, population));
  },
  updateOverlayTimePeriod: (metricIndex, overlayIndex, timePeriod) => {
    dispatch(updateOverlayTimePeriod(metricIndex, overlayIndex, timePeriod));
  },
  updateOverlayDateRange: (metricIndex, overlayIndex, dateRange) => {
    dispatch(updateOverlayDateRange(metricIndex, overlayIndex, dateRange));
  },
  createGraph: () => {
    dispatch(createGraph());
  },
  populateTrainingSessions: (metricIndex, dateRange) => {
    dispatch(populateTrainingSessions(metricIndex, dateRange));
  },
  populateGames: (metricIndex, dateRange) => {
    dispatch(populateGames(metricIndex, dateRange));
  },
  populateDrills: (metricIndex, eventId) => {
    dispatch(populateDrills(metricIndex, eventId));
  },
  updateSelectedGames: (metricIndex, eventId, selectionType) => {
    dispatch(updateSelectedGames(metricIndex, eventId, selectionType));
  },
  updateSelectedTrainingSessions: (metricIndex, eventId, selectionType) => {
    dispatch(
      updateSelectedTrainingSessions(metricIndex, eventId, selectionType)
    );
  },
  updateEventBreakdown: (metricIndex, breakdownTypeId) => {
    dispatch(updateEventBreakdown(metricIndex, breakdownTypeId));
  },
  populateDrillsForm: (metricIndex, itemKey) => {
    dispatch(populateDrillsForm(metricIndex, itemKey));
  },
  updateTimePeriodLength: (timePeriodLength) => {
    dispatch(updateTimePeriodLength(timePeriodLength));
  },
  updateLastXTimePeriod: (lastXTimePeriod) => {
    dispatch(updateLastXTimePeriod(lastXTimePeriod));
  },
  updateTimePeriodLengthOffset: (timePeriodLength) => {
    dispatch(updateTimePeriodLengthOffset(timePeriodLength));
  },
  updateLastXTimePeriodOffset: (lastXTimePeriodOffset) => {
    dispatch(updateLastXTimePeriodOffset(lastXTimePeriodOffset));
  },
  updateCategory: (metricIndex, category, mainCategory) => {
    dispatch(updateCategory(metricIndex, category, mainCategory));
  },
  updateCategoryDivision: (metricIndex, categoryDivision) => {
    dispatch(updateCategoryDivision(metricIndex, categoryDivision));
  },
  updateCategorySelection: (metricIndex, categorySelection) => {
    dispatch(updateCategorySelection(metricIndex, categorySelection));
  },
  addFilter: (metricIndex) => {
    dispatch(addFilter(metricIndex));
  },
  removeFilter: (metricIndex) => {
    dispatch(removeFilter(metricIndex));
  },
  updateTimeLossFilters: (metricIndex, timeLossFilters) => {
    dispatch(updateTimeLossFilters(metricIndex, timeLossFilters));
  },
  updateSessionTypeFilters: (metricIndex, sessionTypeFilters) => {
    dispatch(updateSessionTypeFilters(metricIndex, sessionTypeFilters));
  },
  updateEventTypeFilters: (metricIndex, eventTypeFilters) => {
    dispatch(updateEventTypeFilters(metricIndex, eventTypeFilters));
  },
  updateTrainingSessionTypeFilters: (
    metricIndex,
    trainingSessionTypeFilters
  ) => {
    dispatch(
      updateTrainingSessionTypeFilters(metricIndex, trainingSessionTypeFilters)
    );
  },
  updateCompetitionFilters: (metricIndex, competitionFilters) => {
    dispatch(updateCompetitionFilters(metricIndex, competitionFilters));
  },
  loadPathologyOptions: (filter, codingSystemKey) => {
    dispatch(searchIssuesPerCoding(filter, codingSystemKey));
  },
  updateMetricStyle: (metricIndex, metricStyle) => {
    dispatch(updateMetricStyle(metricIndex, metricStyle));
  },
  updateMeasurementType: (metricIndex, measurementType) => {
    dispatch(updateMeasurementType(metricIndex, measurementType));
  },
});

const CommonGraphFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonGraphForm);

export default CommonGraphFormContainer;
