import formatSessionsTypesOptions from '../formatSessionsTypesOptions';

describe('formatSessionsTypesOptions', () => {
  it('formats sessions types to the <GroupedDropdown /> items format', () => {
    const activityGroupOptions = [
      {
        id: 4,
        name: 'Rugby training',
        event_type: 'Training',
        activities: [
          { name: 'Conditionning', id: 0 },
          { name: 'Polyometrics', id: 1 },
        ],
      },
      {
        id: 7,
        name: 'Rugby games',
        event_type: 'Game',
        activities: [{ name: 'Scrum', id: 0 }],
      },
    ];

    const formattedSessionsTypesOptions =
      formatSessionsTypesOptions(activityGroupOptions);
    expect(formattedSessionsTypesOptions).toEqual([
      {
        id: 4,
        name: 'Rugby training',
      },
      {
        id: 7,
        name: 'Rugby games',
      },
    ]);
  });

  it('returns an empty array if there is no session type', () => {
    const activityGroupOptions = [];
    const formattedSessionsTypesOptions =
      formatSessionsTypesOptions(activityGroupOptions);
    expect(formattedSessionsTypesOptions).toEqual([]);
  });
});
