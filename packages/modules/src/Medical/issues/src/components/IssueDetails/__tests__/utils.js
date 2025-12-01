// @flow
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';

export const MOCK_ORGANISATION_OSIICS10 = {
  id: 1261,
  active: true,
  attachment: {},
  name: 'KLS',
  handle: 'kls',
  logo_path: 'kitman-staff/kitman-staff_283559',
  logo_full_path: 'path',
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

export const MOCK_ORGANISATION_OSIICS15 = {
  id: 1241,
  active: true,
  attachment: {},
  name: 'Man Utd',
  handle: 'mtd',
  logo_path: 'kitman-staff/kitman-staff_283559',
  logo_full_path: 'path',
  shortname: 'MTD',
  timezone: 'EST',
  locale: 'en-IE',
  localisation_id: 3,
  sport_id: 1,
  logo: null,
  last_privacy_policy: null,
  coding_system: {
    id: 5,
    name: 'OSIICS-15',
    key: 'osiics_15',
  },
  coding_system_key: codingSystemKeys.OSIICS_15,
  redox_orderable: false,
  extended_attributes: {},
  address: null,
  association_admin: true,
  ambra_configurations: [],
  ip_for_government: false,
};

// organisation.coding
export const MOCK_OSIICS15_CODING = {
  pathologies: [
    {
      id: 1592,
      code: 'WUPM',
      pathology: 'RED-S (Relative Energy Deficiency in Sport)',
      coding_system_version: {
        id: 5,
        coding_system: {
          id: 5,
          name: 'OSIICS-15',
          key: 'osiics_15',
        },
        name: 'OSIICS-15.1',
        order: null,
      },
      coding_system_body_region: {
        id: 2,
        coding_system_id: 6,
        name: 'Head and neck',
      },
      coding_system_body_part: null,
      coding_system_body_area: {
        id: 4,
        coding_system_id: 5,
        coding_system_body_region: {
          id: 2,
          coding_system_id: 6,
          name: 'Head and neck',
        },
        name: 'Upper arm',
      },
      coding_system_tissue: {
        id: 10,
        coding_system_id: 6,
        name: 'Cartilage/synovium/bursa ',
      },
      coding_system_classification: {
        id: 24,
        coding_system_id: 6,
        name: 'Bone contusion  ',
      },
      coding_system_side: { side_name: 'Center', coding_system_side_id: 111 },
    },
  ],
};
