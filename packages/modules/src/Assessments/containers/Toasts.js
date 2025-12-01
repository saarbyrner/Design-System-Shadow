import { useSelector, useDispatch } from 'react-redux';
import { Toast } from '@kitman/components';
import { removeToast } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const toastItems = useSelector((state) => state.toasts);

  return (
    <Toast
      items={toastItems}
      onClickClose={(toastId) => dispatch(removeToast(toastId))}
    />
  );
};
