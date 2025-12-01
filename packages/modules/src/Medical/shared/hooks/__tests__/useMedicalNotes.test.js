import { axios } from '@kitman/common/src/utils/services';
import { data as mockedMedicalNotes } from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes';
import { act } from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';
import { data as mockedExpiredNote } from '@kitman/services/src/mocks/handlers/medical/expireNote';
import { getDefaultNotesFilters } from '../../utils';
import useMedicalNotes from '../useMedicalNotes';

jest.mock('@kitman/common/src/utils/services', () => {
  return {
    ...jest.requireActual('@kitman/common/src/utils/services'),
    axios: {
      create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      })),
      post: jest.fn(),
    },
  };
});

describe('useMedicalNotes', () => {
  beforeEach(() => {
    axios.post.mockResolvedValueOnce({ data: mockedMedicalNotes });
  });

  it('returns the expected data when fetching medical notes', async () => {
    const { result } = renderHook(() =>
      useMedicalNotes({ withPagination: false })
    );

    const mockedFilters = getDefaultNotesFilters({
      athleteId: 1,
    });

    await act(async () => {
      result.current.fetchMedicalNotes(mockedFilters, false);
    });
    expect(result.current.medicalNotes).toEqual(
      mockedMedicalNotes.medical_notes
    );
  });

  it('restores the list of medical notes when reseting', async () => {
    const { result } = renderHook(() =>
      useMedicalNotes({ withPagination: false })
    );

    const mockedFilters = getDefaultNotesFilters({
      athleteId: 1,
    });

    await act(async () => {
      result.current.fetchMedicalNotes(mockedFilters, false);
    });

    expect(result.current.medicalNotes).toEqual(
      mockedMedicalNotes.medical_notes
    );
    await act(async () => {
      result.current.resetMedicalNotes();
    });
    expect(result.current.medicalNotes).toEqual([]);
  });

  it('sets a specific medical note as expired when expiring', async () => {
    const { result } = renderHook(() =>
      useMedicalNotes({ withPagination: false })
    );

    const mockedFilters = getDefaultNotesFilters({
      athleteId: 1,
    });

    await act(async () => {
      result.current.fetchMedicalNotes(mockedFilters, false);
      result.current.expireMedicalNote(1);
    });

    expect(result.current.medicalNotes[0]).toEqual(mockedExpiredNote);
    expect(result.current.lastMedicalNoteUpdatedByStatusId).toEqual(null);
  });
});
