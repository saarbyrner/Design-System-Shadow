import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import useStatus from '../useStatus';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  formStateSlice: {},
  formMenuSlice: {},
  formValidationSlice: {
    validation: {
      invalid_field: {
        message: null,
        status: 'INVALID',
      },
      valid_field: {
        message: null,
        status: 'VALID',
      },
      pending_field: {
        message: null,
        status: 'PENDING',
      },
    },
  },
});

describe('useStatus', () => {
  let renderHookResult;
  it('has inital data', async () => {
    await act(async () => {
      renderHookResult = renderHook(() => useStatus({ fields: [] }), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }).result;
    });
    expect(renderHookResult.current).toEqual('PENDING');
  });

  it('returns INVALID if any field is INVALID', async () => {
    await act(async () => {
      renderHookResult = renderHook(
        () =>
          useStatus({
            fields: ['invalid_field', 'valid_field', 'pending_field'],
          }),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      ).result;
    });

    expect(renderHookResult.current).toEqual('INVALID');
  });

  it('returns PENDING if any field is PENDING and not INVALID', async () => {
    await act(async () => {
      renderHookResult = renderHook(
        () =>
          useStatus({
            fields: ['pending_field', 'valid_field', 'pending_field'],
          }),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      ).result;
    });

    expect(renderHookResult.current).toEqual('PENDING');
  });

  it('returns VALID if ALL fields are VALID', async () => {
    await act(async () => {
      renderHookResult = renderHook(
        () =>
          useStatus({
            fields: ['valid_field', 'valid_field', 'valid_field'],
          }),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      ).result;
    });

    expect(renderHookResult.current).toEqual('VALID');
  });
});
