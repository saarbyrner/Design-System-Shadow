// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AthleteSelect } from '@kitman/components';
import { useGetSquadAthletesQuery } from '@kitman/common/src/redux/global/services/globalApi';

type Props = {
  value: Array<number | string>,
  label: ?string,
  onUpdate: Function,
};

const SquadSelect = ({
  t,
  value: squad,
  label,
  onUpdate,
}: I18nProps<Props>) => {
  const {
    data: squadAthletes = { squads: [] },
    isFetching: areSquadAthletesFetching,
  } = useGetSquadAthletesQuery();

  const getAthletesValue = (athleteIds) => {
    return [
      {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: athleteIds,
        squads: [],
        context_squads: [],
        users: [],
      },
    ];
  };

  const handleSelectAllClick = (allAthletesFromSquad) => {
    const newIds = allAthletesFromSquad.map(({ id }) => id);
    const previousIds = new Set(squad);
    const mergedAthleteIds = [...new Set([...newIds, ...previousIds])];

    onUpdate({
      ids: mergedAthleteIds,
    });
  };

  const handleClearAllClick = (options) => {
    if (!squad) {
      onUpdate({ ids: [] });
      return;
    }

    const clearedIds = new Set(options.map(({ id }) => id));
    const remainingAthleteIds = squad.filter((id) => !clearedIds.has(id));

    onUpdate({ ids: [remainingAthleteIds] });
  };

  return (
    <AthleteSelect
      isMulti
      label={label || t('Squad/Roster')}
      squadAthletes={squadAthletes.squads || []}
      value={getAthletesValue(squad || [])}
      onChange={(newValue) => {
        const athleteIds = newValue[0]?.athletes;

        onUpdate({ ids: athleteIds });
      }}
      isLoading={areSquadAthletesFetching}
      onClearAllClick={handleClearAllClick}
      onSelectAllClick={handleSelectAllClick}
      hiddenTypes={['position_groups', 'positions', 'squads']}
    />
  );
};

export const SquadSelectTranslated = withNamespaces()(SquadSelect);
export default SquadSelect;
