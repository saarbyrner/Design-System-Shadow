import { renderHook } from '@testing-library/react-hooks';
import { setFilter } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/manageLabelsSlice';
import { Provider } from 'react-redux';
import { act } from 'react-test-renderer';
import { configureStore } from '@reduxjs/toolkit';
import labels from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/reducers';
import { useFilter } from '../useFilter';
import { manageLabelsStateKey } from '../../consts';

const defaultStore = {
  manageLabelsSlice: {
    isLabelModalOpen: false,
    filters: {
      searchValue: '',
      createdBy: [],
    },
  },
};

const wrapper = ({ children }) => {
  return (
    <Provider store={configureStore({ reducer: labels, defaultStore })}>
      {children}
    </Provider>
  );
};
describe('SharedFilters|useFilter', () => {
  it('returns the initial state of a filter in the first render', () => {
    const { result } = renderHook(
      () => useFilter('searchValue', manageLabelsStateKey, setFilter),
      {
        wrapper,
      }
    );

    expect(result.current.filter).toStrictEqual('');
  });

  it('returns the initial state of another filter in the first render', () => {
    const { result } = renderHook(
      () => useFilter('createdBy', manageLabelsStateKey, setFilter),
      {
        wrapper,
      }
    );

    expect(result.current.filter).toStrictEqual([]);
  });

  it('updates the filter value when calling setFilter', async () => {
    const { result } = renderHook(
      () => useFilter('searchValue', manageLabelsStateKey, setFilter),
      {
        wrapper,
      }
    );

    expect(result.current.filter).toStrictEqual('');

    act(() => {
      result.current.setFilter('myNewValue');
    });

    expect(result.current.filter).toStrictEqual('myNewValue');
  });

  it('updates another filter value when calling setFilter', async () => {
    const { result } = renderHook(
      () => useFilter('createdBy', manageLabelsStateKey, setFilter),
      {
        wrapper,
      }
    );

    expect(result.current.filter).toStrictEqual([]);

    act(() => {
      result.current.setFilter([1, 2, 3]);
    });

    expect(result.current.filter).toStrictEqual([1, 2, 3]);
  });
});
