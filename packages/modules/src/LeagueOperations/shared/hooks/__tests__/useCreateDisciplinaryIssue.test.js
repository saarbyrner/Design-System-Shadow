import { renderHook, act } from '@testing-library/react-hooks';

import { Provider } from 'react-redux';
import {
  getDisciplineProfileId,
  getDisciplinaryIssueMode,
  getCurrentDisciplinaryIssue,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';

import { useCreateDisciplinaryIssueMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import useDisciplineToasts from '@kitman/modules/src/LeagueOperations/shared/hooks/useDisciplineToasts';
import { issue as mockedIssue } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_issue.mock';
import useBaseDisciplinaryIssue from '../useBaseDisciplinaryIssue';
import useCreateDisciplinaryIssue from '../useCreateDisciplinaryIssue';

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
    onClearCreateToasts: jest.fn(),
    onCreatePendingToast: jest.fn(),
    onCreateSuccessToast: jest.fn(),
    onCreateFailureToast: jest.fn(),
  });

  getDisciplineProfileId.mockReturnValue(123);
  getDisciplinaryIssueMode.mockReturnValue(mode);
  getCurrentDisciplinaryIssue.mockReturnValue(issue);

  useBaseDisciplinaryIssue.mockReturnValue({
    modalContent: () => 'Mocked modal text',
    handleOnCancel: jest.fn(),
    mode,
    formValidation: true,
    isIssueFormComplete: false,
    dispatch: jest.fn(),
  });
};

describe('useCreateDisciplinaryIssue', () => {
  describe('initial state', () => {
    beforeEach(() => {
      setupMocks({
        mode: 'EDIT_DISCIPLINARY_ISSUE',
        issue: mockedIssue,
      });
    });
    it('should return initial state correctly', () => {
      useCreateDisciplinaryIssueMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useCreateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toBe(true);
      expect(result.current.mode).toBe('EDIT_DISCIPLINARY_ISSUE');
      expect(typeof result.current.handleOnCreateDisciplinaryIssue).toBe(
        'function'
      );
      expect(typeof result.current.handleOnCancel).toBe('function');
    });
  });

  describe('when creating a disciplinary issue', () => {
    beforeEach(() => {
      setupMocks({
        mode: 'CREATE_DISCIPLINARY_ISSUE',
        issue: mockedIssue,
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should create the section successfully', async () => {
      const mockOnCreateIssue = jest.fn();
      useCreateDisciplinaryIssueMutation.mockReturnValue([
        mockOnCreateIssue.mockResolvedValue({
          data: { message: 'Discipline created' },
        }),
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);
      const { result } = renderHook(() => useCreateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      await act(async () => {
        result.current.handleOnCreateDisciplinaryIssue();
      });
      expect(useDisciplineToasts().onCreateSuccessToast).toHaveBeenCalled();
    });
    it('should handle a failed create', async () => {
      const mockOnCreateIssue = jest.fn();
      useCreateDisciplinaryIssueMutation.mockReturnValue([
        mockOnCreateIssue.mockResolvedValue({
          error: 'There has been an error',
        }),
        {
          isLoading: false,
          isError: true,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useCreateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        result.current.handleOnCreateDisciplinaryIssue();
      });

      expect(useDisciplineToasts().onCreateFailureToast).toHaveBeenCalled();
    });
  });

  describe('isDisabled', () => {
    beforeEach(() => {
      setupMocks({ mode: 'CREATE_DISCIPLINARY_ISSUE' });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should correctly change the value of isDisabled when the issue start_date or end_date is not valid', () => {
      setupMocks({
        mode: 'CREATE_DISCIPLINARY_ISSUE',
        issue: {
          ...mockedIssue,
          start_date: 'invalid_date',
          end_date: 'invalid_date',
        },
      });
      const { result } = renderHook(() => useCreateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toBe(true);
    });
    it('returns true when loading', () => {
      const mockOnCreateIssue = jest.fn();
      useCreateDisciplinaryIssueMutation.mockReturnValue([
        mockOnCreateIssue,
        {
          isLoading: true,
          isError: false,
          isSuccess: false,
        },
      ]);
      const { result } = renderHook(() => useCreateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toEqual(true);
    });
  });

  describe('useCreateDisciplinaryIssue FF', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-discipline-area-v2'] = true;

      setupMocks({
        mode: 'CREATE_DISCIPLINARY_ISSUE',
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
      const mockOnCreateIssue = jest.fn();
      useCreateDisciplinaryIssueMutation.mockReturnValue([
        mockOnCreateIssue.mockResolvedValue({
          data: { message: 'Discipline created' },
        }),
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);
      const { result } = renderHook(() => useCreateDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
      await act(async () => {
        result.current.handleOnCreateDisciplinaryIssue();
      });
      expect(result.current.isDisabled).toBe(false);
      expect(result.current.modalText()).toBe('Mocked modal text');
      expect(useDisciplineToasts().onCreateSuccessToast).toHaveBeenCalled();
    });
  });
});
