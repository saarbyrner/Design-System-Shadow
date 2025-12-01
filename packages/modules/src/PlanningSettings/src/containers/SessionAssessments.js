import { useSelector, useDispatch } from 'react-redux';
import { SessionAssessmentsTranslated as SessionAssessments } from '../components/sessionAssessments';
import {
  clearEditedSessionAssessments,
  getSessionTemplates,
  saveSelectedAssessmentTypes,
  selectAssessmentType,
} from '../redux/actions/sessionAssessments';

export default (props) => {
  const dispatch = useDispatch();
  const editedSessionAssessments = useSelector(
    (state) => state.sessionAssessments.editedSessionAssessments
  );
  const requestStatus = useSelector(
    (state) => state.sessionAssessments.requestStatus
  );
  const sessionAssessments = useSelector(
    (state) => state.sessionAssessments.data
  );

  return (
    <SessionAssessments
      {...props}
      editedSessionAssessments={editedSessionAssessments}
      getSessionTemplates={() => dispatch(getSessionTemplates())}
      onCancelEdit={() => dispatch(clearEditedSessionAssessments())}
      onClickSave={() => dispatch(saveSelectedAssessmentTypes())}
      onSelectAssessmentType={(sessionTypeId, selectedAssessmentTypeArray) =>
        dispatch(
          selectAssessmentType(sessionTypeId, selectedAssessmentTypeArray)
        )
      }
      requestStatus={requestStatus}
      sessionAssessments={sessionAssessments}
    />
  );
};
