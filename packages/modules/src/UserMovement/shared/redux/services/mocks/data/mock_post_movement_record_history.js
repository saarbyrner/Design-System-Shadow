const mockAthlete = {
  firstname: 'Roy',
  id: 11111,
  lastname: 'Keane',
  user_id: 11111,
  username: 'keano',
};

export const data = [
  {
    athlete: mockAthlete,
    data_sharing_consent: true,
    registration_data_sharing: true,
    id: 6,
    joined_at: '2006-07-01T04:50:10-05:00',
    left_at: null,
    organisation: {
      id: 118,
      logo_full_path:
        'https://ssl.gstatic.com/onebox/media/sports/logos/2d1R7XIFALAHj2A9ECBJeA_48x48.png',
      name: 'Celtic FC',
    },
    transfer_type: 'retire',
  },
  {
    athlete: mockAthlete,
    data_sharing_consent: true,
    registration_data_sharing: true,
    id: 5,
    joined_at: '2006-01-01T04:50:10-05:00',
    left_at: '01/07/2006',
    organisation: {
      id: 118,
      logo_full_path:
        'https://ssl.gstatic.com/onebox/media/sports/logos/2d1R7XIFALAHj2A9ECBJeA_48x48.png',
      name: 'Celtic FC',
    },
    transfer_type: 'trade',
  },
  {
    athlete: mockAthlete,
    data_sharing_consent: true,
    registration_data_sharing: true,
    id: 4,
    joined_at: '1993-07-01T04:50:10-05:00',
    left_at: '01/01/2006',
    organisation: {
      id: 118,
      logo_full_path:
        'https://ssl.gstatic.com/onebox/media/sports/logos/udQ6ns69PctCv143h-GeYw_48x48.png',
      name: 'Manchester United',
    },
    transfer_type: 'trade',
  },
  {
    athlete: mockAthlete,
    data_sharing_consent: true,
    registration_data_sharing: true,
    id: 3,
    joined_at: '1989-07-01T04:50:10-05:00',
    left_at: '30/06/1990',
    organisation: {
      id: 117,
      logo_full_path:
        'https://ssl.gstatic.com/onebox/media/sports/logos/Zr6FbE-8pDH7UBpWCO8U9A_48x48.png',
      name: 'Nottingham Forest',
    },
    transfer_type: 'trade',
  },
  {
    athlete: mockAthlete,
    data_sharing_consent: true,
    registration_data_sharing: true,
    id: 2,
    joined_at: '1989-07-01T04:50:10-05:00',
    left_at: '30/06/1990',
    organisation: {
      id: 115,
      logo_full_path:
        'https://tmssl.akamaized.net/images/wappen/head/7039.png?lm=1423677521',
      name: 'Cobh Ramblers',
    },
    transfer_type: 'trade',
  },
  {
    athlete: mockAthlete,
    data_sharing_consent: true,
    registration_data_sharing: true,
    id: 1,
    joined_at: '1988-07-01T04:50:10-05:00',
    left_at: '30/06/1989',
    organisation: {
      id: 116,
      logo_full_path:
        'https://tmssl.akamaized.net/images/wappen/head/28894.png?lm=1621179689',
      name: 'Rockmount AFC',
    },
    transfer_type: 'trade',
  },
];

export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

export const response = {
  data,
  meta,
};
