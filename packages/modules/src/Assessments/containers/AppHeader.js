// @flow
import { useSelector, useDispatch } from 'react-redux';
import { AppHeaderTranslated as AppHeader } from '../components/AppHeader';
import {
  deleteTemplate,
  renameTemplate,
  updateViewType,
  selectAthlete,
  fetchAssessments,
  abortFetchingAssessments,
} from '../redux/actions';

import type { ViewType } from '../types';

export default () => {
  const dispatch = useDispatch();
  const assessmentTemplates = useSelector((state) => state.assessmentTemplates);

  const handleClickViewTypeTab = (viewType: ViewType) => {
    if (viewType === 'LIST' || viewType === 'TEMPLATE') {
      // List view auto fetches data, and template does not need the assessments data
      dispatch(abortFetchingAssessments());
    }

    dispatch(updateViewType(viewType));

    if (viewType === 'GRID') {
      dispatch(selectAthlete(null));
      dispatch(
        fetchAssessments({
          athleteIds: null,
          reset: true,
        })
      );
    }
  };

  return (
    <AppHeader
      onClickViewTypeTab={handleClickViewTypeTab}
      assessmentTemplates={assessmentTemplates}
      onClickDeleteTemplate={(templateId) =>
        dispatch(deleteTemplate(templateId))
      }
      onClickRenameTemplate={(templateId, templateName) =>
        dispatch(renameTemplate(templateId, templateName))
      }
    />
  );
};
