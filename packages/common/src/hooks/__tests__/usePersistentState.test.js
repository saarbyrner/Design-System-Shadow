import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import usePersistentState from '../usePersistentState';

const renderHookWithProps = ({
  initialState,
  sessionKey = undefined,
  enablePersistence = true,
  excludeKeys = [],
}) => {
  return renderHook(
    () =>
      usePersistentState({
        initialState,
        sessionKey,
        enablePersistence,
        excludeKeys,
      }),
    {
      wrapper: ({ children }) => children,
    }
  );
};

describe('usePersistentState', () => {
  const { act } = TestRenderer;

  const originalSessionStorage = window.sessionStorage;
  const originalLocation = window.location;
  const originalHistory = window.history;

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'location', {
    value: {
      search: '',
    },
    writable: true,
  });

  Object.defineProperty(window, 'history', {
    value: {
      replaceState: jest.fn(),
    },
    writable: true,
  });

  afterAll(() => {
    window.sessionStorage = originalSessionStorage;
    window.location = originalLocation;
    window.history = originalHistory;
  });

  describe('when the url and session storage has no state', () => {
    const initialState = {
      name: 'Naruto Uzumaki',
      age: 20,
      village: 'Hidden Leaf',
    };

    it('should return the initial state', () => {
      const { result } = renderHookWithProps({
        initialState,
        sessionKey: 'naruto-filters',
      });
      expect(result.current.state).toEqual(initialState);
    });

    it('updates the url when the state changes', async () => {
      const { result } = renderHookWithProps({
        initialState,
        sessionKey: 'naruto-filters',
      });

      await act(async () => {
        result.current.updateState({ name: 'Sasuke Uchiha' });
      });

      expect(result.current.state).toEqual({
        ...initialState,
        name: 'Sasuke Uchiha',
      });
    });
  });

  describe('when the url has state', () => {
    beforeEach(() => {
      const encodedUrlState = encodeURIComponent(
        JSON.stringify({
          name: 'Naruto Uzumaki',
          age: 20,
          village: 'Hidden Leaf',
        })
      );
      window.location.search = `?persistentState=${encodedUrlState}`;
      window.sessionStorage.getItem.mockReturnValueOnce(null);
    });

    it('should return the state from the url', () => {
      const { result } = renderHookWithProps({
        initialState: {},
        sessionKey: 'naruto-filters',
      });
      expect(result.current.state).toEqual({
        name: 'Naruto Uzumaki',
        age: 20,
        village: 'Hidden Leaf',
      });
    });
  });

  describe('when the url has no state but session storage has state', () => {
    beforeEach(() => {
      window.sessionStorage.getItem.mockReturnValueOnce(
        JSON.stringify({
          'naruto-filters': {
            name: 'Naruto Uzumaki',
            age: 20,
            village: 'Hidden Leaf',
          },
        })
      );
      window.location.search = '';
    });

    it('should return the state from the session storage', () => {
      const { result } = renderHookWithProps({
        initialState: {},
        sessionKey: 'naruto-filters',
      });
      expect(result.current.state).toEqual({
        name: 'Naruto Uzumaki',
        age: 20,
        village: 'Hidden Leaf',
      });
    });
  });

  describe('when the sessionKey is not provided', () => {
    it('should not update the session storage', async () => {
      const { result } = renderHookWithProps({
        initialState: {
          name: 'Naruto Uzumaki',
        },
      });

      await act(async () => {
        result.current.updateState({ name: 'Sakura Haruno' });
      });

      expect(result.current.state).toEqual({
        name: 'Sakura Haruno',
      });

      expect(window.sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('when the change is same as the initial value', () => {
    it('should handle arrays', async () => {
      const { result } = renderHookWithProps({
        initialState: { villages: [] },
        sessionKey: 'naruto-filters',
      });

      await act(async () => {
        result.current.updateState({
          villages: ['Hidden Leaf', 'Hidden Sand', 'Hidden Stone'],
        });
      });

      expect(result.current.state).toEqual({
        villages: ['Hidden Leaf', 'Hidden Sand', 'Hidden Stone'],
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        JSON.stringify({
          'naruto-filters': {
            villages: ['Hidden Leaf', 'Hidden Sand', 'Hidden Stone'],
          },
        })
      );

      await act(async () => {
        result.current.updateState({ villages: [] });
      });

      expect(result.current.state).toEqual({
        villages: [],
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        '{}'
      );
    });

    it('should handle objects', async () => {
      const { result } = renderHookWithProps({
        initialState: {
          village: {
            name: 'Hidden Leaf',
            head: 'Hiruzen Sarutobi',
          },
        },
        sessionKey: 'naruto-filters',
      });

      await act(async () => {
        result.current.updateState({
          village: {
            name: 'Hidden Sand',
            head: 'Gaara',
          },
        });
      });

      expect(result.current.state).toEqual({
        village: {
          name: 'Hidden Sand',
          head: 'Gaara',
        },
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        JSON.stringify({
          'naruto-filters': {
            village: {
              name: 'Hidden Sand',
              head: 'Gaara',
            },
          },
        })
      );

      await act(async () => {
        result.current.updateState({
          village: {
            name: 'Hidden Leaf',
            head: 'Hiruzen Sarutobi',
          },
        });
      });

      expect(result.current.state).toEqual({
        village: {
          name: 'Hidden Leaf',
          head: 'Hiruzen Sarutobi',
        },
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        '{}'
      );
    });

    it('should handle primitive values', async () => {
      const initialState = {
        name: 'Naruto Uzumaki',
        age: 20,
        village: 'Hidden Leaf',
      };

      const { result } = renderHookWithProps({
        initialState,
        sessionKey: 'naruto-filters',
      });

      await act(async () => {
        result.current.updateState({ name: 'Sakura Haruno', age: 18 });
      });

      expect(result.current.state).toEqual({
        name: 'Sakura Haruno',
        age: 18,
        village: 'Hidden Leaf',
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        JSON.stringify({
          'naruto-filters': {
            name: 'Sakura Haruno',
            age: 18,
          },
        })
      );

      await act(async () => {
        result.current.updateState({
          name: 'Naruto Uzumaki',
          age: 20,
        });
      });

      expect(result.current.state).toEqual(initialState);

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        '{}'
      );
    });
  });

  describe('when the resetState is called', () => {
    it('should reset the state and remove the state from the session storage', async () => {
      const initialState = { name: 'Naruto Uzumaki' };
      const { result } = renderHookWithProps({
        initialState,
        sessionKey: 'naruto-filters',
      });

      await act(async () => {
        result.current.resetState();
      });

      expect(result.current.state).toEqual(initialState);
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        '{}'
      );
    });
  });

  describe('when the enablePersistence is false', () => {
    beforeEach(() => {
      const state = {
        name: 'Naruto Uzumaki',
        age: 20,
        village: 'Hidden Leaf',
      };
      window.sessionStorage.getItem.mockReturnValueOnce(
        JSON.stringify({
          'naruto-filters': state,
        })
      );
      window.location.search = `?persistentState=${encodeURIComponent(
        JSON.stringify(state)
      )}`;
    });

    it('should return the initial state', async () => {
      const { result } = renderHookWithProps({
        initialState: { name: 'Sasuke Uchiha' },
        sessionKey: 'naruto-filters',
        enablePersistence: false,
      });

      expect(result.current.state).toEqual({
        name: 'Sasuke Uchiha',
      });
    });

    it('should not update the session storage', async () => {
      const { result } = renderHookWithProps({
        initialState: { name: 'Sasuke Uchiha' },
        sessionKey: 'naruto-filters',
        enablePersistence: false,
      });

      await act(async () => {
        result.current.updateState({ name: 'Sakura Haruno' });
      });

      expect(result.current.state).toEqual({ name: 'Sakura Haruno' });
      expect(window.sessionStorage.setItem).not.toHaveBeenCalled();
      expect(window.history.replaceState).not.toHaveBeenCalled();
    });
  });

  describe('when the excludeKeys is provided', () => {
    beforeEach(() => {
      window.sessionStorage.getItem = jest.fn();
      window.location.search = '';
    });

    it('should exclude the provided keys from storing in the session storage and url', async () => {
      const { result } = renderHookWithProps({
        initialState: { name: 'Naruto Uzumaki', age: 20 },
        sessionKey: 'naruto-filters',
        excludeKeys: ['name'],
      });

      await act(async () => {
        result.current.updateState({ name: 'Sakura Haruno', age: 18 });
      });

      expect(result.current.state).toEqual({
        name: 'Sakura Haruno',
        age: 18,
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'persistentState',
        JSON.stringify({
          'naruto-filters': { age: 18 },
        })
      );
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining(
          `?persistentState=${encodeURIComponent(JSON.stringify({ age: 18 }))}`
        )
      );
    });
  });
});
