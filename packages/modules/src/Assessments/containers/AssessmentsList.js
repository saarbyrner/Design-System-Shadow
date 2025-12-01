import { useSelector, useDispatch } from 'react-redux';
import { AssessmentsListTranslated as AssessmentsList } from '../components/AssessmentsList';
import {
  deleteAssessment,
  deleteAssessmentItem,
  saveAssessmentItem,
  saveAssessment,
  saveTemplate,
  deleteTemplate,
  renameTemplate,
  applyTemplateFilter,
  updateTemplate,
  fetchAssessments,
  saveAssessmentItemsOrder,
  saveAssessmentAthletes,
  saveAssessmentItemComments,
  saveMetricScores,
  requestFailure,
  fetchAssessmentWithAnswers,
} from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const viewType = useSelector((state) => state.viewType);
  const filteredTemplates = useSelector(
    (state) => state.appState.filteredTemplates
  );
  const assessments = useSelector((state) => state.assessments);
  const assessmentsRequestStatus = useSelector(
    (state) => state.appState.assessmentsRequestStatus
  );
  const assessmentTemplates = useSelector((state) => state.assessmentTemplates);
  const organisationTrainingVariables = useSelector(
    (state) => state.organisationTrainingVariables
  );
  const statusVariables = useSelector((state) => state.statusVariables);
  const turnaroundList = useSelector((state) => state.turnaroundList);
  const users = useSelector((state) => state.users);
  const selectedAthlete = useSelector(
    (state) => state.appState.selectedAthlete
  );
  const nextAssessmentId = useSelector(
    (state) => state.appState.nextAssessmentId
  );

  const isListView = useSelector((state) => state.viewType) === 'LIST';

  return (
    <AssessmentsList
      viewType={viewType}
      assessments={assessments}
      selectedAthlete={selectedAthlete}
      filteredTemplates={filteredTemplates}
      onClickDeleteAssessment={(assessmentId) =>
        dispatch(deleteAssessment(assessmentId, selectedAthlete))
      }
      deleteAssessmentItem={(assessmentId, assessmentItemId) =>
        dispatch(deleteAssessmentItem(assessmentId, assessmentItemId))
      }
      onClickSaveAssessment={(assessment) =>
        dispatch(saveAssessment(assessment))
      }
      onClickSaveAthletes={(assessmentId, athletes) =>
        dispatch(saveAssessmentAthletes(assessmentId, athletes))
      }
      saveAssessmentItem={(assessmentId, assessmentItem) =>
        dispatch(
          saveAssessmentItem(assessmentId, assessmentItem, selectedAthlete)
        )
      }
      saveAssessmentItemComments={(assessmentId, comments) =>
        dispatch(saveAssessmentItemComments(assessmentId, comments))
      }
      saveMetricScores={(assessmentId, scores) =>
        dispatch(saveMetricScores(assessmentId, scores))
      }
      onClickSaveTemplate={(template) =>
        dispatch(saveTemplate(template, selectedAthlete))
      }
      /* onClickDeleteTemplate and onClickRenameTemplate props should be removed
        when window.featureFlags['assessments-grid-view'] would be deleted
        because this functionality will be just handled by the TemplateList container */
      onClickDeleteTemplate={(templateId) =>
        dispatch(deleteTemplate(templateId))
      }
      onClickRenameTemplate={(templateId, templateName) =>
        dispatch(renameTemplate(templateId, templateName))
      }
      onClickUpdateTemplate={(assessmentId, assessmentTemplate) =>
        dispatch(
          updateTemplate(assessmentId, assessmentTemplate, selectedAthlete)
        )
      }
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
      onClickSaveReordering={(assessmentId, orderedItemIds) =>
        dispatch(saveAssessmentItemsOrder(assessmentId, orderedItemIds))
      }
      onErrorCalculatingStatusValues={() => dispatch(requestFailure())}
      fetchItemAnswers={(assessmentId) =>
        dispatch(fetchAssessmentWithAnswers(assessmentId))
      }
      assessmentTemplates={assessmentTemplates}
      organisationTrainingVariables={organisationTrainingVariables}
      statusVariables={statusVariables}
      turnaroundList={turnaroundList}
      users={users}
      fetchAssessments={() => {
        dispatch(
          fetchAssessments({
            listView: isListView,
            athleteIds: selectedAthlete != null ? [selectedAthlete] : null,
            reset: false,
          })
        );
      }}
      isFullyLoaded={
        assessmentsRequestStatus !== 'PENDING' && !nextAssessmentId
      }
      isLoading={assessmentsRequestStatus !== 'SUCCESS'}
    />
  );
};
