// @flow
// Logic for when there is an active company is the active organisation:
// 1). The active company should be first
// 2). All organisation's should follow alphabetically
// 3). 'Other should be sorted to the bottom
export const activeOrganisationSort = (
  a: string,
  b: string,
  exceptions: Array<string>,
  activeOrg: string
) => {
  if (exceptions.includes(a) && exceptions.includes(b)) {
    return a === activeOrg ? -1 : 1;
  }
  if (exceptions.includes(a)) {
    return a === activeOrg ? -1 : 1;
  }
  if (exceptions.includes(b)) {
    return b === activeOrg ? 1 : -1;
  }

  return a.localeCompare(b);
};

// Logic for when there is an active company is no active organisation:
// 1). All organisation's should follow alphabetically
// 2). 'Other should be sorted to the bottom
export const noActiveOrganisationSort = (
  a: string,
  b: string,
  exceptions: Array<string>
) => {
  if (exceptions.includes(a) && exceptions.includes(b)) {
    return 0;
  }
  if (exceptions.includes(a)) {
    return 1;
  }
  if (exceptions.includes(b)) {
    return -1;
  }

  return a.localeCompare(b);
};
