// @flow

export const newEventImportTypeAndVendorMock = {
  type: 'FILE',
  fileData: {
    source: 'aurora-ring',
  },
};

export const newEventImportTypeAndAPIMock = {
  type: 'INTEGRATION',
  integrationData: {
    name: 'StatSports',
  },
};

export const athleteFiltersAndSortingMock = {
  filters: {
    athleteName: '',
    positions: [3],
    squads: [4],
    availabilities: ['absent'],
    participationLevels: [],
  },
  sortBy: 'primary_squad',
};
