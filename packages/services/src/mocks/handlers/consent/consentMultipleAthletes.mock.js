// @flow
import type { Consent } from '@kitman/common/src/types/Consent';

export type RequestResponse = {
  data: Array<Consent>,
};

export const data: RequestResponse = {
  data: [
    {
      id: 7,
      athlete_id: 1,
      consentable_type: 'Organisation',
      consentable_id: 1,
      consenting_to: 'injury_surveillance_export',
      start_date: '2024-05-14T23:00:00.000Z',
      end_date: '2024-05-14T23:00:00.000Z',
      archive_reason: null,
      archived_on: null,
      archived_by: null,
      created_by: {
        id: 1,
        firstname: 'Default',
        lastname: 'User',
        fullname: 'Default User',
      },
      created_at: '2024-05-10T08:31:42Z',
      updated_at: '2024-05-10T08:31:42Z',
    },
    {
      id: 77,
      athlete_id: 2,
      consentable_type: 'Organisation',
      consentable_id: 1,
      consenting_to: 'injury_surveillance_export',
      start_date: '2024-05-14T23:00:00.000Z',
      end_date: '2024-05-14T23:00:00.000Z',
      archive_reason: null,
      archived_on: null,
      archived_by: null,
      created_by: {
        id: 1,
        firstname: 'Default',
        lastname: 'User',
        fullname: 'Default User',
      },
      created_at: '2024-05-14T23:00:00.000Z',
      updated_at: '2024-05-14T23:00:00.000Z',
    },
    {
      id: 66,
      athlete_id: 7,
      consentable_type: 'Organisation',
      consentable_id: 1,
      consenting_to: 'injury_surveillance_export',
      start_date: '2024-05-14T23:00:00.000Z',
      end_date: '2024-05-14T23:00:00.000Z',
      archive_reason: null,
      archived_on: null,
      archived_by: null,
      created_by: {
        id: 1,
        firstname: 'Default',
        lastname: 'User',
        fullname: 'Default User',
      },
      created_at: '2024-05-14T23:00:00.000Z',
      updated_at: '2024-05-14T23:00:00.000Z',
    },
    {
      id: 99,
      athlete_id: 8,
      consentable_type: 'Organisation',
      consentable_id: 1,
      consenting_to: 'injury_surveillance_export',
      start_date: '2024-05-14T23:00:00.000Z',
      end_date: '2024-05-14T23:00:00.000Z',
      archive_reason: null,
      archived_on: null,
      archived_by: null,
      created_by: {
        id: 1,
        firstname: 'Default',
        lastname: 'User',
        fullname: 'Default User',
      },
      created_at: '2024-05-10T08:31:42Z',
      updated_at: '2024-05-10T08:31:42Z',
    },
  ],
};

export const response = {
  data,
};
