// @flow
import { useDispatch, useSelector } from 'react-redux';

import { onSetActiveMenu } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';

import {
  getMenuFactory,
  getActiveMenuState,
  getIsLastMenuGroupFactory,
  getIsLastMenuItemFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';

type ReturnType = {
  isNextDisabled: boolean,
  isPreviousDisabled: boolean,
  onHandleNext: Function,
  onHandlePrevious: Function,
};

const useFormNavigation = (): ReturnType => {
  const dispatch = useDispatch();

  const isLastMenuGroup = useSelector(getIsLastMenuGroupFactory());
  const isLastMenuItem = useSelector(getIsLastMenuItemFactory());

  const rootMenuItems = useSelector(getMenuFactory());
  const { menuGroupIndex, menuItemIndex } = useSelector(getActiveMenuState);

  const isNextDisabled = isLastMenuGroup && isLastMenuItem;

  const isPreviousDisabled = menuItemIndex === 0 && menuGroupIndex === 0;

  const onHandleNext = () => {
    if (isLastMenuItem) {
      dispatch(
        onSetActiveMenu({
          menuGroupIndex: menuGroupIndex + 1,
          menuItemIndex: 0,
        })
      );
    } else {
      dispatch(
        onSetActiveMenu({
          menuGroupIndex,
          menuItemIndex: menuItemIndex + 1,
        })
      );
    }
  };

  const onHandlePrevious = () => {
    if (menuItemIndex === 0) {
      const getStepForPreviousSection =
        rootMenuItems[menuGroupIndex - 1]?.items.length - 1 || 0;

      dispatch(
        onSetActiveMenu({
          menuGroupIndex: menuGroupIndex - 1,
          menuItemIndex: getStepForPreviousSection,
        })
      );
    } else {
      dispatch(
        onSetActiveMenu({
          menuGroupIndex,
          menuItemIndex: menuItemIndex - 1,
        })
      );
    }
  };

  return {
    isNextDisabled,
    isPreviousDisabled,
    onHandleNext,
    onHandlePrevious,
  };
};

export default useFormNavigation;
