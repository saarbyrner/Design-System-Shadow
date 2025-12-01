import { useSelector } from 'react-redux';
import { AppTranslated as App } from '../components/App';

export default (props) => {
  const requestStatus = useSelector((state) => state.app.requestStatus);

  return <App {...props} requestStatus={requestStatus} />;
};
