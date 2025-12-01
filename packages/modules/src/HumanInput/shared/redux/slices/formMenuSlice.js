// ADR: packages/modules/src/HumanInput/shared/documentation/adr/001.registration-form-state.md

// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  HumanInputFormElement,
  FormMenuItem,
} from '@kitman/modules/src/HumanInput/types/forms';
import { parseFormMenu } from '@kitman/modules/src/HumanInput/shared/utils';

export type FormMenuState = {
  menu: FormMenuItem,
  drawer: {
    isOpen: boolean,
  },
  active: {
    menuGroupIndex: number,
    menuItemIndex: number,
  },
};

export const REDUCER_KEY: string = 'formMenuSlice';

export const initialState: FormMenuState = {
  menu: {},
  drawer: {
    isOpen: true,
  },
  active: {
    menuGroupIndex: 0,
    menuItemIndex: 0,
  },
};

type OnBuildFormMenu = {
  payload: {
    elements: Array<HumanInputFormElement>,
  },
};

type OnSetActiveMenu = {
  payload: {
    menuGroupIndex: number,
    menuItemIndex?: number,
  },
};

const formMenuSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onBuildFormMenu: (
      state: FormMenuState,
      action: PayloadAction<OnBuildFormMenu>
    ) => {
      state.menu = Object.assign(
        {},
        ...parseFormMenu({ formElements: action.payload.elements })
      );
    },
    onToggleDrawer: (state: FormMenuState) => {
      state.drawer.isOpen = !state.drawer.isOpen;
    },
    onCloseDrawer: (state: FormMenuState) => {
      state.drawer.isOpen = false;
    },
    onOpenDrawer: (state: FormMenuState) => {
      state.drawer.isOpen = true;
    },
    onSetActiveMenu: (
      state: FormMenuState,
      action: PayloadAction<OnSetActiveMenu>
    ) => {
      state.active.menuGroupIndex = action.payload.menuGroupIndex;
      state.active.menuItemIndex = action?.payload?.menuItemIndex || 0;
    },
  },
});

export const {
  onToggleDrawer,
  onSetActiveMenu,
  onBuildFormMenu,
  onOpenDrawer,
  onCloseDrawer,
} = formMenuSlice.actions;

export default formMenuSlice;
