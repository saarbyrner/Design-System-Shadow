import { renderHook } from '@testing-library/react-hooks';

import AppRoot from '@kitman/modules/src/AppRoot';
import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_baselines_csv';

import useBaselinesUploadGrid from '../useBaselinesUploadGrid';

describe('useBaselinesUploadGrid', () => {
  const wrapper = AppRoot;

  describe('[initial data]', () => {
    it('returns initial data', () => {
      const renderHookResult = renderHook(
        () => useBaselinesUploadGrid({ parsedCsv: data.validData }),
        { wrapper }
      ).result;

      expect(renderHookResult.current).toHaveProperty('grid');

      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current).toHaveProperty('isError');
      expect(renderHookResult.current).toHaveProperty('ruleset');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No valid data was found in csv.'
      );
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;
    const testData = [...data.validData, ...data.invalidData];

    it('correctly parses the csv data', () => {
      renderHookResult = renderHook(
        () => useBaselinesUploadGrid({ parsedCsv: testData }),
        {
          wrapper,
        }
      ).result;

      const columns = renderHookResult.current.grid.columns;
      expect(columns).toHaveLength(9);
      expect(renderHookResult.current.grid.rows.length).toEqual(
        testData.length
      );
      expect(columns).toMatchSnapshot();
    });

    it('correctly sets the rows with errors', () => {
      renderHookResult = renderHook(
        () => useBaselinesUploadGrid({ parsedCsv: testData }),
        {
          wrapper,
        }
      ).result;

      const rows = renderHookResult.current.grid.rows;
      expect(rows.length).toEqual(testData.length);
      expect(rows[0].classnames.is__error).toEqual(false);
      expect(rows[1].classnames.is__error).toEqual(true);
    });

    it('exposes the correct values when invalid', () => {
      renderHookResult = renderHook(
        () => useBaselinesUploadGrid({ parsedCsv: testData }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when invalid, when error is not on last row', async () => {
      const testDataWithErrorNotOnLastRow = [
        ...data.invalidData,
        ...data.validData,
      ];

      renderHookResult = renderHook(
        () =>
          useBaselinesUploadGrid({ parsedCsv: testDataWithErrorNotOnLastRow }),
        { wrapper }
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when valid', () => {
      renderHookResult = renderHook(
        () => useBaselinesUploadGrid({ parsedCsv: data.validData }),
        { wrapper }
      ).result;

      expect(renderHookResult.current.isError).toBe(false);
    });
  });

  describe('[isError]', () => {
    let renderHookResult;

    it('exposes the correct value when isError', () => {
      renderHookResult = renderHook(
        () => useBaselinesUploadGrid({ parsedCsv: data.invalidData }),
        { wrapper }
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct value when isError caused by height data', () => {
      renderHookResult = renderHook(
        () =>
          useBaselinesUploadGrid({
            parsedCsv: data.invalidDataWithInvalidHeight,
          }),
        { wrapper }
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });
  });
});
