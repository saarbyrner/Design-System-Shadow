// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { AthleteSelect } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetAllSquadAthletesQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';

type Props = {
  widthCalc: number,
};

export const COMPARE_TO = 'compare_to';
export const ATHLETE_IDS = 'athlete_ids';

const Athletes = (props: I18nProps<Props>) => {
  const { filter, setFilter } = useFilter(COMPARE_TO);
  const { data: athleteOptions, isFetching } = useGetAllSquadAthletesQuery();

  const onSetFilter = (value) => {
    const athleteIds = value[0]?.athletes;

    const updatedFilters = {
      ...filter,
      athlete_ids: athleteIds || [],
    };

    setFilter(updatedFilters);
  };

  const getPopulationValue = (athleteIds) => {
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

  return (
    <span css={getFilterStyles(props.widthCalc)}>
      <AthleteSelect
        data-testid="BenchmarkFilters|Athletes"
        label={props.t('Athlete(s)')}
        squadAthletes={athleteOptions?.squads || []}
        onChange={(value) => onSetFilter(value)}
        isLoading={isFetching}
        value={getPopulationValue(filter[ATHLETE_IDS])}
        hiddenTypes={['position_groups', 'positions', 'squads']}
        inlineShownSelectionMaxWidth={380}
        isMulti
      />
    </span>
  );
};

export const AthletesTranslated: ComponentType<Props> =
  withNamespaces()(Athletes);
export default Athletes;
