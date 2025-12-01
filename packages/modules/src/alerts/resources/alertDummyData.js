// @flow
const alertsDummyData = [
  {
    id: 1234,
    name: 'Screening Alert',
    alert_training_variables: [
      {
        condition: 'less_than',
        id: 33,
        training_variable_id: 4,
        value: 12,
      },
      {
        condition: 'greater_than',
        id: 34,
        training_variable_id: 14,
        value: 3,
      },
      {
        condition: 'equals',
        id: 15,
        training_variable_id: 15,
        value: 5,
      },
    ],
    training_variable_ids: [4, 14, 15],
    notification_recipient_ids: [16948],
    notification_message: 'This is an alert message.',
    active: true,
  },
  {
    id: 5678,
    name: 'Screening Alert 2',
    alert_training_variables: [
      {
        condition: 'greater_than',
        id: 34,
        training_variable_id: 14,
        value: 3,
      },
    ],
    training_variable_ids: [14],
    notification_recipient_ids: [16948, 15784],
    notification_message: 'This is an alert message 2.',
    active: true,
  },
  {
    id: 9876,
    name: 'Diagnostic Alert',
    alert_training_variables: [
      {
        condition: 'greater_than',
        id: 34,
        training_variable_id: 14,
        value: 3,
      },
      {
        condition: 'equals',
        id: 15,
        training_variable_id: 15,
        value: 5,
      },
    ],
    training_variable_ids: [14, 15],
    notification_recipient_ids: [16948, 15784],
    notification_message: 'This is an alert message 3.',
    active: true,
  },
];

export default alertsDummyData;
