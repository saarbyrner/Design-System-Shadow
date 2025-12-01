import { renderHook } from '@testing-library/react-hooks';

import { getTitle } from '../../../utils';
import { columns } from '../consts';
import { parsedCsv } from './consts.mock';
import { useTrainingVariablesImporterUploadGrid } from '..';

describe('useTrainingVariablesImporterUploadGrid', () => {
  it('returns a correct object', () => {
    const input = [];
    const result = renderHook(() =>
      useTrainingVariablesImporterUploadGrid({ parsedCsv: input })
    ).result.current;

    expect(result.grid).toHaveProperty('rows');

    expect(result.grid.emptyTableText).toEqual(
      'No valid data was found in CSV.'
    );
    expect(result.grid.id).toEqual('TrainingVariablesImporterUploadGrid');
    expect(result.grid.columns).toEqual(columns);
    expect(result.isLoading).toEqual(false);
    expect(result.isError).toEqual(false);
    expect(result.ruleset.description).toEqual(undefined);
    expect(result.title).toEqual(getTitle());
  });

  it('builds rows', () => {
    const result = renderHook(() =>
      useTrainingVariablesImporterUploadGrid({ parsedCsv })
    ).result.current;

    expect(result.grid.rows.length).toEqual(parsedCsv.length);

    result.grid.rows.forEach((row) =>
      expect(row.classnames.is__error).toEqual(false)
    );

    expect(result.isError).toBe(false);
  });

  it('marks rows with errors', () => {
    const parsedCsvWithErrors = parsedCsv.map((row) => ({
      ...row,
      first_name: '',
    }));

    const result = renderHook(() =>
      useTrainingVariablesImporterUploadGrid({ parsedCsv: parsedCsvWithErrors })
    ).result.current;

    result.grid.rows.forEach((row) =>
      expect(row.classnames.is__error).toEqual(true)
    );

    expect(result.isError).toBe(true);
  });

  it('merges the expected columns `columns` with all the passed ones from `parsedCsv`', () => {
    const result = renderHook(() =>
      useTrainingVariablesImporterUploadGrid({ parsedCsv })
    ).result.current;

    expect(result.grid.columns.length).toEqual(
      // The first argument may be missing some fields of the second one, and
      // vice versa. That’s why Math.max is needed.
      Math.max(Object.keys(parsedCsv[0]).length, result.grid.columns.length)
    );

    result.grid.rows.forEach((row) =>
      expect(row.classnames.is__error).toEqual(false)
    );

    expect(result.isError).toBe(false);
  });
});
