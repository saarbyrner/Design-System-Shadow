import { renderHook, act } from '@testing-library/react-hooks';
import { Provider, useDispatch } from 'react-redux';
import { rest, server } from '@kitman/services/src/mocks/server';
import useUpdateDmrStatus, { DmrStatuses } from '../useUpdateDmrStatus';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  planningEventApi: {},
};

const store = storeFake(defaultStore);

describe('useUpdateDmrStatus', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  describe('getUpdatedDmrStatusInfo Function', () => {
    it('should return the updated game compliance rules in dmr status format', async () => {
      let dmrStatusInfo;
      const { result } = renderHook(() => useUpdateDmrStatus(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      const { getUpdatedDmrStatusInfo } = result.current;
      await act(async () => {
        dmrStatusInfo = await getUpdatedDmrStatusInfo({
          eventId: 1,
          currentStatuses: [DmrStatuses.captain, DmrStatuses.lineup],
        });
      });
      expect(dmrStatusInfo).toEqual(['players', 'captain']);
    });

    it('should return an the same array if the current updated compliant rules are the same as local', async () => {
      let dmrStatusInfo;
      server.use(
        rest.get(
          '/planning_hub/game_compliance/:event_id/rules',
          (req, res, ctx) =>
            res(ctx.json([{ players: { compliant: true, message: '' } }]))
        )
      );

      const { result } = renderHook(() => useUpdateDmrStatus(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      const { getUpdatedDmrStatusInfo } = result.current;
      await act(async () => {
        dmrStatusInfo = await getUpdatedDmrStatusInfo({
          eventId: 1,
          currentStatuses: [DmrStatuses.players],
        });
      });
      expect(dmrStatusInfo).toEqual([DmrStatuses.players]);
    });

    it('should throw an error if the fetch to retrieve game compliance rules fails', async () => {
      server.use(
        rest.get(
          '/planning_hub/game_compliance/:event_id/rules',
          (req, res, ctx) => res(ctx.status(500))
        )
      );

      const { result } = renderHook(() => useUpdateDmrStatus(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      const { getUpdatedDmrStatusInfo } = result.current;

      await expect(
        getUpdatedDmrStatusInfo({
          eventId: 1,
          currentStatuses: [DmrStatuses.captain, DmrStatuses.lineup],
        })
      ).rejects.toThrow();

      expect(dispatchMock).toHaveBeenCalledWith({
        payload: {
          status: 'ERROR',
          title: 'Game compliance rules fetch failed.',
        },
        type: 'toasts/add',
      });
    });
  });
});
