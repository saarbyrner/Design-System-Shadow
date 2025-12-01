// @flow
import { createContext } from 'react';

export const defaultAssessmentFormVisibility = {
  isAssessmentFormVisible: false,
  setIsAssessmentFormVisible: () => {},
};

const AssessmentFormVisibilityContext = createContext<{
  isAssessmentFormVisible: boolean,
  setIsAssessmentFormVisible: Function,
}>(defaultAssessmentFormVisibility);

export default AssessmentFormVisibilityContext;
