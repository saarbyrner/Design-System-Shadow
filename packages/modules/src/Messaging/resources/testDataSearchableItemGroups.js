// @flow
const testDataSearchableItemGroups = {
  staff: [
    {
      display_name: 'Adam Conlan',
      split_searchable_values: ['adam', 'conlan'],
      result_type: 'staff',
      identifier: '6||101',
      user_id: 101,
    },
    {
      display_name: 'Adam Conway',
      split_searchable_values: ['adam', 'conway'],
      result_type: 'staff',
      identifier: '6||102',
      user_id: 102,
    },
    {
      display_name: 'David Keller',
      split_searchable_values: ['david', 'keller'],
      result_type: 'staff',
      identifier: '6||103',
      user_id: 103,
    },
    {
      display_name: 'David Kelly',
      split_searchable_values: ['david', 'kelly'],
      result_type: 'staff',
      identifier: '6||104',
      user_id: 104,
    },
  ],
  athletes: [
    {
      display_name: 'Anto the Athlete',
      split_searchable_values: ['anto', 'the', 'athlete'],
      result_type: 'athlete',
      identifier: '6||105',
      groups: [{ type: 'squad', name: 'Squad A' }],
      user_id: 105,
    },
    {
      display_name: 'Billy Teammates',
      split_searchable_values: ['billy', 'teammates'],
      result_type: 'athlete',
      identifier: '6||106',
      groups: [{ type: 'squad', name: 'Squad B' }],
      user_id: 106,
    },
    {
      display_name: 'Joe Sports Guy (Squad B)',
      split_searchable_values: ['joe', 'sports', 'guy'],
      result_type: 'athlete',
      identifier: '6||107',
      user_id: 107,
    },
  ],
  userChannels: [
    {
      display_name: 'Channel 01',
      split_searchable_values: ['channel', '01'],
      result_type: 'channel',
      identifier: 'ch_01',
    },
    {
      display_name: 'Channel 02',
      split_searchable_values: ['channel', '02'],
      result_type: 'channel',
      identifier: 'ch_02',
    },
    {
      display_name: 'Channel 03',
      split_searchable_values: ['channel', '03'],
      result_type: 'channel',
      identifier: 'ch_03',
    },
  ],
  directChannels: [],
};

export default testDataSearchableItemGroups;
