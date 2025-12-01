import { useDispatch } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';

import { rest, server } from '@kitman/services/src/mocks/server';

import useScoutRequestAccess from '../useScoutRequestAccess';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useScoutRequestAccess', () => {
  let dispatchMock;
  const setUserEventRequestsMock = jest.fn();

  const mockUserEventRequests = [];
  const mockCreatedUserEventRequest = {
    id: 1,
    status: 'pending',
    user: { fullname: 'Ted Tedderson' },
  };

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  describe('creating a user request event', () => {
    it('should handle the creation of a user access request', async () => {
      server.use(
        rest.post('/planning_hub/user_event_requests', (req, res, ctx) =>
          res(ctx.json(mockCreatedUserEventRequest))
        )
      );
      const { result, waitForNextUpdate } = renderHook(() =>
        useScoutRequestAccess()
      );

      act(() =>
        result.current.handleUserEventRequestApi({
          eventId: 1,
          userEventRequests: mockUserEventRequests,
          setUserEventRequests: setUserEventRequestsMock,
        })
      );

      await waitForNextUpdate();

      expect(setUserEventRequestsMock).toHaveBeenCalledWith([
        mockCreatedUserEventRequest,
      ]);
      expect(dispatchMock).toHaveBeenCalledWith({
        payload: {
          status: 'SUCCESS',
          title:
            'Request sent. Acceptance email required to attend the fixture.',
        },
        type: 'toasts/add',
      });
    });

    it('should handle the failure of trying to create a user access request', async () => {
      server.use(
        rest.post('/planning_hub/user_event_requests', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      const { result, waitForNextUpdate } = renderHook(() =>
        useScoutRequestAccess()
      );

      act(() =>
        result.current.handleUserEventRequestApi({
          eventId: 1,
          userEventRequests: mockUserEventRequests,
          setUserEventRequests: setUserEventRequestsMock,
        })
      );

      await waitForNextUpdate();

      expect(dispatchMock).toHaveBeenCalledWith({
        payload: { status: 'ERROR', title: 'Request failed to send.' },
        type: 'toasts/add',
      });
    });
  });

  describe('cancelling a pending user request event', () => {
    it('should handle the cancelling of a user access request', async () => {
      server.use(
        rest.delete('/planning_hub/user_event_requests/1`', (req, res, ctx) =>
          res(ctx.json(mockCreatedUserEventRequest))
        )
      );
      const { result, waitForNextUpdate } = renderHook(() =>
        useScoutRequestAccess()
      );

      act(() =>
        result.current.handleCancelUserEventRequestApi({
          userEventRequestId: 1,
          userEventRequests: [mockCreatedUserEventRequest],
          setUserEventRequests: setUserEventRequestsMock,
        })
      );

      await waitForNextUpdate();

      expect(setUserEventRequestsMock).toHaveBeenCalledWith([]);
      expect(dispatchMock).toHaveBeenCalledWith({
        payload: {
          status: 'SUCCESS',
          title: 'Scout access has been withdrawn.',
        },
        type: 'toasts/add',
      });
    });

    it('should handle the cancelling of a user access request with the scout name', async () => {
      server.use(
        rest.delete('/planning_hub/user_event_requests/1`', (req, res, ctx) =>
          res(ctx.json(mockCreatedUserEventRequest))
        )
      );
      const { result, waitForNextUpdate } = renderHook(() =>
        useScoutRequestAccess()
      );

      act(() =>
        result.current.handleCancelUserEventRequestApi({
          userEventRequestId: 1,
          userEventRequests: [mockCreatedUserEventRequest],
          setUserEventRequests: setUserEventRequestsMock,
          useScoutName: true,
        })
      );

      await waitForNextUpdate();

      expect(setUserEventRequestsMock).toHaveBeenCalledWith([]);
      expect(dispatchMock).toHaveBeenCalledWith({
        payload: {
          status: 'SUCCESS',
          title: 'Ted Tedderson access has been withdrawn.',
        },
        type: 'toasts/add',
      });
    });

    it('should handle the failure of trying to create a user access request', async () => {
      server.use(
        rest.delete('/planning_hub/user_event_requests/1', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      const { result, waitForNextUpdate } = renderHook(() =>
        useScoutRequestAccess()
      );

      act(() =>
        result.current.handleCancelUserEventRequestApi({
          userEventRequestId: 1,
          userEventRequests: [mockCreatedUserEventRequest],
          setUserEventRequests: setUserEventRequestsMock,
        })
      );

      await waitForNextUpdate();

      expect(dispatchMock).toHaveBeenCalledWith({
        payload: { status: 'ERROR', title: 'Scout access withdraw failed.' },
        type: 'toasts/add',
      });
    });

    it('should handle the failure of trying to create a user access request with the scout name', async () => {
      server.use(
        rest.delete('/planning_hub/user_event_requests/1', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      const { result, waitForNextUpdate } = renderHook(() =>
        useScoutRequestAccess()
      );

      act(() =>
        result.current.handleCancelUserEventRequestApi({
          userEventRequestId: 1,
          userEventRequests: [mockCreatedUserEventRequest],
          setUserEventRequests: setUserEventRequestsMock,
          useScoutName: true,
        })
      );

      await waitForNextUpdate();

      expect(dispatchMock).toHaveBeenCalledWith({
        payload: {
          status: 'ERROR',
          title: 'Ted Tedderson access withdraw failed.',
        },
        type: 'toasts/add',
      });
    });
  });
});
