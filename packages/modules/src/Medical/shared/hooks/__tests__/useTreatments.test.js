import { renderHook } from '@testing-library/react-hooks';
import { data as mockedTreatments } from '@kitman/services/src/mocks/handlers/medical/getTreatments';
import { waitFor } from '@testing-library/react';
import { getDefaultTreatmentFilters } from '../../utils';
import useTreatments from '../useTreatments';

describe('useTreatments', () => {
  it('returns the expected data when fetching treatments', async () => {
    const { result } = renderHook(() => useTreatments());

    const mockedFilters = getDefaultTreatmentFilters({
      athleteId: 1,
    });

    await result.current.fetchTreatments(mockedFilters, false);

    await waitFor(() => {
      expect(result.current.treatments).toEqual(
        mockedTreatments.treatment_sessions
      );
    });
  });

  it('restores the list of treatments when resetting', async () => {
    const { result } = renderHook(() => useTreatments());

    const mockedFilters = getDefaultTreatmentFilters({
      athleteId: 1,
    });

    result.current.fetchTreatments(mockedFilters, false);

    result.current.resetTreatments();

    expect(result.current.treatments).toEqual([]);
  });
});
