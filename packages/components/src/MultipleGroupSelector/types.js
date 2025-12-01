// @flow
export type GroupItem = {
  id: string,
  name: string,
  subItems: Array<GroupItem>,
};

export type GroupItems = Array<GroupItem>;

export type GroupSelections = {
  [id: string | number]: Array<string>,
};
