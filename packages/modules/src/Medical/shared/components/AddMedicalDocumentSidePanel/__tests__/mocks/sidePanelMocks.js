export const mockedPlayerOptions = [
  {
    label: 'Squad A Name',
    options: [
      {
        value: 1,
        label: 'Athlete 1 Name',
      },
      {
        value: 2,
        label: 'Athlete 2 Name',
      },
    ],
  },
  {
    label: 'Squad B Name',
    options: [
      {
        value: 3,
        label: 'Athlete 3 Name',
      },
      {
        value: 4,
        label: 'Athlete 4 Name',
      },
    ],
  },
];

export const mockDocumentCategoryOptions = [
  {
    value: 1,
    label: 'Document Category 1',
  },
  {
    value: 2,
    label: 'Document Category 2',
  },
  {
    value: 3,
    label: 'Document Category 3',
  },
];

export const mockIssues = [
  {
    label:
      'Jul 4, 2022 - Respiratory tract infection (bacterial or viral) [N/A]',
    value: `Illness_11523`,
  },
];

export const mockSelectedFile = {
  annotation: {
    content: '<p>This is my note</p>',
    note_summary: 'This is my note',
    title: 'Hello World',
  },
  athlete: {
    id: 1,
  },
  attachment: {
    created: '2023-04-20T18:12:54Z',
    filename: 'myAttachment.pdf',
    id: 1,
    name: 'myAttachment.pdf',
  },
  chronic_issues: [],
  document_categories: [{ id: 1, name: 'Document Category 1' }],
  document_date: '2023-04-20T18:12:54Z',
  illness_occurrences: [
    {
      full_pathology:
        'Jul 4, 2022 - Respiratory tract infection (bacterial or viral) [N/A]',
      id: 11523,
    },
  ],
  injury_occurrences: [],
  illness_occurrence: [],
};
