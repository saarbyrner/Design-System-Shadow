// @flow
export const redirectUrl = (userType: ?string) => {
  const parentRoute = window.featureFlags['side-nav-update']
    ? 'administration'
    : 'settings';

  if (window.featureFlags['league-ops-additional-users']) {
    return '/administration/additional_users';
  }
  if (userType === 'scout') {
    return `/${parentRoute}/scouts`;
  }
  if (userType === 'official') {
    return `/${parentRoute}/officials`;
  }
  return '';
};

export const parseFromTypeFromLocation = (url: string) => {
  const regex =
    /^\/administration\/additional_users\/([^/]+)\/(?:([^/]+)\/)?(edit|new)$/;
  const match = url.match(regex);
  if (match) {
    const userType = match[1];
    const id = match[2] || null; // This is the ID (only present in the edit URL)
    const mode = match[3].toUpperCase(); // This is either 'edit' or 'new'
    return { userType, id, mode };
  }
  return {
    userType: null,
    id: null,
    mode: null,
  };
};

export const parseUserType = (type: ?string): string => {
  if (!type) {
    return '';
  }
  const lowercaseType = type.toLowerCase();
  if (lowercaseType === 'matchdirector' || lowercaseType === 'match_director') {
    return 'Match director';
  }
  if (lowercaseType === 'matchmonitor' || lowercaseType === 'match_monitor') {
    return 'Match monitor';
  }
  return type;
};
