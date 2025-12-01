// @flow
import { useSelector, useDispatch } from 'react-redux';
import { AppStatus } from '@kitman/components';
import { hideAppStatus } from '../components/ChannelSettingsSidePanel/actions';

export default () => {
  const status = useSelector((state) => state.appStatus.status);
  const message = useSelector((state) => state.appStatus.message);
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
