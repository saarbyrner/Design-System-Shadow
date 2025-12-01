import { useSelector, useDispatch } from 'react-redux';
import { AppStatus } from '@kitman/components';
import { hideAppStatus } from '../actions';
import { REDUCER_KEY } from '../redux/reducers/appStatus';

export default () => {
  const status = useSelector((state) => state[REDUCER_KEY].status);
  const message = useSelector((state) => state[REDUCER_KEY].message);
  const dispatch = useDispatch();
  return (
    <AppStatus
      status={status}
      message={message}
      close={() => {
        dispatch(hideAppStatus());
      }}
    />
  );
};
