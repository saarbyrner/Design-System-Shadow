import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { NotesWidgetSettingsModalTranslated as NotesWidgetSettingsModal } from '../components/NotesWidgetSettingsModal';
import {
  closeNotesWidgetSettingsModal,
  editNotesWidgetSettings,
  saveNotesWidgetSettings,
  setNotesWidgetSettingsPopulation,
  setNotesWidgetSettingsTimePeriod,
  selectAnnotationType,
  unselectAnnotationType,
  updateNotesWidgetSettingsDateRange,
  updateNotesWidgetSettingsTimePeriodLength,
} from '../redux/actions/notesWidgetSettingsModal';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.notesWidgetSettingsModal.isOpen);
  const selectedAnnotationTypes = useSelector(
    (state) => state.notesWidgetSettingsModal.widget_annotation_types
  );
  const selectedEndDate = useSelector(
    (state) => state.notesWidgetSettingsModal.time_scope.end_time
  );
  const selectedPopulation = useSelector(
    (state) => state.notesWidgetSettingsModal.population
  );
  const selectedStartDate = useSelector(
    (state) => state.notesWidgetSettingsModal.time_scope.start_time
  );
  const selectedTimePeriod = useSelector(
    (state) => state.notesWidgetSettingsModal.time_scope.time_period
  );
  const selectedTimePeriodLength = useSelector(
    (state) => state.notesWidgetSettingsModal.time_scope.time_period_length
  );
  const widgetId = useSelector(
    (state) => state.notesWidgetSettingsModal.widgetId
  );

  return (
    <NotesWidgetSettingsModal
      isOpen={isOpen}
      selectedAnnotationTypes={selectedAnnotationTypes}
      selectedDateRange={{
        start_date:
          selectedStartDate ||
          moment().format(DateFormatter.dateTransferFormat), // Is an input to date range picker component
        end_date:
          selectedEndDate || moment().format(DateFormatter.dateTransferFormat), // Is an input to date range picker component
      }}
      selectedPopulation={selectedPopulation}
      selectedTimePeriod={selectedTimePeriod}
      selectedTimePeriodLength={selectedTimePeriodLength}
      widgetId={widgetId}
      onClickCloseModal={() => {
        dispatch(closeNotesWidgetSettingsModal());
      }}
      onClickSaveNotesWidgetSettings={(notesWidgetSettingsId) => {
        if (notesWidgetSettingsId !== null) {
          dispatch(editNotesWidgetSettings(notesWidgetSettingsId));
        } else {
          dispatch(saveNotesWidgetSettings());
        }
      }}
      onSetNotesWidgetSettingsPopulation={(population) => {
        dispatch(setNotesWidgetSettingsPopulation(population));
      }}
      onSetNotesWidgetSettingsTimePeriod={(timePeriod) => {
        dispatch(setNotesWidgetSettingsTimePeriod(timePeriod));
      }}
      onSelectAnnotationType={(annotationTypeId) => {
        dispatch(selectAnnotationType(annotationTypeId));
      }}
      onUnselectAnnotationType={(annotationTypeId) => {
        dispatch(unselectAnnotationType(annotationTypeId));
      }}
      onUpdateNotesWidgetSettingsDateRange={(dateRange) => {
        dispatch(updateNotesWidgetSettingsDateRange(dateRange));
      }}
      onUpdateNotesWidgetSettingsTimePeriodLength={(timePeriodLength) => {
        dispatch(updateNotesWidgetSettingsTimePeriodLength(timePeriodLength));
      }}
      {...props}
    />
  );
};
