// @flow
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { remove, reset } from './toastsSlice';

const Toasts = () => {
  const toasts = useSelector((state) => state.toastsSlice.value);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <ToastDialog
      toasts={toasts}
      onCloseToast={(toastIndex) => dispatch(remove(toastIndex))}
    />
  );
};

export default Toasts;
