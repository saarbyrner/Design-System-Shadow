/* eslint-disable */

export const mockActivityTypes = [
  {
    id: 1,
    name: 'First activity',
    squads: [{ id: 8, name: 'International Squad' }],
  },
  {
    id: 2,
    name: 'Second activity',
    squads: [{ id: 73, name: 'Academy Squad' }],
  },
];

export const mockDrillLabels = [
  {
    id: 1,
    name: 'label_1',
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    archived: false,
  },
  {
    id: 2,
    name: 'label_2',
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
      {
        id: 73,
        name: 'Academy Squad',
      },
    ],
    archived: true,
  },
  {
    id: 3,
    name: 'label_3',
    squads: [],
    archived: true,
  },
];

export const mockEditedActivityTypes = [
  {
    id: 1,
    name: 'First activity edited',
    squads: [],
  },
  {
    id: 2,
    name: 'Second activity',
    squads: [{ id: 73, name: 'Academy Squad' }],
  },
];

export const mockEditedDrillLabels = [
  {
    id: 1,
    name: 'label_1',
    squads: [],
    archived: false,
  },
  {
    id: 2,
    name: 'label_2',
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
      {
        id: 73,
        name: 'Academy Squad',
      },
    ],
    archived: true,
  },
  {
    archived: true,
    id: 3,
    name: 'label_3',
    squads: [],
  },
];

export const mockDevelopmentGoalTypes = [
  {
    id: 1,
    name: 'First goal',
    squads: [{ id: 8, name: 'International Squad' }],
  },
  {
    id: 2,
    name: 'Second goal',
    squads: [{ id: 73, name: 'Academy Squad' }],
  },
];

export const mockEditedDevelopmentGoalTypes = [
  {
    id: 1,
    name: 'First goal edited',
    squads: [],
  },
  {
    id: 2,
    name: 'Second goal',
    squads: [{ id: 73, name: 'Academy Squad' }],
  },
];

export const mockDevelopmentGoalCompletionTypes = [
  {
    id: 1,
    name: 'First goal completion type',
    archived: false,
  },
  {
    id: 2,
    name: 'Second goal completion type',
    archived: false,
  },
];

export const mockEditedDevelopmentGoalCompletionTypes = [
  {
    id: 1,
    name: 'First goal completion type edited',
    archived: false,
  },
  {
    id: 2,
    name: 'Second goal completion type',
    archived: false,
  },
];

export const mockArchivedDevelopmentGoalCompletionTypes = [
  {
    id: 1,
    name: 'First goal completion type',
    archived: true,
  },
  {
    id: 2,
    name: 'Second goal completion type',
    archived: false,
  },
];

export const mockCategories = [
  {
    id: 1,
    name: 'Recovery and Regeneration',
  },
  {
    id: 2,
    name: 'Blocking + 1 v 1 Situations',
  },
  {
    id: 3,
    name: 'Wide Play and Box Management',
  },
  {
    id: 4,
    name: 'Shot Stopping + Footwork',
  },
  {
    id: 5,
    name: 'Game Preparation',
  },
];

export const mockEditedCategories = [
  {
    id: 1,
    name: 'Physical Recovery',
  },
  {
    id: 2,
    name: 'Blocking + 2 v 2 Situations',
  },
  {
    id: 3,
    name: 'Wide Play and Box Management',
  },
  {
    id: 4,
    name: 'Shot Stopping + Footwork',
  },
  {
    id: 5,
    name: 'Game Preparation',
  },
  {
    id: 6,
    name: 'Training Preparation',
  },
];

export const mockPhases = [
  {
    id: 1,
    name: 'Attacking',
  },
  {
    id: 2,
    name: 'Defending',
  },
  {
    id: 3,
    name: 'Transition',
  },
];

export const mockTypes = [
  {
    id: 1,
    sport_id: 2,
    sport: {
      id: 2,
      perma_id: 'rugby_union',
      name: 'Rugby Union',
      duration: 60,
    },
    name: 'Technical',
  },
  {
    id: 2,
    sport_id: 3,
    sport: {
      id: 3,
      perma_id: 'cricket_union',
      name: 'Cricket Union',
      duration: 50,
    },
    name: 'Tactical',
  },
  {
    id: 3,
    sport_id: 4,
    sport: {
      id: 4,
      perma_id: 'soccer_union',
      name: 'Soccer Union',
      duration: 70,
    },
    name: 'Physical',
  },
];

export const mockSquads = [
  {
    id: 8,
    name: 'International Squad',
    owner_id: 6,
    created_at: '2013-10-17T15:10:14Z',
    updated_at: null,
  },
  {
    id: 73,
    name: 'Academy Squad',
    owner_id: 6,
    created_at: '2015-09-07T12:29:54Z',
    updated_at: '2015-09-07T12:29:54Z',
  },
  {
    id: 1374,
    name: 'Player view',
    owner_id: 6,
    created_at: '2019-10-17T12:23:51Z',
    updated_at: '2019-10-17T12:23:51Z',
  },
];

