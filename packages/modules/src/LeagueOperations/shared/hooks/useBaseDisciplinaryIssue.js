// @flow
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import type { DisciplinaryIssueMode } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import {
  getDisciplinaryIssueMode,
  getCurrentDisciplinaryIssue,
  getDisciplineProfile,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { onReset } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { useFetchDisciplineCompetitionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import useNextGameDisciplineIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useNextGameDisciplineIssue';
import SuspensionNotice from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/SuspensionNotice';

type BaseReturnType = {
  dispatch: Function,
  mode: DisciplinaryIssueMode,
  issue: Object,
  profile: Object,
  isIssueFormComplete: boolean,
  getModalText: () => string,
  handleOnCancel: () => void,
  modalContent: () => string | React$Element<any>,
  formValidation: boolean,
};

const useBaseDisciplinaryIssue = (): BaseReturnType => {
  const dispatch = useDispatch();
  const mode = useSelector(getDisciplinaryIssueMode);
  const issue = useSelector(getCurrentDisciplinaryIssue);
  const profile = useSelector(getDisciplineProfile);
  const DATE_FORMAT = 'MMMM DD, YYYY';

  const isEndDateBeforeStartDate = moment(issue?.end_date).isBefore(
    moment(issue?.start_date)
  );

  const { data: disciplineCompetitions = [] } =
    useFetchDisciplineCompetitionsQuery();
  // This check is to determine if all competitions are selected, and so we need to reset the competition_ids
  // This is required for the backend, as it expects the competition_ids to be empty if all competitions are selected
  const disciplineIssue =
    (disciplineCompetitions.length === issue.competition_ids?.length && {
      ...issue,
      competition_ids: [],
    }) ||
    issue;

  // Use the custom hook to fetch next game discipline issue
  // This will return the validate of the number of games selected against the next game data
  const { isNextGameValid, nextGameData } = useNextGameDisciplineIssue();

  // Check if the issue is a number of games suspension
  const isNumberOfGamesSuspension =
    Boolean(issue?.kind === 'number_of_games') &&
    Boolean(issue?.user_id) &&
    issue?.reason_ids?.length > 0 &&
    issue?.competition_ids?.length > 0 &&
    issue?.number_of_games > 0 &&
    moment(issue?.start_date).isValid() &&
    Boolean(issue?.squad_id) &&
    !isNextGameValid;
  // check if the issue is a date suspension
  const isIssueFormComplete =
    Boolean(issue?.kind === 'date_range') &&
    Boolean(issue?.user_id) &&
    issue?.reason_ids?.length > 0 &&
    moment(issue?.start_date).isValid() &&
    moment(issue?.end_date).isValid() &&
    !isEndDateBeforeStartDate;

  const getModalText = (): string => {
    if (issue && profile && isIssueFormComplete) {
      const startDate = moment(issue.start_date);
      const endDate = moment(issue.end_date);
      const INCLUSIVE_ADJUSTMENT = 1;
      const differenceInDays =
        endDate.diff(startDate, 'days') + INCLUSIVE_ADJUSTMENT;
      const startDateFormatted = startDate.format(DATE_FORMAT);
      const endDateFormatted = endDate.format(DATE_FORMAT);
      return i18n.t(
        '{{name}} will be suspended for {{differenceInDays}} {{dayText}} from {{startDateFormatted}} to {{endDateFormatted}} and unable to play in games. The suspension is inclusive of the start and end dates.',
        {
          name: profile.name,
          differenceInDays,
          startDateFormatted,
          endDateFormatted,
          dayText: differenceInDays === 1 ? 'day' : 'days',
        }
      );
    }
    return '';
  };

  const getNumberOfGamesSuspensionModalText = ():
    | React$Element<any>
    | string => {
    if (!(issue && profile && isNumberOfGamesSuspension)) return '';
    const startDate = moment(issue.start_date);
    const startDateFormatted = startDate.format(DATE_FORMAT);
    return (
      <SuspensionNotice
        profile={profile}
        games={nextGameData}
        numberOfGames={issue.number_of_games}
        startDateFormatted={startDateFormatted}
      />
    );
  };

  const handleOnCancel = () => {
    dispatch(onReset());
  };

  // to determine the type of suspension
  const getFormValidation = (): ({
    isDisabled: boolean,
    modalText: () => React$Element<any> | string,
  }) => {
    switch (issue.kind) {
      case 'date_range':
        return {
          // doing this check here to preserve previous behavior
          isDisabled: isIssueFormComplete && issue?.competition_ids?.length > 0,
          modalText: getModalText,
        };
      case 'number_of_games':
        return {
          isDisabled: isNumberOfGamesSuspension,
          modalText: getNumberOfGamesSuspensionModalText,
        };
      default:
        return {
          isDisabled: true,
          modalText: () => '',
        };
    }
  };

  return {
    dispatch,
    mode,
    issue: disciplineIssue,
    profile,
    isIssueFormComplete, // TODO: remove this when V2 is fully implemented
    getModalText, // TODO: remove this when V2 is fully implemented
    handleOnCancel,
    modalContent: getFormValidation().modalText,
    formValidation: getFormValidation().isDisabled,
  };
};

export default useBaseDisciplinaryIssue;
