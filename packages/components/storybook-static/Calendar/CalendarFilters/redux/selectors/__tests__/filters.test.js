import { storeMock } from '../../../../__tests__/consts';
import { reducerKey } from '../../consts';
import { getFilterFactory, getFilters } from '../filters';

const store = storeMock.getState();

describe('Filters - selectors', () => {
  it('should return the filters', () => {
    expect(getFilters(store)).toEqual(store.calendarPage[reducerKey]);
  });

  it.each(Object.keys(store.calendarPage[reducerKey]))(
    'should return the filter for %p',
    (filterKey) => {
      const selector = getFilterFactory(filterKey);
      expect(selector(store)).toEqual(
        store.calendarPage[reducerKey][filterKey]
      );
    }
  );
});