export const mockPrinciples = [
  {
    id: 1,
    name: 'First principle',
    principle_categories: [
      {
        id: 1,
        name: 'Recovery and Regeneration',
      },
    ],
    phases: [
      {
        id: 1,
        name: 'Attacking',
      },
    ],
    principle_types: [
      {
        id: 1,
        sport_id: 2,
        sport: {
          id: 2,
          perma_id: 'rugby_union',
          name: 'Rugby Union',
          duration: 60,
        },
        name: 'Technical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
    ],
  },
  {
    id: 2,
    name: 'Second principle',
    principle_categories: [
      {
        id: 2,
        name: 'Blocking + 1 v 1 Situations',
      },
    ],
    phases: [
      {
        id: 2,
        name: 'Defending',
      },
    ],
    principle_types: [
      {
        id: 2,
        sport_id: 3,
        sport: {
          id: 3,
          perma_id: 'cricket_union',
          name: 'Cricket Union',
          duration: 50,
        },
        name: 'Tactical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
    ],
  },
  {
    id: 3,
    name: 'Third principle',
    principle_categories: [
      {
        id: 3,
        name: 'Wide Play and Box Management',
      },
    ],
    phases: [
      {
        id: 3,
        name: 'Transition',
      },
    ],
    principle_types: [
      {
        id: 3,
        sport_id: 4,
        sport: {
          id: 4,
          perma_id: 'soccer_union',
          name: 'Soccer Union',
          duration: 70,
        },
        name: 'Physical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
      {
        id: 1374,
        name: 'Player view',
        owner_id: 6,
        created_at: '2019-10-17T12:23:51Z',
        updated_at: '2019-10-17T12:23:51Z',
      },
    ],
  },
];

export const mockPrinciplesWithEditedCategories = [
  {
    id: 1,
    name: 'First principle',
    principle_categories: [
      {
        id: 1,
        name: 'Physical Recovery',
      },
    ],
    phases: [
      {
        id: 1,
        name: 'Attacking',
      },
    ],
    principle_types: [
      {
        id: 1,
        sport_id: 2,
        sport: {
          id: 2,
          perma_id: 'rugby_union',
          name: 'Rugby Union',
          duration: 60,
        },
        name: 'Technical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
    ],
  },
  {
    id: 2,
    name: 'Second principle',
    principle_categories: [
      {
        id: 2,
        name: 'Blocking + 2 v 2 Situations',
      },
    ],
    phases: [
      {
        id: 2,
        name: 'Defending',
      },
    ],
    principle_types: [
      {
        id: 2,
        sport_id: 3,
        sport: {
          id: 3,
          perma_id: 'cricket_union',
          name: 'Cricket Union',
          duration: 50,
        },
        name: 'Tactical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
    ],
  },
  {
    id: 3,
    name: 'Third principle',
    principle_categories: [
      {
        id: 3,
        name: 'Wide Play and Box Management',
      },
    ],
    phases: [
      {
        id: 3,
        name: 'Transition',
      },
    ],
    principle_types: [
      {
        id: 3,
        sport_id: 4,
        sport: {
          id: 4,
          perma_id: 'soccer_union',
          name: 'Soccer Union',
          duration: 70,
        },
        name: 'Physical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
      {
        id: 1374,
        name: 'Player view',
        owner_id: 6,
        created_at: '2019-10-17T12:23:51Z',
        updated_at: '2019-10-17T12:23:51Z',
      },
    ],
  },
];

export const mockEditedPrinciples = [
  {
    id: 1,
    name: 'First principle edited',
    principle_categories: [
      {
        id: 4,
        name: 'Shot Stopping + Footwork',
      },
    ],
    phases: [
      {
        id: 3,
        name: 'Transition',
      },
    ],
    principle_types: [
      {
        id: 1,
        sport_id: 2,
        sport: {
          id: 2,
          perma_id: 'rugby_union',
          name: 'Rugby Union',
          duration: 60,
        },
        name: 'Technical',
      },
    ],
    squads: [
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
    ],
  },
  {
    id: 2,
    name: 'Second principle edited',
    principle_categories: [
      {
        id: 3,
        name: 'Wide Play and Box Management',
      },
    ],

    phases: [
      {
        id: 2,
        name: 'Defending',
      },
    ],
    principle_types: [
      {
        id: 2,
        sport_id: 3,
        sport: {
          id: 3,
          perma_id: 'cricket_union',
          name: 'Cricket Union',
          duration: 50,
        },
        name: 'Tactical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
    ],
  },
  {
    id: 3,
    name: 'Third principle',
    principle_categories: [
      {
        id: 3,
        name: 'Wide Play and Box Management',
      },
    ],
    phases: [
      {
        id: 3,
        name: 'Transition',
      },
    ],
    principle_types: [
      {
        id: 3,
        sport_id: 4,
        sport: {
          id: 4,
          perma_id: 'soccer_union',
          name: 'Soccer Union',
          duration: 70,
        },
        name: 'Physical',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
      {
        id: 1374,
        name: 'Player view',
        owner_id: 6,
        created_at: '2019-10-17T12:23:51Z',
        updated_at: '2019-10-17T12:23:51Z',
      },
    ],
  },
];

export const mockNewPrinciple = {
  id: 4,
  name: 'Fake principle 4',
  principle_categories: [],
  phases: [],
  principle_types: [
    {
      id: 1,
      sport_id: 2,
      sport: {
        id: 2,
        perma_id: 'rugby_union',
        name: 'Rugby Union',
        duration: 60,
      },
      name: 'Technical',
    },
  ],
  squads: [],
};

export const mockPrincipleId = 3;
export const mockNewPrincipleId = 4;

export const mockPrinciplePlaceholder = 'Fake principle placeholder';
export const mockPrincipleName = 'Fake principle name';

export const mockDeletionAvailabilityOk = {
  ok: true,
  activities_count: 0,
};
export const mockDeletionAvailabilityKo = {
  ok: false,
  activities_count: 1,
};

export const mockDeletionFromDrillsAvailabilityOk = {
  ok: true,
  activities_count: 0,
};
export const mockDeletionFromDrillsAvailabilityKo = {
  ok: false,
  activities_count: 1,
};
