// @flow
export const noteTypeOptions = () => [
  {
    id: 1,
    title: 'CSR',
    type: 'OrganisationAnnotationTypes::Evaluation',
  },
  {
    id: 2,
    title: 'General Note',
    type: 'OrganisationAnnotationTypes::General',
  },
];

export const athleteOptions = () => [
  {
    id: 1,
    title: 'Jon Doe',
    name: 'Jon Doe',
  },
  {
    id: 2,
    title: 'John Appleseed',
    name: 'John Appleseed',
  },
  {
    id: 27280,
    title: 'Gustavo Lazaro Amendola',
    name: 'Gustavo Lazaro Amendola',
  },
];

export const assigneeOptions = () => [
  {
    id: 1,
    title: 'Jon Doe',
    name: 'Jon Doe',
  },
  {
    id: 2,
    title: 'John Appleseed',
    name: 'John Appleseed',
  },
  {
    id: 27280,
    title: 'Gustavo Lazaro Amendola',
    name: 'Gustavo Lazaro Amendola',
  },
];

export const annotation = () => ({
  id: 1,
  modalType: 'EDIT',
  annotation_type_id: 1,
  annotationable_type: 'Athlete',
  annotationable: {
    id: 27280,
    fullname: 'Gustavo Lazaro Amendola',
  },
  title: 'Notes title',
  content: 'Notes note',
  archived: false,
  annotation_date: '2019-06-25T23:00:00Z',
  annotation_actions: [
    {
      id: 2,
      content: 'My action 223',
      user_ids: [],
      completed: false,
      due_date: '2019-06-25T23:00:00Z',
    },
    {
      id: 1,
      content: 'My action 11',
      user_ids: ['26486', '123456'],
      completed: false,
      due_date: null,
    },
    {
      id: 3,
      content: 'My action 11',
      user_ids: [],
      completed: false,
      due_date: null,
    },
  ],
  attachments: [
    {
      id: 12345566,
      original_filename: 'physio_2211_jon_doe.jpg',
      created: '2019-06-25T23:00:00Z',
      filesize: 1564,
      confirmed: true,
    },
    {
      id: 5465656,
      original_filename: 'physio_2211_jon_doe.doc',
      created: '2019-06-25T23:00:00Z',
      filesize: 123,
      confirmed: true,
    },
  ],
  unUploadedFiles: [],
  created_by: {
    id: 26486,
    fullname: 'Gustavo Lazaro Amendola',
  },
  updated_by: {
    id: 26486,
    fullname: 'Gustavo Lazaro Amendola',
  },
  created_at: '2019-10-08T14:28:29.000+01:00',
  updated_at: '2019-10-10T14:28:29.000+01:00',
});
