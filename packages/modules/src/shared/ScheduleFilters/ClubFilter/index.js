// @flow
import { withNamespaces } from 'react-i18next';
import { Select } from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import styles from '../MatchdayManagementFilters/styles';

type Props = {
  filters: EventFilters,
  setFilters: (partialState: $Shape<EventFilters>) => void,
  currentClub: string | null,
};

const ClubFilter = (props: I18nProps<Props>) => {
  const { data: currentClubs } = useGetClubsQuery({
    divisionIds: props.currentClub,
  });

  const clubOptions = currentClubs ? defaultMapToOptions(currentClubs) : [];

  const customStyles = {
    menu: (base) => ({
      ...base,
      minWidth: '100%',
    }),
  };

  return (
    <div data-testid="club-filter" css={styles.filter}>
      <Select
        options={clubOptions}
        onChange={(selectedClubs) => {
          props.setFilters({ organisations: selectedClubs });
        }}
        value={props.filters?.organisations}
        placeholder={props.t('Clubs')}
        isMulti
        customSelectStyles={customStyles}
      />
    </div>
  );
};

export const ClubFilterTranslated = withNamespaces()(ClubFilter);
export default ClubFilter;
