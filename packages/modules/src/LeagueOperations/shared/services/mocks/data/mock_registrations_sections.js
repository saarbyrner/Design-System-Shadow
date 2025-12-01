export default {
  data: [
    {
      id: 1,
      user_registration_id: 1,
      status: 'pending_organisation',
      registration_system_status: {
        id: 9,
        name: 'Pending Organisation',
        type: 'pending_organisation',
      },
      form_element: {
        id: 1,
        current_status: 'pending_organisation',
        title: 'Section 1',
        element_id: 2,
      },
    },
    {
      id: 2,
      user_registration_id: 1,
      status: 'pending_association',
      registration_system_status: {
        id: 10,
        name: 'Pending Association',
        type: 'pending_association',
      },
      form_element: {
        id: 2,
        current_status: 'pending_association',
        title: 'Section 2',
        element_id: 2,
      },
    },
  ],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 2,
  },
};
