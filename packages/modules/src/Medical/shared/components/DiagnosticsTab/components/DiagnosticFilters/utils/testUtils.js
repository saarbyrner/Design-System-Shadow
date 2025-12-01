// @flow

export const orderProviders = {
  staff_providers: [
    {
      sgid: 1236,
      fullname: 'Doctor Who',
    },
    {
      sgid: 1239,
      fullname: 'Dr. Evan Ferguson',
    },
    {
      sgid: 1571,
      fullname: 'Mo Salah PHD',
    },
  ],
  location_providers: [
    {
      sgid: 6542,
      fullname: 'Kevinho de Doocemiento',
    },
    {
      sgid: 9728,
      fullname: 'Rorito Thornaldo',
    },
    {
      sgid: 6725,
      fullname: 'ZeRynaldo',
    },
  ],
};

export const transformedOrderProviders = [
  {
    value: 1236,
    label: 'Doctor Who',
  },
  {
    value: 1239,
    label: 'Dr. Evan Ferguson',
  },
  {
    value: 1571,
    label: 'Mo Salah PHD',
  },

  {
    value: 6542,
    label: 'Kevinho de Doocemiento',
  },
  {
    value: 9728,
    label: 'Rorito Thornaldo',
  },
  {
    value: 6725,
    label: 'ZeRynaldo',
  },
];

export const athleteData = {
  id: 5439,
  fullname: 'Jungle Japes',
  firstname: 'Jungle',
  lastname: 'Japes',
  external_id: 'FDSGFGSF_41235421345_UUID',
  date_of_birth: 'Jan 13, 1990',
};

export const athleteTrialData = {
  ...athleteData,
  org_last_transfer_record: {
    transfer_type: 'Trial',
    joined_at: '2022-12-08T05:04:33',
    left_at: '2022-12-15T05:04:33',
    data_sharing_consent: true,
  },
};

export const issue = {
  ambra_reason_link: {
    custom_field: 'FA41234SFD_CUSTOM_FIELD_UUID_2134231',
  },
  external_identifier: '324134FASDFASD_2315_fasdfsd_32145',
};
export const athleteExternalId = 3894612043421;
export const currentOrganisation = {
  id: 98634,
  ambra_configurations: [
    {
      organisation_id: 98634,
      team_name: 'Jungle Japes FC',
      namespace: 'TEAM_NAMESPACE_UUID_4234134_23421',
      upload_uuid: 'TEAM_UPLOAD_UUID_726263_92221',
      tryout: false,
    },
    {
      organisation_id: null,
      team_name: 'Tryout Players',
      namespace: 'TRYOUT_NAMESPACE_UUID_FSDAF',
      upload_uuid: 'TRYOUT_UPLOAD_UUID_1283718_93843',
      tryout: true,
    },
  ],
};

export const currentUser = {
  id: 2143232,
  firstname: 'Billius',
  lastname: 'The-User',
  username: 'billiusTheUser',
  fullname: 'Billius The-User',
  email: 'billiusTheUser@junglejapes.io',
};
