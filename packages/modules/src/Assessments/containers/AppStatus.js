import { useSelector } from 'react-redux';
import { AppStatus } from '@kitman/components';

export default () => {
  const appStatus = useSelector((state) => state.appStatus);

  return <AppStatus status={appStatus.status} />;
};
