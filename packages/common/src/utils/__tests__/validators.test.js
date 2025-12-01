import { isEmailValid } from '@kitman/common/src/utils/validators';

describe('validator functions', () => {
  describe('email validator', () => {
    const testCases = [
      {
        email: 'test@kitmanlabs.com',
        expected: true,
        description: 'valid email',
      },
      {
        email: 'testkitmanlabs.com',
        expected: false,
        description: 'invalid email - no @',
      },
      {
        email: 'test@kitmanlabscom',
        expected: false,
        description: 'invalid email - no .',
      },
      {
        email: '',
        expected: false,
        description: 'invalid email - empty string',
      },
      {
        email: undefined,
        expected: false,
        description: 'invalid email - undefined string',
      },
    ];

    it.each(testCases)('$description', ({ email, expected }) =>
      expect(isEmailValid(email)).toEqual(expected)
    );
  });
});
