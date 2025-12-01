// @flow
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from '@kitman/components';
import { channelSettingsClearToast } from '../components/ChannelSettingsSidePanel/actions';

export default () => {
  const dispatch = useDispatch();
  const toastItems = useSelector((state) => state.toasts.toastItems);
  return (
    <Toast
      items={toastItems || []}
      onClickClose={(toastId) => dispatch(channelSettingsClearToast(toastId))}
      kitmanDesignSystem
    />
  );
};
