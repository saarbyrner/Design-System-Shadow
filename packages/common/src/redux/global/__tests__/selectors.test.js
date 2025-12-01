import {
  getOrganisationResult,
  getOrganisation,
  getPermissionsResult,
  getPermissions,
  getPermissionGroupFactory,
  getCurrentUserResult,
  getCurrentUser,
} from '../selectors';

const MOCK_CURRENT_USER = {
  id: 11111,
  firstname: 'Hacksaw Jim',
  lastname: 'Duggan',
  fullname: 'Hacksaw Jim Duggan',
  email: 'hacksawjimduggan@kitmanlabs.com',
  registration: {
    id: 161454,
    user_type: 'association_admin',
    required: false,
    status: null,
  },
  type: null,
};

const MOCK_ORGANISATION = {
  id: 1261,
  active: true,
  attachment: {
    id: 283559,
    short_identifier: null,
    location: 'kitman-staff/kitman-staff_283559',
    name: null,
    bucket: 'injpro-staging-public',
    filetype: 'image/png',
    filesize: 74502,
    notes: [],
    organisation_id: null,
    created_by: null,
    created: '2023-06-15T07:11:12.000-05:00',
    updated: '2023-06-15T07:11:12.000-05:00',
    attachment_updated_at: null,
    original_filename: 'Arp-Madore_1_283559',
    is_private: false,
    attachable_type: null,
    attachable_id: null,
    confirmed: true,
    squad_id: null,
    archived_at: null,
    archive_reason_id: null,
    archived_by: null,
  },
  name: 'KLS',
  handle: 'kls',
  logo_path: 'kitman-staff/kitman-staff_283559',
  logo_full_path:
    'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_283559?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
  shortname: 'KLS',
  timezone: 'EST',
  locale: 'en-IE',
  localisation_id: 3,
  sport_id: 1,
  logo: null,
  last_privacy_policy: null,
  coding_system_key: 'osics_10',
  coding_system: {
    id: 2,
    name: 'OSICS-10',
    key: 'osics_10',
  },
  redox_orderable: false,
  extended_attributes: {},
  address: null,
  association_admin: true,
  ambra_configurations: [],
  ip_for_government: false,
};

const MOCK_PERMISSIONS = {
  registration: {
    registrationArea: {
      canView: true,
    },
    organisation: {
      canView: true,
    },
    athlete: {
      canView: true,
      canEdit: false,
    },
    staff: {
      canView: true,
      canEdit: false,
    },
    requirements: {
      canView: true,
    },
    status: {
      canEdit: true,
    },
    payment: {
      canView: true,
      canEdit: false,
      canCreate: false,
    },
  },
};

const MOCK_STATE = {
  globalApi: {
    queries: {
      'getPermissions(undefined)': {
        data: {
          ...MOCK_PERMISSIONS,
        },
      },
      'getOrganisation(undefined)': {
        data: {
          ...MOCK_ORGANISATION,
        },
      },
      'getCurrentUser(undefined)': {
        data: {
          ...MOCK_CURRENT_USER,
        },
      },
    },
  },
};

describe('[globalApi] - selectors', () => {
  test('getOrganisationResult()', () => {
    const selector = getOrganisationResult;
    expect(selector(MOCK_STATE).data).toStrictEqual(MOCK_ORGANISATION);
  });
  test('getOrganisation()', () => {
    const selector = getOrganisation();
    expect(selector(MOCK_STATE)).toStrictEqual(MOCK_ORGANISATION);
  });
  test('getPermissionsResult()', () => {
    const selector = getPermissionsResult;
    expect(selector(MOCK_STATE).data).toStrictEqual(MOCK_PERMISSIONS);
  });
  test('getPermissions()', () => {
    const selector = getPermissions();
    expect(selector(MOCK_STATE)).toStrictEqual(MOCK_PERMISSIONS);
  });
  test('getPermissionGroupFactory()', () => {
    const selector = getPermissionGroupFactory('registration');
    expect(selector(MOCK_STATE)).toBe(MOCK_PERMISSIONS.registration);
  });
  test('getPermissionGroupFactory() with incorrect key', () => {
    const selector = getPermissionGroupFactory('medical');
    expect(selector(MOCK_STATE)).toStrictEqual({});
  });
  test('getCurrentUserResult()', () => {
    const selector = getCurrentUserResult;
    expect(selector(MOCK_STATE).data).toStrictEqual(MOCK_CURRENT_USER);
  });
  test('getCurrentUser() with incorrect key', () => {
    const selector = getCurrentUser();
    expect(selector(MOCK_STATE)).toStrictEqual(MOCK_CURRENT_USER);
  });
});
