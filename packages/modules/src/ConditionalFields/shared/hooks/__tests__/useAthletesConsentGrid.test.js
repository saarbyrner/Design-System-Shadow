import { renderHook, act } from '@testing-library/react-hooks';
import ReduxProvider from '@kitman/modules/src/ConditionalFields/shared/redux/provider';
import { data as mockData } from '@kitman/services/src/mocks/handlers/consent/searchAthletes.mock';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
} from '@kitman/common/src/types/Consent';
import useAthletesConsentGrid, {
  getEmptyTableText,
} from '@kitman/modules/src/ConditionalFields/shared/hooks/useAthletesConsentGrid';

jest.useFakeTimers();

const defaultFilter = {
  consentable_type: CONSENTABLE_TYPE.Organisation,
  consenting_to: CONSENTING_TO.injury_surveillance_export,
  search_expression: '',
  include_inactive: false,
  is_active: true,
  consent_status: null,
  squad_ids: null,
  per_page: 100,
  page: 1,
};

const wrapper = ReduxProvider;

describe('useConsentGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useAthletesConsentGrid({
              consentableType: 3,
            }),
          {
            wrapper,
          }
        ).result;
      });

      expect(renderHookResult.current).toHaveProperty('isAthleteListError');
      expect(renderHookResult.current).toHaveProperty('isAthleteListFetching');
      expect(renderHookResult.current).toHaveProperty('filters');
      expect(renderHookResult.current).toHaveProperty('onSearch');
      expect(renderHookResult.current).toHaveProperty('onUpdateFilter');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.filters).toHaveProperty(
        'search_expression'
      );
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No athletes'
      );
      expect(renderHookResult.current.grid.id).toEqual('AthletesConsentGrid');

      expect(renderHookResult.current).toHaveProperty('meta');
      expect(renderHookResult.current.meta).toHaveProperty('current_page');
      expect(renderHookResult.current.meta).toHaveProperty('next_page');
      expect(renderHookResult.current.meta).toHaveProperty('prev_page');
      expect(renderHookResult.current.meta).toHaveProperty('total_count');
      expect(renderHookResult.current.meta).toHaveProperty('total_pages');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the athletes consent', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useAthletesConsentGrid({
              consentableType: CONSENTABLE_TYPE.Organisation,
            }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.data.length
        );
      });
    });

    it('has the correct grid.rows', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useAthletesConsentGrid({
              consentableType: CONSENTABLE_TYPE.Organisation,
            }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.data.length
        );
        const rows = renderHookResult.current.grid.rows;

        rows.forEach((row, index) => {
          expect(row.id).toEqual(mockData.data[index].id);
        });
      });
    });
  });

  describe('[FILTERS]', () => {
    let renderHookResult;

    beforeEach(async () => {
      jest.useFakeTimers();

      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useAthletesConsentGrid({
              consentableType: CONSENTABLE_TYPE.Organisation,
            }),
          {
            wrapper,
          }
        ).result;
      });
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('correctly updates the filter for squad_ids', async () => {
      await act(async () => {
        renderHookResult.current.onUpdateFilter({
          squad_ids: [266],
        });
      });

      await act(async () => {
        expect(renderHookResult.current.filters).toEqual({
          ...defaultFilter,
          squad_ids: [266],
        });
      });
    });
  });
});

describe('[FILTERS RESET]', () => {
  let renderHookResult;

  beforeEach(async () => {
    jest.useFakeTimers();

    await act(async () => {
      renderHookResult = renderHook(
        () =>
          useAthletesConsentGrid({
            consentableType: CONSENTABLE_TYPE.Organisation,
          }),
        {
          wrapper,
        }
      ).result;
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('correctly resets the page number for squad_ids', async () => {
    await act(async () => {
      renderHookResult.current.onUpdateFilter({
        squad_ids: [266],
      });
    });

    await act(async () => {
      expect(renderHookResult.current.filters).toEqual({
        ...defaultFilter,
        squad_ids: [266],
      });
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when there is no data', () => {
    expect(getEmptyTableText()).toEqual('No athletes');
  });
});
