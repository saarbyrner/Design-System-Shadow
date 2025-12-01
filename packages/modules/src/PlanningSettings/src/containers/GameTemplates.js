import { useSelector, useDispatch } from 'react-redux';
import { GameTemplatesTranslated as GameTemplates } from '../components/gameTemplates';
import {
  clearEditedGameTemplates,
  getGameTemplates,
  saveGameSelectedAssessmentTypes,
  selectAssessmentType,
} from '../redux/actions/gameTemplates';

export default (props) => {
  const dispatch = useDispatch();
  const editedGameTemplates = useSelector(
    (state) => state.gameTemplates.editedGameTemplates
  );
  const requestStatus = useSelector(
    (state) => state.gameTemplates.requestStatus
  );
  const gameTemplates = useSelector(
    (state) => state.gameTemplates.assessmentTemplates
  );

  return (
    <GameTemplates
      {...props}
      editedGameTemplates={editedGameTemplates}
      getGameTemplates={() => dispatch(getGameTemplates())}
      onCancelEdit={() => dispatch(clearEditedGameTemplates())}
      onClickSave={() => dispatch(saveGameSelectedAssessmentTypes())}
      requestStatus={requestStatus}
      onSelectAssessmentType={(selectedAssessmentTypeArray) =>
        dispatch(selectAssessmentType(selectedAssessmentTypeArray))
      }
      gameTemplates={gameTemplates}
    />
  );
};
