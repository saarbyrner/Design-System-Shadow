export const validData = [
  { kUserName: 'test_user_one', Date: '29/01/2025', '5-0-5': 1, '5m': 2 },
  { kUserName: 'test_user_two', Date: '29/01/2025', '5-0-5': 1, '5m': 2 },
  { kUserName: 'test_user_three', Date: '29/01/2025', '5-0-5': 1, '5m': 2 },
  { kUserName: 'test_user_four', Date: '29/01/2025', '5-0-5': 1, '5m': 2 },
  { kUserName: 'test_user_five', Date: '29/01/2025', '5-0-5': 1, '5m': 2 },
];

// Contains athletes that do not exist
export const invalidData = [
  ...validData,
  { kUserName: 'someone_else', Date: '29/01/2025', '5-0-5': 1, '5m': 2 },
  { kUserName: 'john_doe', Date: '29/01/2025', '5-0-5': 1, '5m': 2 },
];
