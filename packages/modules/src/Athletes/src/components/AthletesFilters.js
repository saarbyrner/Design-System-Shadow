// @flow
import { withNamespaces } from 'react-i18next';
import { AthleteSelector, Dropdown, SearchBar } from '@kitman/components';
import type {
  AthleteSelectorPositionGroup,
  SquadAthletesSelection,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  areSideFiltersShowed?: boolean,
  positionGroups: Array<AthleteSelectorPositionGroup>,
  searchChars: string,
  onSearch: Function,
};

const emptySquadAthletes: SquadAthletesSelection = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
};

const AthletesFilters = (props: I18nProps<Props>) => {
  const squadAthletes = {
    position_groups: props.positionGroups.map((positionGroup) => ({
      ...positionGroup,
      positions: positionGroup.positions.map((position) => ({
        ...position,
        athletes: [],
      })),
    })),
  };

  const availabilityItems = [
    {
      id: 1,
      title: props.t('Unavailable'),
    },
    {
      id: 2,
      title: props.t('Available (Injured/III)'),
    },
    {
      id: 3,
      title: props.t('Available (Returning from injury/illness)'),
    },
    {
      id: 4,
      title: props.t('Available'),
    },
  ];

  return (
    <div className="athletesFilters">
      <div className="athletesFilters__search">
        <SearchBar
          icon="icon-search"
          onChange={(event) => props.onSearch(event.target.value)}
          value={props.searchChars}
          placeholder={props.t('Search athletes')}
        />
      </div>
      {props.areSideFiltersShowed && (
        <div className="athletesFilters__sideFilters">
          <label className="athletesFilters__label">
            {`${props.t('Position')}:`}
          </label>
          <div className="athletesFilters__position">
            <AthleteSelector
              squadAthletes={squadAthletes}
              selectedSquadAthletes={emptySquadAthletes}
              showDropdownButton
            />
          </div>
          <label className="athletesFilters__label">
            {`${props.t('Availability')}:`}
          </label>
          <div className="athletesFilters__availability">
            <Dropdown items={availabilityItems} onChange={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AthletesFilters;
export const AthletesFiltersTranslated = withNamespaces()(AthletesFilters);
