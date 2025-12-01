/**
 * * @typedef {import("../../redux/types").FilterKey} FilterKey
 */
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

import { useFilter } from '../hooks';
import { initialFilters, filtersSavedInLocalStorageSet } from '../consts';
import { localStorageKey } from '../helpers';
import { setupStore } from '../../redux/store';

const filterKeys = Object.keys(initialFilters);

describe('hooks', () => {
  describe('useFilter', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
      });
    });
    const AppReduxWrapper = ({ children }) => {
      return <Provider store={setupStore({})}>{children}</Provider>;
    };

    /**
     *
     * @param {FilterKey} filterKey
     */
    const getSetFilterValue = (filterKey) => {
      switch (filterKey) {
        case ['locationTypes']:
          return 'Away';
        default:
          return [123];
      }
    };

    it.each(filterKeys)(
      'should return the initial state after the first render for %p',
      (filterKey) => {
        const { result } = renderHook(() => useFilter(filterKey), {
          wrapper: AppReduxWrapper,
        });

        expect(result.current.filter).toStrictEqual(initialFilters[filterKey]);
      }
    );

    it.each(filterKeys)(
      'should return the updated filter for %p',
      (filterKey) => {
        const { result } = renderHook(() => useFilter(filterKey), {
          wrapper: AppReduxWrapper,
        });

        expect(result.current.filter).toStrictEqual(initialFilters[filterKey]);

        const setItemSpy = jest.spyOn(window.localStorage, 'setItem');

        const value = getSetFilterValue(filterKey);

        act(() => {
          result.current.setFilter(value);
        });

        expect(result.current.filter).toStrictEqual(value);
        if (filtersSavedInLocalStorageSet.has(filterKey)) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(setItemSpy).toHaveBeenCalledWith(
            localStorageKey,
            JSON.stringify({ ...initialFilters, [filterKey]: value })
          );
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(setItemSpy).not.toHaveBeenCalled();
        }
      }
    );
  });
});
