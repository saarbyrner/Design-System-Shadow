// @flow
export type StaffUserType = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};
export type StaffUserTypes = Array<StaffUserType>;

export type StaffUserSelectOption = {
  value: number,
  label: string,
  firstname: string,
  lastname: string,
};
