// @flow
export const parseOrganisationIdFromLocation = (locationPathname: string) => {
  /*
   * giving the url /registration/organisations/1
   * the organisation id is index 3
   */

  // ['', 'registration', 'organisations', 'id']
  const urlParts = locationPathname.split('/');

  return urlParts[3];
};
