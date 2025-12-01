import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  getDisciplinaryIssueMode,
  getCurrentDisciplinaryIssue,
  getDisciplineProfile,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { issue as mockedIssue } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_issue.mock';
import useNextGameDisciplineIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useNextGameDisciplineIssue';
import { useFetchDisciplineCompetitionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';

import SuspensionNotice from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/SuspensionNotice';

import useBaseDisciplinaryIssue from '../useBaseDisciplinaryIssue';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors'
    ),
    getDisciplinaryIssueMode: jest.fn(),
    getCurrentDisciplinaryIssue: jest.fn(),
    getDisciplineProfile: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useNextGameDisciplineIssue',
  () =>
    jest.fn(() => ({
      isNextGameValid: false,
    }))
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi'
);

const dateRange = {
  kind: 'date_range',
};
const numberOfGames = {
  kind: 'number_of_games',
};

const defaultSetupMocks = {
  user_id: 123,
  reason_ids: [1],
  start_date: '2024-03-20',
  end_date: '2024-03-25',
};
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: jest.fn(),
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  'LeagueOperations.discipline.slice.manage': {},
});

let store;

const mockProfile = {
  name: 'John Smith',
  id: 123,
};

const setupMocks = ({ mode = 'EDIT', issue = {}, profile = mockProfile }) => {
  store = defaultStore;
  getDisciplinaryIssueMode.mockReturnValue(mode);
  getCurrentDisciplinaryIssue.mockReturnValue(issue);
  getDisciplineProfile.mockReturnValue(profile);
};

