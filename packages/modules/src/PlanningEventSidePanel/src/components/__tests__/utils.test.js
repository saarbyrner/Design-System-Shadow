import {
  activeOrganisationSort,
  noActiveOrganisationSort,
} from '../common/utils';

describe('utils', () => {
  const organisationData = {
    'New Orleans Saints': [
      {
        id: 258,
        name: 'Occhsner Sports Performance Center - New Orleans Saints Practice Facility - Outdoor',
        is_active: true,
        is_owned_by_org: false,
        organisation_name: 'New Orleans Saints',
      },
    ],
    'ZNew York Giants': [
      {
        id: 262,
        name: 'Quest Diagnostics Training Center - Outdoor',
        is_active: true,
        is_owned_by_org: false,
        organisation_name: 'New York Giants',
      },
    ],
    Other: [
      {
        id: 290,
        name: 'Wembley',
        is_active: true,
        is_owned_by_org: false,
        organisation_name: null,
      },
    ],
    'Las Vegas Raiders': [
      {
        id: 202,
        name: 'Raiders Headquarters / Intermountain Healthcare Performance Center - Indoor',
        is_active: true,
        is_owned_by_org: false,
        organisation_name: 'Las Vegas Raiders',
      },
      {
        id: 203,
        name: 'Raiders Headquarters / Intermountain Healthcare Performance Center - Outdoor',
        is_active: true,
        is_owned_by_org: false,
        organisation_name: 'Las Vegas Raiders',
      },
    ],
  };

  it('correctly sorts data when no active organisation', () => {
    expect(
      Object.keys(organisationData).sort((a, b) => {
        return noActiveOrganisationSort(a, b, ['Other']);
      })
    ).toMatchObject([
      'Las Vegas Raiders',
      'New Orleans Saints',
      'ZNew York Giants',
      'Other',
    ]);
  });
  it('correctly sorts data when there is an active organisation', () => {
    organisationData['Washington Commanders'] = {
      id: 273,
      name: 'Bon Secure - Outdoor',
      is_active: true,
      is_owned_by_org: true,
      organisation_name: 'Washington Commanders',
    };
    expect(
      Object.keys(organisationData).sort((a, b) => {
        return activeOrganisationSort(
          a,
          b,
          ['Washington Commanders', 'Other'],
          'Washington Commanders'
        );
      })
    ).toMatchObject([
      'Washington Commanders',
      'Las Vegas Raiders',
      'New Orleans Saints',
      'ZNew York Giants',
      'Other',
    ]);
  });
});
