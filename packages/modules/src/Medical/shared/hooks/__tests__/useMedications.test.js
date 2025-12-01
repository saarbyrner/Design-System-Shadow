import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import { act } from 'react-test-renderer';
import { data as mockedMedications } from '@kitman/services/src/mocks/handlers/medical/getDrFirstMedicationsData';
import { getDrFirstMedications } from '@kitman/services';
import { getDefaultDrFirstMedicationsFilters } from '../../utils';
import useMedications from '../useMedications';

jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  getDrFirstMedications: jest.fn(),
}));
describe('useMedications', () => {
  beforeEach(() => {
    const deferred = $.Deferred();
    deferred.resolveWith(null, [mockedMedications]);

    sinon.stub($, 'ajax').returns(deferred);
  });

  afterEach(() => {
    $.ajax.restore();
  });
  it('returns the expected data when fetching medications', async () => {
    getDrFirstMedications.mockReturnValue({ ...mockedMedications });
    const { result } = renderHook(() => useMedications());
    await act(async () => {
      const mockedFilters = getDefaultDrFirstMedicationsFilters({
        athleteId: 1,
      });
      result.current.fetchMedications(mockedFilters, 30);
    });
    await new Promise((r) => setTimeout(r, 5000));
    expect(result.current.medications).to.deep.equal([
      ...mockedMedications.medications,
    ]);
  });

  it('restores the list of medications when resetting', async () => {
    const { result } = renderHook(() => useMedications());
    const mockedFilters = getDefaultDrFirstMedicationsFilters({
      athleteId: 1,
    });
    await act(async () => {
      result.current.fetchMedications(mockedFilters, false);
      await Promise.resolve();
      result.current.resetMedications();
    });
    expect(result.current.medications).to.deep.equal([]);
  });
});
