/* eslint-disable flowtype/require-valid-file-annotation */
import ReactDOM from 'react-dom';
import { ErrorBoundary } from '@kitman/components';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  getActivityGroups,
  getGrades,
  getPermissions,
  getPositionGroups,
  getSides,
  getIllnessOsicsPathologies,
  getInjuryOsicsPathologies,
  getInjuryOsicsClassifications,
  getInjuryStatuses,
  getIllnessOsicsClassifications,
  getInjuryOsicsBodyAreas,
  getIllnessOsicsBodyAreas,
  getCurrentAssociation,
  getIllnessOnset,
  getInjuryOnset,
} from '@kitman/services';
import { AppTranslated as App } from './src/components/App';

const renderAthleteIssueDetails = (
  athlete,
  issueId,
  formType,
  hideLoadingAnimation
) => {
  if (formType === 'INJURY') {
    Promise.all([
      $.getJSON(
        `/athletes/${athlete.id}/injuries/${issueId}?include_treatments=1`
      ),
      getPermissions(),
      getPositionGroups(),
      getSides(),
      getInjuryOsicsPathologies(),
      getInjuryOsicsClassifications(),
      getInjuryOsicsBodyAreas(),
      getCurrentAssociation(),
      getInjuryOnset(),
      getActivityGroups(),
      getGrades(),
      getInjuryStatuses(),
    ]).then(
      ([
        data,
        permissions,
        positionGroups,
        sides,
        injuryOsicsPathologies,
        injuryOsicsClassifications,
        injuryOsicsBodyAreas,
        association,
        injuryOnset,
        activityGroups,
        bamicGrades,
        injuryStatuses,
      ]) => {
        hideLoadingAnimation('js-athleteIssueDetailsLoader');
        ReactDOM.render(
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App
                athleteName={athlete.full_name}
                issueStatusOptions={injuryStatuses || []}
                currentIssue={data}
                bamicGrades={bamicGrades || []}
                osicsPathologies={injuryOsicsPathologies || []}
                osicsClassifications={injuryOsicsClassifications || []}
                osicsBodyAreas={injuryOsicsBodyAreas || []}
                positionGroups={positionGroups || []}
                issueTypes={injuryOnset || []}
                activityGroups={activityGroups || []}
                sides={sides || []}
                isIssueEditPermitted={permissions.medical?.includes(
                  'issues-admin'
                )}
                periods={association.periods || []}
                periodTerm={association.period_term || ''}
                formType={formType}
              />
            </ErrorBoundary>
          </I18nextProvider>,
          document.getElementById('athleteIssueDetailsContainer')
        );
      },
      () => {} // TODO: handle failure
    );
  } else {
    Promise.all([
      $.getJSON(
        `/athletes/${athlete.id}/illnesses/${issueId}?include_treatments=1`
      ),
      getPermissions(),
      getPositionGroups(),
      getSides(),
      getIllnessOsicsPathologies(),
      getIllnessOsicsClassifications(),
      getIllnessOsicsBodyAreas(),
      getIllnessOnset(),
      getActivityGroups(),
      getInjuryStatuses(),
    ]).then(
      ([
        data,
        permissions,
        positionGroups,
        sides,
        illnessOsicsPathologies,
        illnessOsicsClassifications,
        illnessOsicsBodyAreas,
        illnessOnset,
        activityGroups,
        injuryStatuses,
      ]) => {
        hideLoadingAnimation('js-athleteIssueDetailsLoader');
        ReactDOM.render(
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App
                athleteName={athlete.full_name}
                issueStatusOptions={injuryStatuses || []}
                currentIssue={data}
                osicsPathologies={illnessOsicsPathologies || []}
                osicsClassifications={illnessOsicsClassifications || []}
                osicsBodyAreas={illnessOsicsBodyAreas || []}
                positionGroups={positionGroups || []}
                issueTypes={illnessOnset || []}
                activityGroups={activityGroups || []}
                sides={sides || []}
                isIssueEditPermitted={permissions.medical?.includes(
                  'issues-admin'
                )}
                periods={[]}
                periodTerm=""
                formType={formType}
              />
            </ErrorBoundary>
          </I18nextProvider>,
          document.getElementById('athleteIssueDetailsContainer')
        );
      },
      () => {} // TODO: handle failure
    );
  }
};

// Export render function to be able to render the app on demand
export default renderAthleteIssueDetails;
