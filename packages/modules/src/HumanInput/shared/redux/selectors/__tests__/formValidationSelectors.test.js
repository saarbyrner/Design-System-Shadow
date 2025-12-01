import {
  getValidationState,
  getValidationStateFactory,
  getFieldValidationFactory,
  getAllFieldsValidationFactory,
} from '../formValidationSelectors';

const MOCK_STATE = {
  registrationFormApi: {},
  registrationApi: {},
  formValidationSlice: {
    validation: {
      1: {
        status: 'PENDING',
        message: null,
      },
      2: {
        status: 'VALID',
        message: null,
      },
      3: {
        status: 'INVALID',
        message: null,
      },
    },
  },
};

describe('[formValidationSelectors] - selectors', () => {
  test('getValidationState()', () => {
    expect(getValidationState(MOCK_STATE)).toBe(
      MOCK_STATE.formValidationSlice.validation
    );
  });

  test('getValidationStateFactory()', () => {
    const selector = getValidationStateFactory();
    expect(selector(MOCK_STATE)).toStrictEqual(['PENDING', 'VALID', 'INVALID']);
  });

  test('getFieldValidationFactory()', () => {
    const fieldSelector = getFieldValidationFactory(1);
    expect(fieldSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formValidationSlice.validation[1]
    );
  });

  test('getAllFieldsValidationFactory()', () => {
    const selector = getAllFieldsValidationFactory([1, 2]);
    expect(selector(MOCK_STATE)).toStrictEqual(['PENDING', 'VALID']);
  });
});
