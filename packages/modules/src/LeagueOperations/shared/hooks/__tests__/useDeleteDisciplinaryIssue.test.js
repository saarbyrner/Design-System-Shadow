import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  getDisciplineProfileId,
  getDisciplinaryIssueMode,
  getCurrentDisciplinaryIssue,
  getActiveDisciplinaryIssue,
  getDisciplineProfile,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';

import { useDeleteDisciplinaryIssueMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import useDisciplineToasts from '@kitman/modules/src/LeagueOperations/shared/hooks/useDisciplineToasts';
import {
  issue as mockedIssue,
  activeIssue as activeIssueMock,
  profile as mockedProfile,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_issue.mock';

import useDeleteDisciplinaryIssue from '../useDeleteDisciplinaryIssue';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors'
    ),
    getDisciplineProfileId: jest.fn(),
    getDisciplinaryIssueMode: jest.fn(),
    getCurrentDisciplinaryIssue: jest.fn(),
    getActiveDisciplinaryIssue: jest.fn(),
    getDisciplineProfile: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useDisciplineToasts'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  'LeagueOperations.discipline.slice.manage': {},
});

let store;

const setupMocks = ({ mode = 'DELETE_DISCIPLINARY_ISSUE' }) => {
  store = defaultStore;

  useDisciplineToasts.mockReturnValue({
    onClearDeleteToasts: jest.fn(),
    onDeleteSuccessToast: jest.fn(),
    onDeleteFailureToast: jest.fn(),
    onDeletePendingToast: jest.fn(),
  });

  getDisciplineProfileId.mockReturnValue(123);
  getDisciplinaryIssueMode.mockReturnValue(mode);
  getCurrentDisciplinaryIssue.mockReturnValue(mockedIssue);
  getActiveDisciplinaryIssue.mockReturnValue(activeIssueMock);
  getDisciplineProfile.mockReturnValue(mockedProfile);
};

describe('useDeleteDisciplinaryIssue', () => {
  describe('initial state', () => {
    beforeEach(() => {
      setupMocks({
        mode: 'DELETE_DISCIPLINARY_ISSUE',
      });
    });
    it('should return initial state correctly', () => {
      useDeleteDisciplinaryIssueMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useDeleteDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toBe(false);
      expect(result.current.mode).toBe('DELETE_DISCIPLINARY_ISSUE');
      expect(typeof result.current.handleOnDeleteDisciplinaryIssue).toBe(
        'function'
      );
      expect(typeof result.current.handleOnCancel).toBe('function');
    });
  });

  describe('when deleting a disciplinary issue', () => {
    beforeEach(() => {
      setupMocks({
        mode: 'DELETE_DISCIPLINARY_ISSUE',
        issue: mockedIssue,
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should delete the disciplinary issue successfully', async () => {
      const mockOnDeleteIssue = jest.fn();
      useDeleteDisciplinaryIssueMutation.mockReturnValue([
        mockOnDeleteIssue.mockResolvedValue({
          data: { message: 'Discipline deleted' },
        }),
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);
      const { result } = renderHook(() => useDeleteDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      await act(async () => {
        result.current.handleOnDeleteDisciplinaryIssue();
      });
      expect(useDisciplineToasts().onDeleteSuccessToast).toHaveBeenCalled();
    });
    it('should handle a failed delete', async () => {
      const mockOnDeleteIssue = jest.fn();
      useDeleteDisciplinaryIssueMutation.mockReturnValue([
        mockOnDeleteIssue.mockResolvedValue({
          error: 'There has been an error',
        }),
        {
          isLoading: false,
          isError: true,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useDeleteDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        result.current.handleOnDeleteDisciplinaryIssue();
      });

      expect(useDisciplineToasts().onDeleteFailureToast).toHaveBeenCalled();
    });
  });
});
