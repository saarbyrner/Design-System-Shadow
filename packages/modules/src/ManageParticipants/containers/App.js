import { useSelector, useDispatch } from 'react-redux';
import { AppTranslated as App } from '../components/App';
import { hideAppStatus } from '../redux/actions/appStatus';

export default () => {
  const dispatch = useDispatch();

  const event = useSelector((state) => state.participantForm.event);
  const appStatus = useSelector((state) => state.appStatus);

  return (
    <App
      event={event}
      appStatus={appStatus}
      onClickHideAppStatus={() => {
        dispatch(hideAppStatus());
      }}
    />
  );
};
