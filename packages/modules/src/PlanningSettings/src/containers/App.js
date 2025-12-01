import { useSelector, useDispatch } from 'react-redux';
import { AppTranslated as App } from '../components/App';
import { getAssessmentTemplates } from '../redux/actions/app';

export default (props) => {
  const dispatch = useDispatch();
  const assessmentTemplates = useSelector(
    (state) => state.app.assessmentTemplates
  );
  const requestStatus = useSelector((state) => state.app.requestStatus);

  return (
    <App
      {...props}
      assessmentTemplates={assessmentTemplates}
      getAssessmentTemplates={() => dispatch(getAssessmentTemplates())}
      requestStatus={requestStatus}
    />
  );
};
