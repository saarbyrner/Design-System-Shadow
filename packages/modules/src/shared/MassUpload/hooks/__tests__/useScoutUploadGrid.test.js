import { renderHook } from '@testing-library/react-hooks';
import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_scout_csv';
import useScoutUploadGrid from '../useScoutUploadGrid';

describe('useScoutUploadGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', () => {
      renderHookResult = renderHook(() =>
        useScoutUploadGrid({ parsedCsv: data.validData })
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
      renderHookResult = renderHook(() =>
        useScoutUploadGrid({ parsedCsv: testData })
      ).result;

      const columns = renderHookResult.current.grid.columns;
      expect(columns).toHaveLength(7);
      expect(renderHookResult.current.grid.rows.length).toEqual(
        testData.length
      );
      expect(columns[0].id).toEqual('FirstName');
      expect(columns[1].id).toEqual('LastName');
      expect(columns[2].id).toEqual('Email');
      expect(columns[3].id).toEqual('DOB');
      expect(columns[4].id).toEqual('Language');
      expect(columns[5].id).toEqual('Type');
      expect(columns[6].id).toEqual('Organisation');
    });

    it('correctly sets the rows with errors', () => {
      renderHookResult = renderHook(() =>
        useScoutUploadGrid({ parsedCsv: testData })
      ).result;

      const rows = renderHookResult.current.grid.rows;
      expect(rows.length).toEqual(testData.length);
      expect(rows[0].classnames.is__error).toEqual(false);
      expect(rows[1].classnames.is__error).toEqual(true);
    });

    it('exposes the correct values when invalid', () => {
      renderHookResult = renderHook(() =>
        useScoutUploadGrid({ parsedCsv: data.invalidData })
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when invalid, when error is not on last row', async () => {
      const testDataWithErrorNotOnLastRow = [
        ...data.invalidData,
        ...data.validData,
      ];

      renderHookResult = renderHook(() =>
        useScoutUploadGrid({ parsedCsv: testDataWithErrorNotOnLastRow })
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when valid', () => {
      renderHookResult = renderHook(() =>
        useScoutUploadGrid({ parsedCsv: data.validData })
      ).result;
      expect(renderHookResult.current.isError).toBe(false);
    });
  });

  describe('[isError]', () => {
    let renderHookResult;

    it('exposes the correct value when isError', () => {
      renderHookResult = renderHook(() =>
        useScoutUploadGrid({ parsedCsv: data.invalidData })
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });
  });
});
