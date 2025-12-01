// @flow

export const parseIdFromLocation = (locationPathname: string) => {
  /*
   * given the url /administration/groups/:id/edit
   * the id is index 3
   */

  // ['', 'administration', 'groups', ':id', 'edit']
  const urlParts = locationPathname.split('/');

  return {
    id: urlParts[3],
  };
};

export default parseIdFromLocation;
