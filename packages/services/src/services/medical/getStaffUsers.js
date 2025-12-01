// @flow
import $ from 'jquery';
import { axios } from '@kitman/common/src/utils/services';

export type StaffUserType = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  email?: string,
};
export type StaffUserTypes = Array<StaffUserType>;

export const getStaffUsersRoute = '/users/staff_only';

const getStaffUsers = (): Promise<StaffUserTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: getStaffUsersRoute,
    })
      .done(resolve)
      .fail(reject);
  });
};

export const getStaffUsersBySquad = async (
  squadId: number
): Promise<StaffUserTypes> => {
  const { data } = await axios.get(`/squads/${squadId}/staff_users`);
  return data;
};

export default getStaffUsers;
