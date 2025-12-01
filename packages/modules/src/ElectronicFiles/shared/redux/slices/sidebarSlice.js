// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { State, PayloadAction } from '@reduxjs/toolkit';

export const MENU_ITEM = {
  inbox: 'inbox',
  sent: 'sent',
  contacts: 'contacts',
};

export type MenuItemKey = $Keys<typeof MENU_ITEM>;

type SidebarSlice = {
  expanded: boolean,
  selectedMenuItem: MenuItemKey,
};

const defaultMenuItem = () => {
  const hash = window.location.hash;
  const menuItem = hash.replace('#', '');
  if (Object.keys(MENU_ITEM).includes(menuItem)) {
    return menuItem;
  }
  return MENU_ITEM.inbox;
};

export const initialState: SidebarSlice = {
  expanded: true,
  selectedMenuItem: defaultMenuItem(),
};

export const REDUCER_KEY: string = 'sidebarSlice';

const sidebarSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    updateExpanded: (state: SidebarSlice, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
    updateSelectedMenuItem: (
      state: SidebarSlice,
      action: PayloadAction<MenuItemKey>
    ) => {
      state.selectedMenuItem = action.payload;
    },
    reset: () => initialState,
  },
});

export const { updateExpanded, updateSelectedMenuItem, reset } =
  sidebarSlice.actions;

export const selectExpanded = (state: State) => state.sidebarSlice.expanded;
export const selectSelectedMenuItem = (state: State) =>
  state.sidebarSlice.selectedMenuItem;

export default sidebarSlice;
