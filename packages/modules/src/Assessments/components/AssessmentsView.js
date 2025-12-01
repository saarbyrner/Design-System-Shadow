// @flow
import { useState } from 'react';
import AthletesList from '../containers/AthletesList';
import { AssessmentsHeaderTranslated as AssessmentsHeader } from './AssessmentsHeader';
import ListView from './listView/ListView';
import GridView from './gridView/GridView';
import AssessmentFormVisibilityContext from '../contexts/AssessmentFormVisibilityContext';

import type { ViewType, AssessmentTemplate } from '../types';

type Props = {
  viewType: ViewType,
  assessmentTemplates: Array<AssessmentTemplate>,
  filteredTemplates: Array<number>,
  onApplyTemplateFilter: Function,
};

const AssessmentsView = (props: Props) => {
  const [isAssessmentFormVisible, setIsAssessmentFormVisible] = useState(false);

  return (
    <div className="assessmentsView">
      {props.viewType === 'LIST' && <AthletesList />}
      <div>
        <AssessmentsHeader
          onClickAddAssessment={() => setIsAssessmentFormVisible(true)}
          assessmentTemplates={props.assessmentTemplates}
          onApplyTemplateFilter={props.onApplyTemplateFilter}
          filteredTemplates={props.filteredTemplates}
        />
        <AssessmentFormVisibilityContext.Provider
          value={{
            isAssessmentFormVisible,
            setIsAssessmentFormVisible,
          }}
        >
          {props.viewType === 'LIST' && <ListView />}
          {props.viewType === 'GRID' && <GridView />}
        </AssessmentFormVisibilityContext.Provider>
      </div>
    </div>
  );
};

export default AssessmentsView;
