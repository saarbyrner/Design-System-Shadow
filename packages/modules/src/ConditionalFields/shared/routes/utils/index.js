// @flow
export const parseOrganisationIdFromLocation = (locationPathname: string) => {
  /*
   * giving the url /administration/conditional_fields/organisations/1/*
   * the organisation id is index 4
   */

  // ['', 'administration', 'conditional_fields', 'organisations', 'id', ...]
  const urlParts = locationPathname.split('/');

  return urlParts[4];
};

export const parseRulesetIdFromLocation = (locationPathname: string) => {
  /*
   * giving the url /administration/conditional_fields/organisations/1/rulesets/25/*
   * the rulesets id is index 6
   */

  // ['', 'administration', 'conditional_fields', 'organisations', 'id', 'rulesets', 'id']
  const urlParts = locationPathname.split('/');

  return urlParts[6];
};

export const parseVersionIdFromLocation = (locationPathname: string) => {
  /*
   * giving the url /administration/conditional_fields/organisations/1/rulesets/25/versions/id/*
   * the version id is index 8
   */

  // ['', 'administration', 'conditional_fields', 'organisations', 'id', 'rulesets', 'id', 'versions', 'id']
  const urlParts = locationPathname.split('/');
  return urlParts[8];
};
