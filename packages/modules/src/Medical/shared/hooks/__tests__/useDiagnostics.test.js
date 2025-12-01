import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';

import { data as mockedDiagnostics } from '@kitman/services/src/mocks/handlers/medical/getDiagnostics';

import { getDefaultDiagnosticFilters } from '../../utils';
import useDiagnostics from '../useDiagnostics';

describe('useDiagnostics', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        $.Deferred().resolveWith(null, [mockedDiagnostics])
      );
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('returns the expected data when fetching diagnostics', async () => {
    const { result } = renderHook(() => useDiagnostics());

    const mockedFilters = getDefaultDiagnosticFilters({ athleteId: 1 });
    result.current.fetchDiagnostics(mockedFilters, false);

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(result.current.diagnostics).toEqual(mockedDiagnostics.diagnostics);
  });

  it('restores the list of diagnostics when reseting', async () => {
    const { result } = renderHook(() => useDiagnostics());

    const mockedFilters = getDefaultDiagnosticFilters({ athleteId: 1 });
    result.current.fetchDiagnostics(mockedFilters, false);
    await Promise.resolve();

    result.current.resetDiagnostics();
    expect(result.current.diagnostics).toEqual([]);
  });
});
