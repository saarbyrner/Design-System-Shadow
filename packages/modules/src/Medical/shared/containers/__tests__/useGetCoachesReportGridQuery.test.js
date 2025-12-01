import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import moment from 'moment';
import { configureStore } from '@reduxjs/toolkit';

import {
  medicalApi,
  useGetCoachesReportGridQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { server, rest } from '@kitman/services/src/mocks/server';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetCoachesReportGridQuery: jest.fn(),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      [medicalApi.reducerPath]: medicalApi.reducer,
    },
  });
};

const createWrapper =
  (store) =>
  ({ children }) =>
    <Provider store={store}>{children}</Provider>;

describe('useGetCoachesReportGridQuery Hook', () => {
  const initialGridPayload = {
    filters: {
      athlete_name: '',
      positions: [],
      squads: [],
      availabilities: [],
      report_date: moment().toISOString(),
      issues: [],
    },
    next_id: null,
  };

  it('should transform a real server error payload into the expected shape', async () => {
    const realServerErrorResponse = {
      status: 'fail',
      data: [
        {
          key: 'command',
          type: 'execution',
          message: 'No previous note to copy',
        },
      ],
      meta_data: {
        request_id: '944e864d-3ce2-4c3e-ab97-9f23c5821785',
      },
    };

    server.use(
      rest.post('*/medical/coaches/fetch', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json(realServerErrorResponse));
      })
    );

    // Mock the hook to return the error state
    useGetCoachesReportGridQuery.mockReturnValue({
      data: undefined,
      error: { status: 400, error: 'Unknown' },
      isError: true,
      isLoading: false,
      isFetching: false,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(
      () => useGetCoachesReportGridQuery(initialGridPayload),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual({
      status: 400,
      error: 'Unknown',
    });
  });

  it('should transform a 500 server error payload into the expected shape', async () => {
    const realServerErrorResponse = {
      status: 'fail',
      data: [
        {
          key: 'server_error',
          type: 'execution',
          message: 'Internal Server Error',
        },
      ],
      meta_data: {
        request_id: 'another-request-id',
      },
    };

    server.use(
      rest.post('*/medical/coaches/fetch', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json(realServerErrorResponse));
      })
    );

    useGetCoachesReportGridQuery.mockReturnValue({
      data: undefined,
      error: { status: 500, error: 'Unknown' },
      isError: true,
      isLoading: false,
      isFetching: false,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(
      () => useGetCoachesReportGridQuery(initialGridPayload),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual({
      status: 500,
      error: 'Unknown',
    });
  });

  it('should transform a 404 server error payload into the expected shape', async () => {
    const realServerErrorResponse = {
      status: 'fail',
      data: [
        {
          key: 'not_found',
          type: 'execution',
          message: 'Resource not found',
        },
      ],
      meta_data: {
        request_id: 'yet-another-request-id',
      },
    };

    server.use(
      rest.post('*/medical/coaches/fetch', (req, res, ctx) => {
        return res(ctx.status(404), ctx.json(realServerErrorResponse));
      })
    );

    useGetCoachesReportGridQuery.mockReturnValue({
      data: undefined,
      error: { status: 404, error: 'Unknown' },
      isError: true,
      isLoading: false,
      isFetching: false,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(
      () => useGetCoachesReportGridQuery(initialGridPayload),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual({
      status: 404,
      error: 'Unknown',
    });
  });
});