describe('useBaseDisciplinaryIssue', () => {
  beforeEach(() => {
    useFetchDisciplineCompetitionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });
  describe('initial state', () => {
    beforeEach(() => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: mockedIssue,
      });
    });

    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.mode).toBe('UPDATE_DISCIPLINARY_ISSUE');
      expect(result.current.issue).toEqual(mockedIssue);
      expect(result.current.profile).toEqual(mockProfile);
      expect(typeof result.current.handleOnCancel).toBe('function');
      expect(typeof result.current.getModalText).toBe('function');
      expect(typeof result.current.dispatch).toBe('function');
    });
  });

  describe('form validation', () => {
    it('should mark form as complete when all required fields are valid', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          ...dateRange,
        },
      });

      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.isIssueFormComplete).toBe(true);
    });

    it('should mark form as incomplete when user_id is missing', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          user_id: null,
          ...dateRange,
        },
      });

      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.isIssueFormComplete).toBe(false);
    });

    it('should mark form as incomplete when reason_ids is empty', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          reason_ids: [],
          ...dateRange,
        },
      });

      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.isIssueFormComplete).toBe(false);
    });

    it('should mark form as incomplete when dates are invalid', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          start_date: 'invalid_date',
          end_date: 'invalid_date',
          ...dateRange,
        },
      });

      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.isIssueFormComplete).toBe(false);
    });
  });

  describe('modal text', () => {
    it('should generate correct modal text for multi-day suspension', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          ...dateRange,
        },
      });

      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      const modalText = result.current.getModalText();
      expect(modalText).toEqual(
        'John Smith will be suspended for 6 days from March 20, 2024 to March 25, 2024 and unable to play in games. The suspension is inclusive of the start and end dates.'
      );
    });

    it('should generate correct modal text for single-day suspension', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...dateRange,
          ...defaultSetupMocks,
          start_date: '2024-03-20',
          end_date: '2024-03-20',
        },
      });

      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      const modalText = result.current.getModalText();
      expect(modalText).toEqual(
        'John Smith will be suspended for 1 day from March 20, 2024 to March 20, 2024 and unable to play in games. The suspension is inclusive of the start and end dates.'
      );
    });

    it('should return empty string when form is incomplete', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          user_id: null,
          reason_ids: [],
          ...dateRange,
        },
      });

      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.getModalText()).toBe('');
    });
  });

  describe('useBaseDisciplinaryIssue update', () => {
    it('should return modalContent when issue.kind is "date"', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          competition_ids: [789],
          ...dateRange,
        },
      });
      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.modalContent).toBeDefined();
      expect(result.current.modalContent()).toBe(
        'John Smith will be suspended for 6 days from March 20, 2024 to March 25, 2024 and unable to play in games. The suspension is inclusive of the start and end dates.'
      );
      expect(result.current.formValidation).toBe(true);
    });

    it('should return modalContent when issue.kind is "number_of_games"', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          start_date: '2025-07-16T04:00:00.000Z',
          end_date: null,
          squad_id: 456,
          number_of_games: 3,
          competition_ids: [789],
          ...numberOfGames,
        },
      });
      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.modalContent).toBeDefined();
      expect(result.current.modalContent()).toEqual(
        <SuspensionNotice
          profile={{
            id: 123,
            name: 'John Smith',
          }}
          numberOfGames={3}
          startDateFormatted="July 16, 2025"
        />
      );
      expect(result.current.formValidation).toBe(true);
    });

    it('will set the form validation to false, when issue.kind is "date" and form is not complete', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          start_date: '2024-03-20',
          end_date: null,
          ...dateRange,
        },
      });
      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.formValidation).toBe(false);
      expect(result.current.getModalText()).toBe('');
    });

    it('will set the form validation to false, when issue.kind is "number_of_games" and form is not complete', () => {
      setupMocks({
        mode: 'UPDATE_DISCIPLINARY_ISSUE',
        issue: {
          ...defaultSetupMocks,
          start_date: '2025-07-16T04:00:00.000Z',
          end_date: null,
          squad_id: 456,
          number_of_games: null,
          ...numberOfGames,
        },
      });
      const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.formValidation).toBe(false);
      expect(result.current.getModalText()).toBe('');
    });
  });

  it('should return validation as false if "number_of_games", and isNextGameValid is false', () => {
    useNextGameDisciplineIssue.mockReturnValue({
      isNextGameValid: true,
    });
    setupMocks({
      mode: 'UPDATE_DISCIPLINARY_ISSUE',
      issue: {
        ...defaultSetupMocks,
        start_date: '2025-07-16T04:00:00.000Z',
        end_date: null,
        squad_id: 456,
        number_of_games: 3,
        ...numberOfGames,
      },
    });
    const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.modalContent).toBeDefined();
    expect(result.current.modalContent()).toBe('');
    expect(result.current.formValidation).toBe(false);
  });

  it('should return issue competition_ids if some of the competitions are selected', () => {
    useNextGameDisciplineIssue.mockReturnValue({
      isNextGameValid: true,
    });
    useFetchDisciplineCompetitionsQuery.mockReturnValue({
      data: [
        {
          id: 789,
          name: 'Competition 1',
        },
        {
          id: 790,
          name: 'Competition 2',
        },
      ],
      isLoading: false,
      isError: false,
    });
    setupMocks({
      mode: 'UPDATE_DISCIPLINARY_ISSUE',
      issue: {
        ...defaultSetupMocks,
        start_date: '2025-07-16T04:00:00.000Z',
        end_date: null,
        squad_id: 456,
        number_of_games: 3,
        competition_ids: [789],
        ...numberOfGames,
      },
    });
    const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.issue).toEqual(
      expect.objectContaining({
        competition_ids: [789],
      })
    );
  });
  it('should return issue competition_ids as empty array if all competitions are selected', () => {
    useNextGameDisciplineIssue.mockReturnValue({
      isNextGameValid: true,
    });
    useFetchDisciplineCompetitionsQuery.mockReturnValue({
      data: [
        {
          id: 789,
          name: 'Competition 1',
        },
        {
          id: 790,
          name: 'Competition 2',
        },
      ],
      isLoading: false,
      isError: false,
    });
    setupMocks({
      mode: 'UPDATE_DISCIPLINARY_ISSUE',
      issue: {
        ...defaultSetupMocks,
        start_date: '2025-07-16T04:00:00.000Z',
        end_date: null,
        squad_id: 456,
        number_of_games: 3,
        competition_ids: [789, 790],
        ...numberOfGames,
      },
    });
    const { result } = renderHook(() => useBaseDisciplinaryIssue(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.issue).toEqual(
      expect.objectContaining({
        competition_ids: [],
      })
    );
  });
});
