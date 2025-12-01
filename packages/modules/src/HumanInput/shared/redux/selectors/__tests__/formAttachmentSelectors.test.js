import { getQueueState, getQueueFactory } from '../formAttachmentSelectors';

const MOCK_STATE = {
  registrationFormApi: {},
  registrationApi: {},
  formAttachmentSlice: {
    queue: {
      1: {
        file: new File([''], {}),
        state: 'IDLE',
        message: null,
      },
    },
  },
};

describe('[formAttachmentSelectors] - selectors', () => {
  test('getQueueState()', () => {
    expect(getQueueState(MOCK_STATE)).toBe(
      MOCK_STATE.formAttachmentSlice.queue
    );
  });

  test('getQueueFactory()', () => {
    const selector = getQueueFactory(1);
    expect(selector(MOCK_STATE)).toStrictEqual({
      file: new File([''], {}),
      state: 'IDLE',
      message: null,
    });
  });
});
