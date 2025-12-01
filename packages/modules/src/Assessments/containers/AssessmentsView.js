import { useSelector, useDispatch } from 'react-redux';
import AssessmentsView from '../components/AssessmentsView';
import { applyTemplateFilter, fetchAssessments } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const viewType = useSelector((state) => state.viewType);
  const filteredTemplates = useSelector(
    (state) => state.appState.filteredTemplates
  );
  const assessmentTemplates = useSelector((state) => state.assessmentTemplates);
  const selectedAthlete = useSelector(
    (state) => state.appState.selectedAthlete
  );

  const isListView = useSelector((state) => state.viewType) === 'LIST';

  return (
    <AssessmentsView
      viewType={viewType}
      filteredTemplates={filteredTemplates}
      onApplyTemplateFilter={(templates) => {
        dispatch(applyTemplateFilter(templates));
        dispatch(
          fetchAssessments({
            listView: isListView,
            athleteIds: selectedAthlete != null ? [selectedAthlete] : null,
            reset: true,
          })
        );
      }}
      assessmentTemplates={assessmentTemplates}
    />
  );
};
