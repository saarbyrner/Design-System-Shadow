// @flow
import AthletesList from '../../containers/AthletesList';
import AssessmentsList from '../../containers/AssessmentsList';

const ListView = () => {
  return (
    <>
      {!window.featureFlags['assessments-grid-view'] && <AthletesList />}
      <AssessmentsList />
    </>
  );
};

export default ListView;
