// @flow
import { useSelector } from 'react-redux';
import { getCurrentDisciplinaryIssue } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { useFetchNextGameDisciplineIssueQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import type { NextGameDisciplineIssueResponse } from '@kitman/modules/src/LeagueOperations/shared/services/fetchNextGameDisciplineIssue';

type BaseReturnType = {
  isNextGameValid: boolean,
  nextGameData: NextGameDisciplineIssueResponse,
};

const useNextGameDisciplineIssue = (): BaseReturnType => {
  const issue = useSelector(getCurrentDisciplinaryIssue);
  const isFormComplete =
    issue.competition_ids.length > 0 &&
    issue.number_of_games > 0 &&
    issue.start_date &&
    issue.squad_id &&
    issue?.kind === 'number_of_games';

  // Fetch next game discipline issue if any of the following issue fields are updated, and update for validation
  const {
    data: nextGameData = [],
    isSuccess,
    isFetching,
    isError,
  } = useFetchNextGameDisciplineIssueQuery(
    {
      number_of_games: issue.number_of_games,
      squad_id: issue.squad_id,
      start_date: issue.start_date,
      competition_ids: issue.competition_ids,
    },
    {
      skip: !isFormComplete,
    }
  );

  const isNextGameEqualToNumberOfGames =
    isSuccess && nextGameData.length === issue.number_of_games;
  // Check if the next game data is valid based on the number of games.
  // For example, if the number of games is 3, we expect 3 entries in nextGameData.
  const isNextGameValid =
    isFormComplete &&
    isSuccess &&
    !isFetching &&
    !isError &&
    !isNextGameEqualToNumberOfGames;

  return {
    isNextGameValid,
    nextGameData,
  };
};

export default useNextGameDisciplineIssue;
