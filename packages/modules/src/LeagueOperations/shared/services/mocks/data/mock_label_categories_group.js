export const data = {
  id: 1,
  name: 'Homegrown 45',
  max_number: 45,
  created_by: {
    id: 160906,
    fullname: 'Service User',
  },
  label_categories: [
    {
      id: 1,
      name: 'Homegrown (U15)',
      max_number: 20,
      labels_count: 0,
    },
    {
      id: 2,
      name: 'Homegrown (U17)',
      max_number: 20,
      labels_count: 0,
    },
    {
      id: 3,
      name: 'Homegrown (U19)',
      max_number: 15,
      labels_count: 0,
    },
  ],
};

export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 1,
};

export const response = {
  data,
  meta,
};
