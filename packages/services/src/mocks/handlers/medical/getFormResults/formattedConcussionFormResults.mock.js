export default [
  {
    athlete: {
      availability: 'unavailable',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      firstname: 'Adam',
      fullname: 'Conway Adam',
      id: 2942,
      lastname: 'Conway',
      position: {
        id: 77,
        name: 'Scrum Half',
        order: 8,
      },
    },
    completionDate: '2022-07-12T00:00:00Z',
    editorFullName: 'Stefano Santomauro',
    expiryDate: '2023-07-12T00:00:00Z',
    formType: 'Concussion incident',
    formTypeFullName: 'Concussion incident - FUll NAME',
    concussionDiagnosed: {
      description: 'Unknown',
      key: 'unknown',
    },
    linkedIssue: {
      injury: {
        athlete_id: 2942,
        id: 91251,
        osics: {
          bamic: null,
          body_area: {
            id: 7,
            name: 'Head',
          },
          classification: {
            id: 20,
            name: 'Concussion/ Brain Injury',
          },
          icd: null,
          osics_code: 'HNCA',
          pathology: {
            id: 417,
            name: 'Acute Concussion',
          },
        },
      },
      injury_occurrence: {
        id: 1,
        occurrence_date: '2022-08-19T00:00:00+01:00',
      },
    },

    id: 56,
    status: 'Complete',
  },
];
