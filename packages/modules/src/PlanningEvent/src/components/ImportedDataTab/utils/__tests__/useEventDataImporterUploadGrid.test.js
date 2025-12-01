import { renderHook } from '@testing-library/react-hooks';

import {
  validData,
  invalidData,
} from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_kitman_custom_data_csv';
import { server, rest } from '@kitman/services/src/mocks/server';

import { useEventDataImporterUploadGrid } from '../useEventDataImporterUploadGrid';

const parseFile = jest.requireActual(
  '@kitman/services/src/services/planningEvent/parseFile'
);
const parseFileSpy = jest.spyOn(parseFile, 'default');

describe('useEventDataImporter', () => {
  const defaultParams = {
    parsedCsv: validData,
    file: new File([], 'test.csv', { type: 'text/csv' }),
    source: 'custom',
    setParseState: jest.fn(),
    setCustomErrors: jest.fn(),
    activeStep: 1,
    setHasFilePondProcessed: jest.fn(),
    setHasFilePondErrored: jest.fn(),
  };

  it('returns the correct initial data', () => {
    const result = renderHook(() =>
      useEventDataImporterUploadGrid(defaultParams)
    ).result.current;

    expect(result.grid).toHaveProperty('rows');
    expect(result.grid.emptyTableText).toEqual(
      'No valid data was found in CSV.'
    );
    expect(result.grid.id).toEqual('EventDataImporterUploadGrid');
    expect(result.grid.columns).toMatchSnapshot();
    expect(result.isLoading).toEqual(false);
    expect(result.isError).toEqual(false);
    expect(result.ruleset.description).toEqual(undefined);
  });

  it('builds rows without errors', () => {
    const result = renderHook(() =>
      useEventDataImporterUploadGrid(defaultParams)
    ).result.current;

    expect(result.grid.rows.length).toEqual(validData.length);

    result.grid.rows.forEach((row) =>
      expect(row.classnames.is__error).toEqual(false)
    );

    expect(result.isError).toBe(false);
  });

  it('renders the ruleset as expected', async () => {
    const result = renderHook(() =>
      useEventDataImporterUploadGrid(defaultParams)
    ).result.current;

    expect(result.ruleset).toMatchSnapshot();
  });

  describe('parseFile', () => {
    it('should not parse the file if there is no file', () => {
      renderHook(() =>
        useEventDataImporterUploadGrid({ ...defaultParams, file: null })
      );
      expect(parseFileSpy).not.toHaveBeenCalled();
    });

    it('should parse the file if there is a file and source passed and the active step is 2', () => {
      renderHook(() =>
        useEventDataImporterUploadGrid({ ...defaultParams, activeStep: 2 })
      );
      expect(parseFileSpy).toHaveBeenCalled();
    });

    it('sets parseState to ERROR and sets customErrors when parseFile fails', async () => {
      const mockErrors = [
        'File is empty',
        'File has no header row (expecting a line starting with \'["date time"]\')',
        'File invalid CSV (no implicit conversion from nil to integer)',
      ];
      server.use(
        rest.post('/workloads/import_workflow/parse_file', (req, res, ctx) => {
          return res(
            ctx.json({
              success: false,
              errors: mockErrors,
            })
          );
        })
      );

      const { waitForNextUpdate } = renderHook(() =>
        useEventDataImporterUploadGrid({
          ...defaultParams,
          parsedCsv: invalidData,
          activeStep: 2,
        })
      );

      await waitForNextUpdate();

      expect(defaultParams.setParseState).toHaveBeenCalledWith('ERROR');
      expect(defaultParams.setCustomErrors).toHaveBeenCalledWith({
        errors: mockErrors,
        isSuccess: false,
      });
    });
  });
});
