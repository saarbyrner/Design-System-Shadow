// @flow
import { USER_TYPE } from '../constants/index';

export const parseFromTypeFromLocation = (locationPathname: string) => {
  /*
   * given the url /administration/scouts/:id/edit
   * the user_type is index 2
   * the id is index 1
   */

  // ['', 'administration', 'scouts', ':id', 'edit']
  const urlParts = locationPathname.split('/');

  return {
    // remove the plural s from "scouts",
    userType: USER_TYPE[urlParts[2]],
    id: urlParts[3],
  };
};
