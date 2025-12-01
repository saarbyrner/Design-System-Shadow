import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';

import mockedProcedures from '@kitman/services/src/mocks/handlers/medical/procedures/data.mock';

import { getDefaultProceduresFilters } from '../../utils';
import useProcedures from '../useProcedures';

describe('useProcedures', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        $.Deferred().resolveWith(null, [mockedProcedures])
      );
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('returns the expected data when fetching procedures', async () => {
    const { result } = renderHook(() => useProcedures());

    const mockedFilters = getDefaultProceduresFilters({ athleteId: 1 });
    result.current.fetchProcedures(mockedFilters, false);
    await Promise.resolve();

    expect(result.current.procedures).toEqual(mockedProcedures.procedures);
  });

  it('restores the list of procedures when reseting', async () => {
    const { result } = renderHook(() => useProcedures());

    const mockedFilters = getDefaultProceduresFilters({ athleteId: 1 });
    result.current.fetchProcedures(mockedFilters, false);
    await Promise.resolve();

    result.current.resetProcedures();
    expect(result.current.procedures).toEqual([]);
  });
});
