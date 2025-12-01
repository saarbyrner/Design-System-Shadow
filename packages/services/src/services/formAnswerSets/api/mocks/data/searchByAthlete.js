export const data = {
  data: [
    {
      athlete: {
        id: 42,
        firstname: 'John',
        lastname: 'Smith',
        fullname: 'John Smith',
        position: 'Forward',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
      status: {
        total: 5,
        completed: 4,
        incomplete: 1,
        latestSubmissionAt: '2025-01-10T11:45:00Z',
      },
      formTemplates: [
        {
          id: 101,
          name: 'Weekly Wellness',
          status: 'complete',
          lastUpdate: '2025-01-10T11:45:00Z',
          formAnswerSets: [
            {
              id: 555,
              lastUpdated: '2025-01-10T11:45:00Z',
              status: 'complete',
            },
          ],
        },
        {
          id: 102,
          name: 'General Medical',
          status: 'draft',
          lastUpdate: '2025-01-08T08:15:00Z',
          formAnswerSets: [],
        },
      ],
    },
  ],
  meta: {
    currentPage: 1,
    totalPages: 8,
    totalCount: 75,
    perPage: 10,
  },
};
