// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import SessionAssessments from '../containers/SessionAssessments';
import GameTemplates from '../containers/GameTemplates';
import type { AssessmentTemplate } from '../../types';

type Props = {
  assessmentTemplates: Array<AssessmentTemplate>,
  getAssessmentTemplates: Function,
  requestStatus: 'LOADING' | 'FAILURE' | 'SUCCESS',
};

const App = (props: I18nProps<Props>) => {
  useEffect(() => {
    props.getAssessmentTemplates();
  }, []);

  switch (props.requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'LOADING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <div className="planningSettings">
          <header className="planningSettings__header">
            <div className="planningSettings__headerContent">
              <h6 className="planningSettings__headerTitle">
                {props.t('Library')}
              </h6>
              <p className="planningSettings__headerDescription">
                {props.t('Settings only apply to this squad')}
              </p>
            </div>
          </header>

          <div className="planningSettings__sections">
            <div className="planningSettings__section planningSettings__section--gameTemplates">
              <GameTemplates assessmentTemplates={props.assessmentTemplates} />
            </div>

            <div className="planningSettings__section planningSettings__section--sessionAssessments">
              <SessionAssessments
                assessmentTemplates={props.assessmentTemplates}
              />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export const AppTranslated = withNamespaces()(App);
export default App;
