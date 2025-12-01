import { renderHook } from '@testing-library/react-hooks';
import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_official_csv';
import useOfficialUploadGrid from '../useOfficialUploadGrid';

describe('useOfficialUploadGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', () => {
      renderHookResult = renderHook(() =>
        useOfficialUploadGrid({ parsedCsv: data.validData })
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
        useOfficialUploadGrid({ parsedCsv: testData })
      ).result;

      const columns = renderHookResult.current.grid.columns;
      expect(columns).toHaveLength(5);
      expect(renderHookResult.current.grid.rows.length).toEqual(
        testData.length
      );
      expect(columns[0].id).toEqual('FirstName');
      expect(columns[1].id).toEqual('LastName');
      expect(columns[2].id).toEqual('Email');
      expect(columns[3].id).toEqual('DOB');
      expect(columns[4].id).toEqual('Language');
    });

    it('correctly sets the rows with errors', () => {
      renderHookResult = renderHook(() =>
        useOfficialUploadGrid({ parsedCsv: testData })
      ).result;

      const rows = renderHookResult.current.grid.rows;
      expect(rows.length).toEqual(testData.length);
      expect(rows[0].classnames.is__error).toEqual(false);
      expect(rows[1].classnames.is__error).toEqual(true);
    });

    it('exposes the correct values when invalid', () => {
      renderHookResult = renderHook(() =>
        useOfficialUploadGrid({ parsedCsv: data.invalidData })
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when invalid, when error is not on last row', async () => {
      const testDataWithErrorNotOnLastRow = [
        ...data.invalidData,
        ...data.validData,
      ];

      renderHookResult = renderHook(() =>
        useOfficialUploadGrid({ parsedCsv: testDataWithErrorNotOnLastRow })
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when valid', () => {
      renderHookResult = renderHook(() =>
        useOfficialUploadGrid({ parsedCsv: data.validData })
      ).result;
      expect(renderHookResult.current.isError).toBe(false);
    });
  });

  describe('[isError]', () => {
    let renderHookResult;

    it('exposes the correct value when isError', () => {
      renderHookResult = renderHook(() =>
        useOfficialUploadGrid({ parsedCsv: data.invalidData })
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });
  });
});
