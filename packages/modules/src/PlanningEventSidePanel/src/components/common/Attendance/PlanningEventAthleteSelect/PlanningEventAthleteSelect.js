// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useEffect, useState } from 'react';

import { AthleteSelect } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  ID,
  SquadAthletes,
  SquadAthletesSelection,
  SelectorOption,
} from '@kitman/components/src/Athletes/types';
import type { OnUpdateEventDetails } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import getSquadAthletes from '@kitman/services/src/services/getSquadAthletes';
import style from '@kitman/modules/src/PlanningEventSidePanel/src/style';

const hiddenTypes = ['position_groups', 'positions', 'squads'];

const valueConsts = {
  applies_to_squad: false,
  all_squads: false,
  position_groups: [],
  positions: [],
  squads: [],
  context_squads: [],
};

type Props = {
  onUpdateEventDetails: OnUpdateEventDetails,
  athleteIds: Array<ID>,
  filteredAthletes?: SquadAthletes,
};

export type TranslatedProps = I18nProps<Props>;
const PlanningEventAthleteSelect = ({
  t,
  onUpdateEventDetails,
  athleteIds,
  filteredAthletes,
}: TranslatedProps) => {
  const [allAthletes, setAllAthletes] = useState<SquadAthletes>([]);

  const value = [
    {
      ...valueConsts,
      athletes: athleteIds,
    },
  ];

  const onChange = (selectedAthletes: SquadAthletesSelection[]) => {
    const athleteIdsToSet =
      selectedAthletes.length === 0 ? [] : selectedAthletes[0].athletes;
    onUpdateEventDetails({
      athlete_ids: athleteIdsToSet,
    });
  };

  const onClearAllClick = (options: Array<SelectorOption>) => {
    const receivedIds = new Set(options.map(({ id }) => id));
    const remainingAthleteIds =
      athleteIds?.filter((id) => !receivedIds.has(id)) ?? [];
    onUpdateEventDetails({
      athlete_ids: remainingAthleteIds,
    });
  };

  const onSelectAllClick = (allAthletesFromSquad: Array<SelectorOption>) => {
    const newlyChosenIds = allAthletesFromSquad.map(({ id }) => id);
    const previouslyChosenIds = new Set(athleteIds);
    const mergedAthleteIds = [
      ...new Set([...newlyChosenIds, ...previouslyChosenIds]),
    ];
    onUpdateEventDetails({
      athlete_ids: mergedAthleteIds,
    });
  };

  useEffect(() => {
    getSquadAthletes().then((squadAthletes: { squads: SquadAthletes }) => {
      if (squadAthletes?.squads) {
        setAllAthletes(squadAthletes.squads);
      }
    });
  }, []);

  return (
    <div css={style.staffRow}>
      <AthleteSelect
        label={t('Athletes')}
        onChange={onChange}
        hiddenTypes={hiddenTypes}
        // Supporting filteredAthletes by custom_event_type squads
        squadAthletes={filteredAthletes ?? allAthletes}
        includeContextSquad={false}
        value={value}
        isMulti
        isClearable
        menuPosition="absolute"
        onClearAllClick={onClearAllClick}
        onSelectAllClick={onSelectAllClick}
        placeholder={t('No athletes selected')}
        customPlaceholderRenderer={() => athleteIds?.length === 0}
      />
    </div>
  );
};

export const PlanningEventAthleteSelectTranslated: ComponentType<Props> =
  withNamespaces()(PlanningEventAthleteSelect);
export default PlanningEventAthleteSelect;
