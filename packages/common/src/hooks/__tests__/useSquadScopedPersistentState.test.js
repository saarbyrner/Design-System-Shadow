import { renderHook } from '@testing-library/react-hooks';
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useSquadScopedPersistentState } from '..';
import usePersistentState from '../usePersistentState';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('../usePersistentState', () => jest.fn());

describe('useSquadScopedPersistentState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should should call the usePersistentState hook with the correct session key and initial state', () => {
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'test',
      },
    });
    renderHook(() =>
      useSquadScopedPersistentState({
        initialState: { test: 'test' },
        sessionKey: 'test',
      })
    );

    expect(usePersistentState).toHaveBeenCalledWith({
      initialState: { test: 'test' },
      sessionKey: 'squad[1]:test',
      enablePersistence: true,
      excludeKeys: [],
    });
  });

  it('should call the usePersistentState hook with undefined session key when there is no active squad', () => {
    useGetActiveSquadQuery.mockReturnValue({
      data: undefined,
    });

    renderHook(() =>
      useSquadScopedPersistentState({
        initialState: { test: 'test' },
        sessionKey: 'test',
      })
    );

    expect(usePersistentState).toHaveBeenCalledWith({
      initialState: { test: 'test' },
      sessionKey: undefined,
      enablePersistence: true,
      excludeKeys: [],
    });
  });

  it('should call the usePersistentState hook with undefined session key when there is no session key provided', () => {
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'test',
      },
    });

    renderHook(() =>
      useSquadScopedPersistentState({
        initialState: { test: 'test' },
        sessionKey: undefined,
        enablePersistence: false,
      })
    );

    expect(usePersistentState).toHaveBeenCalledWith({
      initialState: { test: 'test' },
      sessionKey: undefined,
      enablePersistence: false,
      excludeKeys: [],
    });
  });
});
