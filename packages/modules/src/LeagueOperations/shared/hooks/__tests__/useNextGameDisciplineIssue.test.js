import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import * as disciplineApi from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import * as selectors from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import useNextGameDisciplineIssue from '../useNextGameDisciplineIssue';

describe('useNextGameDisciplineIssue', () => {
  const mockUseSelector = jest.spyOn(reactRedux, 'useSelector');
  const mockUseFetchNextGameDisciplineIssueQuery = jest.spyOn(
    disciplineApi,
    'useFetchNextGameDisciplineIssueQuery'
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns isNextGameValid as false if form is incomplete', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector === selectors.getCurrentDisciplinaryIssue
        ? {
            number_of_games: 0,
            start_date: null,
            squad_id: null,
            kind: 'number_of_games',
            competition_ids: [1],
          }
        : undefined
    );
    mockUseFetchNextGameDisciplineIssueQuery.mockReturnValue({});

    const { result } = renderHook(() => useNextGameDisciplineIssue());
    expect(result.current.isNextGameValid).toBe(false);
  });

  it('returns isNextGameValid as false if fetching', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector === selectors.getCurrentDisciplinaryIssue
        ? {
            number_of_games: 2,
            start_date: '2024-06-01',
            squad_id: 1,
            kind: 'number_of_games',
            competition_ids: [1],
          }
        : undefined
    );
    mockUseFetchNextGameDisciplineIssueQuery.mockReturnValue({
      data: [],
      isSuccess: true,
      isFetching: true,
      isError: null,
    });

    const { result } = renderHook(() => useNextGameDisciplineIssue());
    expect(result.current.isNextGameValid).toBe(false);
  });

  it('returns isNextGameValid as false if nextGameData length equals number_of_games', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector === selectors.getCurrentDisciplinaryIssue
        ? {
            number_of_games: 2,
            start_date: '2024-06-01',
            squad_id: 1,
            kind: 'number_of_games',
            competition_ids: [1],
          }
        : undefined
    );
    mockUseFetchNextGameDisciplineIssueQuery.mockReturnValue({
      data: [{}, {}],
      isSuccess: true,
      isFetching: false,
      isError: null,
    });

    const { result } = renderHook(() => useNextGameDisciplineIssue());
    expect(result.current.isNextGameValid).toBe(false);
  });

  it('returns isNextGameValid as true if form is complete, isSuccess, not fetching, and nextGameData length does not equal number_of_games', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector === selectors.getCurrentDisciplinaryIssue
        ? {
            number_of_games: 2,
            start_date: '2024-06-01',
            squad_id: 1,
            kind: 'number_of_games',
            competition_ids: [1],
          }
        : undefined
    );
    mockUseFetchNextGameDisciplineIssueQuery.mockReturnValue({
      data: [{}],
      isSuccess: true,
      isFetching: false,
      error: null,
    });

    const { result } = renderHook(() => useNextGameDisciplineIssue());
    expect(result.current.isNextGameValid).toBe(true);
  });

  it('returns isNextGameValid as false if isSuccess is false', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector === selectors.getCurrentDisciplinaryIssue
        ? {
            number_of_games: 2,
            start_date: '2024-06-01',
            squad_id: 1,
            kind: 'number_of_games',
            competition_ids: [1],
          }
        : undefined
    );
    mockUseFetchNextGameDisciplineIssueQuery.mockReturnValue({
      data: [{}],
      isSuccess: false,
      isFetching: false,
      isError: null,
    });

    const { result } = renderHook(() => useNextGameDisciplineIssue());
    expect(result.current.isNextGameValid).toBe(false);
  });

  it('returns isNextGameValid as false if isError is true', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector === selectors.getCurrentDisciplinaryIssue
        ? {
            number_of_games: 2,
            start_date: '2024-06-01',
            squad_id: 1,
            kind: 'number_of_games',
            competition_ids: [1],
          }
        : undefined
    );
    mockUseFetchNextGameDisciplineIssueQuery.mockReturnValue({
      data: [{}],
      isSuccess: false,
      isFetching: false,
      isError: true,
    });

    const { result } = renderHook(() => useNextGameDisciplineIssue());
    expect(result.current.isNextGameValid).toBe(false);
  });
});
