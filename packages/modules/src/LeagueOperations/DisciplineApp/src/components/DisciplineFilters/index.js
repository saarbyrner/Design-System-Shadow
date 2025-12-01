// @flow
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import type { DisciplineSearchParams } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import ClubSelect from './ClubSelect/ClubSelect';
import TeamSelect from './TeamSelect/TeamSelect';
import StatusSelect from './StatusSelect/StatusSelect';
import CompetitionSelect from './CompetitionSelect/CompetitionSelect';
import YellowsCards from './YellowCards/YellowsCards';
import RedCards from './RedCards/RedCards';
import DateRangeSelect from './DateRangeSelect/DateRangeSelect';

export const FilterSelector = ({
  type,
  onUpdate,
  requestStatus,
  initialFilters,
}: {
  type:
    | 'club'
    | 'team'
    | 'status'
    | 'competition'
    | 'yellow_cards'
    | 'red_cards'
    | 'date_range',
  onUpdate: Function,
  requestStatus: RequestStatus,
  initialFilters: DisciplineSearchParams,
}) => {
  switch (type) {
    case 'club':
      return (
        <ClubSelect searchQuery={onUpdate} requestStatus={requestStatus} />
      );
    case 'team':
      return (
        <TeamSelect searchQuery={onUpdate} requestStatus={requestStatus} />
      );
    case 'status':
      return (
        <StatusSelect searchQuery={onUpdate} requestStatus={requestStatus} />
      );
    case 'competition':
      return (
        <CompetitionSelect
          searchQuery={onUpdate}
          requestStatus={requestStatus}
        />
      );
    case 'yellow_cards':
      return (
        <YellowsCards searchQuery={onUpdate} requestStatus={requestStatus} />
      );
    case 'red_cards':
      return <RedCards searchQuery={onUpdate} requestStatus={requestStatus} />;
    case 'date_range':
      return (
        <DateRangeSelect
          searchQuery={onUpdate}
          requestStatus={requestStatus}
          initialValue={initialFilters.date_range}
        />
      );
    default:
      return null;
  }
};
