import {
  getSelectionHeaders,
  userFormatter,
  bulkActivityTogglerFormatter,
  BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
  ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX,
  reorderEvents,
} from '../utils';

describe('Staff Selection Tab Utils', () => {
  describe('getSelectionHeaders', () => {
    it('returns correct headers', () => {
      const selectionHeaders = getSelectionHeaders({
        activities: [
          {
            duration: null,
            id: 1,
            principles: [],
            event_activity_drill: {
              name: '4x4',
            },
            event_activity_type: {
              id: 1,
              name: 'Warm Up',
              squads: [{ id: 8, name: 'International Squad' }],
            },
            users: [],
          },
          {
            duration: null,
            id: 2,
            principles: [],
            event_activity_drill: {
              name: 'Cardio',
            },
            event_activity_type: {
              id: 2,
              name: 'Training',
              squads: [{ id: 8, name: 'International Squad' }],
            },
            users: [],
          },
        ],
      });

      expect(selectionHeaders).toMatchObject([
        {
          key: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          name: '',
          formatter: bulkActivityTogglerFormatter,
          frozen: true,
          width: 45,
          minWidth: 45,
          maxWidth: 45,
        },
        {
          key: 'user',
          name: 'Staff',
          frozen: true,
          resizable: true,
          width: 200,
          formatter: userFormatter,
        },
        {
          key: `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX} 4x4 0`,
          name: '4x4',
          id: 1,
          users: [],
          formatter: expect.any(Function),
          minWidth: 90,
          resizable: true,
        },
        {
          key: `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX} cardio 1`,
          name: 'Cardio',
          id: 2,
          users: [],
          formatter: expect.any(Function),
          minWidth: 90,
          resizable: true,
        },
      ]);
    });
  });

  describe('reorderEvents', () => {
    it('should reorder events correctly', () => {
      const events = [
        {
          id: 368531,
          firstName: 'Jack-Faxx',
          lastName: 'Forciea',
          role: 'Staff',

          order: 1,
        },
        {
          id: 284337,
          firstName: 'Shaun',
          lastName: 'Galaxy',
          role: 'Staff',
          order: 0,
        },
      ];
      const newIndex = 0;
      const oldIndex = 1;

      const reorderedEvents = reorderEvents({ events, oldIndex, newIndex });

      expect(reorderedEvents).toMatchObject([
        {
          id: 284337,
          firstName: 'Shaun',
          lastName: 'Galaxy',
          role: 'Staff',
          order: 0,
        },
        {
          id: 368531,
          firstName: 'Jack-Faxx',
          lastName: 'Forciea',
          role: 'Staff',
          order: 1,
        },
      ]);
    });
  });
});
