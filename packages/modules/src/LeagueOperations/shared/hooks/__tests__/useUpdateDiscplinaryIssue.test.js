import { renderHook, act } from '@testing-library/react-hooks';

import { Provider } from 'react-redux';
import {
  getDisciplineProfileId,
  getDisciplinaryIssueMode,
  getCurrentDisciplinaryIssue,
  getActiveDisciplinaryIssue,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';

import { useUpdateDisciplinaryIssueMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';

import useDisciplineToasts from '@kitman/modules/src/LeagueOperations/shared/hooks/useDisciplineToasts';
import {
  issue as mockedIssue,
  activeIssue,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_issue.mock';

import useBaseDisciplinaryIssue from '../useBaseDisciplinaryIssue';
import useUpdateDisciplinaryIssue from '../useUpdateDisciplinaryIssue';

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
  })
);

jest.mock('../useBaseDisciplinaryIssue', () => jest.fn());
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

const setupMocks = ({ mode = 'EDIT', issue = {} }) => {
  store = defaultStore;

  useDisciplineToasts.mockReturnValue({
    onClearUpdateToasts: jest.fn(),
    onUpdateSuccessToast: jest.fn(),
    onUpdateFailureToast: jest.fn(),
    onUpdatePendingToast: jest.fn(),
  });

  getDisciplineProfileId.mockReturnValue(123);
  getDisciplinaryIssueMode.mockReturnValue(mode);
  getCurrentDisciplinaryIssue.mockReturnValue(issue);
  getActiveDisciplinaryIssue.mockReturnValue(activeIssue);

  useBaseDisciplinaryIssue.mockReturnValue({
    modalContent: () => 'Mocked modal text',
    formValidation: true,
    isIssueFormComplete: false,
    mode,
    handleOnCancel: jest.fn(),
    dispatch: jest.fn(),
  });
};

describe('useUpdateDisciplinaryIssue', () => {
  describe('initial state', () => {
    beforeEach(() => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: mockedIssue,
      });
    });
    it('should return initial state correctly', () => {
      useUpdateDisciplinaryIssueMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useUpdateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toBe(true);
      expect(result.current.mode).toBe('UPDATE_DISCIPLINARY_ISSUE');
      expect(typeof result.current.handleOnUpdateDisciplinaryIssue).toBe(
        'function'
      );
      expect(typeof result.current.handleOnCancel).toBe('function');
    });
  });

  describe('when updating a disciplinary issue', () => {
    beforeEach(() => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: mockedIssue,
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should update the section successfully', async () => {
      const mockOnUpdateIssue = jest.fn();
      useUpdateDisciplinaryIssueMutation.mockReturnValue([
        mockOnUpdateIssue.mockResolvedValue({
          data: { message: 'Discipline updated' },
        }),
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);
      const { result } = renderHook(() => useUpdateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      await act(async () => {
        result.current.handleOnUpdateDisciplinaryIssue();
      });
      expect(useDisciplineToasts().onUpdateSuccessToast).toHaveBeenCalled();
    });

    it('should correctly change the value of isDisabled when the issue start_date or end_date is not valid', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...mockedIssue,
          start_date: 'invalid_date',
          end_date: 'invalid_date',
        },
      });
      const { result } = renderHook(() => useUpdateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toBe(true);
    });
    it('should handle a failed update', async () => {
      const mockOnUpdateIssue = jest.fn();
      useUpdateDisciplinaryIssueMutation.mockReturnValue([
        mockOnUpdateIssue.mockResolvedValue({
          error: 'There has been an error',
        }),
        {
          isLoading: false,
          isError: true,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useUpdateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        result.current.handleOnUpdateDisciplinaryIssue();
      });

      expect(useDisciplineToasts().onUpdateFailureToast).toHaveBeenCalled();
    });
  });

  describe('useUpdateDisciplinaryIssue FF', () => {
    beforeEach(() => {
      window.setFlag('league-ops-discipline-area-v2', true);

      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...mockedIssue,
          end_date: null,
          start_date: '2025-07-16T04:00:00.000Z',
          squad_id: 456,
          number_of_games: 3,
          kind: 'number_of_games',
        },
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create the section successfully', async () => {
      const mockOnUpdateIssue = jest.fn();
      useUpdateDisciplinaryIssueMutation.mockReturnValue([
        mockOnUpdateIssue.mockResolvedValue({
          data: { message: 'Discipline updated' },
        }),
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);
      const { result } = renderHook(() => useUpdateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      await act(async () => {
        result.current.handleOnUpdateDisciplinaryIssue();
      });

      expect(result.current.isDisabled).toBe(false);
      expect(result.current.modalText()).toBe('Mocked modal text');
      expect(useDisciplineToasts().onUpdateSuccessToast).toHaveBeenCalled();
    });

    it('should be unsuccessful', async () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...mockedIssue,
          end_date: null,
          start_date: '2025-07-16T04:00:00.000Z',
          squad_id: null,
          number_of_games: null,
          kind: 'number_of_games',
        },
      });

      useBaseDisciplinaryIssue.mockReturnValue({
        modalContent: () => '',
        formValidation: false,
        isIssueFormComplete: true,
        dispatch: jest.fn(),
      });

      const mockOnUpdateIssue = jest.fn();
      useUpdateDisciplinaryIssueMutation.mockReturnValue([
        mockOnUpdateIssue.mockResolvedValue({
          error: 'There has been an error',
        }),
        {
          isLoading: false,
          isError: true,
          isSuccess: false,
        },
      ]);
      const { result } = renderHook(() => useUpdateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      await act(async () => {
        result.current.handleOnUpdateDisciplinaryIssue();
      });

      expect(result.current.isDisabled).toBe(true);
      expect(result.current.modalText()).toBe('');
      expect(useDisciplineToasts().onUpdateFailureToast).toHaveBeenCalled();
    });
  });
});
