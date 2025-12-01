import formatActivityGroupOptions from '../formatActivityGroupOptions';

describe('formatActivityGroupOptions', () => {
  it('formats training sessions to the <GroupedDropdown /> items format', () => {
    const activityGroupOptions = [
      {
        name: 'Rugby training',
        event_type: 'Training',
        activities: [
          { name: 'Conditionning', id: 0 },
          { name: 'Polyometrics', id: 1 },
        ],
      },
      {
        name: 'Rugby games',
        event_type: 'Game',
        activities: [{ name: 'Scrum', id: 0 }],
      },
    ];

    const formattedActivityGroups =
      formatActivityGroupOptions(activityGroupOptions);
    expect(formattedActivityGroups).toEqual([
      {
        isGroupOption: true,
        name: 'Rugby training',
      },
      {
        name: 'Conditionning',
        id: 0,
        type: 'Training',
      },
      {
        name: 'Polyometrics',
        id: 1,
        type: 'Training',
      },
      {
        isGroupOption: true,
        name: 'Rugby games',
      },
      {
        name: 'Scrum',
        id: 0,
        type: 'Game',
      },
    ]);
  });

  it('returns an empty object if there is no training session', () => {
    const activityGroupOptions = [];
    const formattedActivityGroups =
      formatActivityGroupOptions(activityGroupOptions);
    expect(formattedActivityGroups).toEqual([]);
  });
});
