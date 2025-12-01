import { useSelector, useDispatch } from 'react-redux';

import CollectionTab from '../components/CollectionTab';
import CollectionTabV2 from '../components/CollectionTabV2';
import {
  clearUpdatedGridRows,
  fetchAssessmentGrid,
  fetchWorkloadGrid,
  fetchAssessmentGroups,
  saveAssessment,
  saveAthleteComments,
  saveAssessmentGridAttributes,
  saveWorkloadGridAttributes,
  setAthleteComments,
  setAthleteLinkedToComments,
  setCommentsPanelViewType,
  setIsCommentsSidePanelOpen,
  setRequestStatus,
  setSelectedGridDetails,
  updateGrid,
  updateGridRow,
  updateAssessment,
} from '../redux/actions';

export default (props) => {
  const dispatch = useDispatch();
  const assessmentTemplates = useSelector(
    (state) => state.planningEvent.assessmentTemplates
  );
  const athleteComments = useSelector(
    (state) => state.planningEvent.comments.athleteComments
  );
  const athleteLinkedToComments = useSelector(
    (state) => state.planningEvent.comments.athleteLinkedToComments
  );
  const commentsPanelViewType = useSelector(
    (state) => state.planningEvent.comments.panelViewType
  );
  const grid = useSelector((state) => state.planningEvent.grid);
  const isCommentsSidePanelOpen = useSelector(
    (state) => state.planningEvent.comments.isPanelOpen
  );
  const selectedGridDetails = useSelector(
    (state) => state.planningEvent.gridDetails
  );
  const requestStatus = useSelector(
    (state) => state.planningEvent.appState.requestStatus
  );
  const assessments = useSelector(
    (state) => state.planningEvent.eventAssessments.assessments
  );

  const Tab = window.getFlag('session-evaluation-coach')
    ? CollectionTabV2
    : CollectionTab;

  return (
    <Tab
      athleteComments={athleteComments}
      athleteLinkedToComments={athleteLinkedToComments}
      clearUpdatedGridRows={() => dispatch(clearUpdatedGridRows)}
      commentsPanelViewType={commentsPanelViewType}
      fetchAssessmentGrid={(
        eventId,
        assessmentGroupId,
        reset,
        nextId,
        filters
      ) =>
        dispatch(
          fetchAssessmentGrid(
            eventId,
            assessmentGroupId,
            reset,
            nextId,
            filters
          )
        )
      }
      fetchWorkloadGrid={(eventId, reset, nextId, filters) =>
        dispatch(fetchWorkloadGrid(eventId, reset, nextId, filters))
      }
      grid={grid}
      isCommentsSidePanelOpen={isCommentsSidePanelOpen}
      onSaveAthleteComments={(comments) =>
        dispatch(saveAthleteComments(comments))
      }
      onSaveAssessmentGridAttributes={(eventId) => {
        dispatch(saveAssessmentGridAttributes(eventId));
      }}
      onSaveWorkloadGridAttributes={(eventId, tab) => {
        dispatch(saveWorkloadGridAttributes(eventId, tab));
      }}
      onSetAthleteComments={(athleteId) => {
        dispatch(setAthleteComments(grid, athleteId));
      }}
      onSetAthleteLinkedToComments={(athlete) => {
        dispatch(setAthleteLinkedToComments(athlete));
      }}
      onSetIsCommentsSidePanelOpen={(isOpen) =>
        dispatch(setIsCommentsSidePanelOpen(isOpen))
      }
      onSetCommentsPanelViewType={(viewType) =>
        dispatch(setCommentsPanelViewType(viewType))
      }
      onSetRequestStatus={(status) => dispatch(setRequestStatus(status))}
      onSetSelectedGridDetails={(gridDetails) =>
        dispatch(setSelectedGridDetails(gridDetails))
      }
      onUpdateGrid={(newGrid) => {
        dispatch(updateGrid(newGrid));
      }}
      onUpdateGridRow={(attributes, rowId) => {
        dispatch(updateGridRow(attributes, rowId));
      }}
      fetchAssessmentGroups={(eventId) =>
        dispatch(fetchAssessmentGroups(eventId))
      }
      assessmentGroups={assessments}
      saveAssessment={(assessment) => dispatch(saveAssessment(assessment))}
      assessmentTemplates={assessmentTemplates}
      requestStatus={requestStatus}
      selectedGridDetails={selectedGridDetails}
      updateAssessment={(assessment, eventId) =>
        dispatch(updateAssessment(assessment, eventId))
      }
      {...props}
    />
  );
};
