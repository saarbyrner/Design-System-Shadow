// @flow

export const parseFromLocation = (locationPathname: string) => {
  /*
   * given the url efile/inbox/:id
   * the id is index 3
   */

  // ['', 'efile', 'inbox', ':id']
  const urlParts = locationPathname.split('/');

  return {
    selectedMenuItem: urlParts[2],
    id: urlParts[3],
  };
};

export default parseFromLocation;
