// @flow
import { createSelector } from '@reduxjs/toolkit';

import type {
  FormMenu,
  Store,
} from '@kitman/modules/src/HumanInput/types/forms';

import { REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';

export const getMenuState = (state: Store): FormMenu => state[REDUCER_KEY].menu;

export const getDrawerState = (state: Store): FormMenu =>
  state[REDUCER_KEY].drawer;

export const getActiveMenuState = (
  state: Store
): { menuGroupIndex: number, menuItemIndex: number } =>
  state[REDUCER_KEY].active;

export const getDrawerIsOpenFactory = () =>
  createSelector([getDrawerState], (drawerState) => drawerState.isOpen);

export const getMenuFactory = () =>
  createSelector([getMenuState], (menuState) => menuState?.items || []);

export const getActiveMenuGroupFactory = () =>
  createSelector(
    [getActiveMenuState],
    (activeState) => activeState.menuGroupIndex
  );

export const getActiveMenuItemFactory = () =>
  createSelector(
    [getActiveMenuState],
    (activeState) => activeState.menuItemIndex
  );

export const getIsLastMenuGroupFactory = (): boolean =>
  createSelector(
    [getMenuFactory(), getActiveMenuGroupFactory()],
    (menu, menuGroupIndex) => {
      return menu.length - 1 === menuGroupIndex;
    }
  );

export const getIsLastMenuItemFactory = (): boolean =>
  createSelector(
    [getMenuFactory(), getActiveMenuGroupFactory(), getActiveMenuItemFactory()],
    (menu, menuGroupIndex, menuItemIndex) => {
      return menu[menuGroupIndex]?.items.length - 1 === menuItemIndex;
    }
  );
