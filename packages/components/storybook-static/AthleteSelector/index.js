// @flow
import { useState } from 'react';
import _flattenDeep from 'lodash/flattenDeep';
import _flatten from 'lodash/flatten';
import _union from 'lodash/union';
import { withNamespaces, setI18n } from 'react-i18next';
import classNames from 'classnames';

import { DropdownWrapper, Checkbox } from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { SquadAthletes, SquadAthletesSelection } from './types';
import { getSelectedItems, isSelectionEmpty } from './utils';

// set the i18n instance
setI18n(i18n);

type Props = {
  label?: string,
  isFetchingSquadAthletes?: boolean,
  squadAthletes: SquadAthletes,
  isFetchingSquads?: boolean,
  squads: Array<Squad>,
  disabledSquadAthletes: SquadAthletesSelection,
  selectedSquadAthletes: SquadAthletesSelection,
  onSelectSquadAthletes: Function,
  showDropdownButton: boolean,
  singleSelection?: boolean,
  onlyAthletes?: boolean,
};

function AthleteSelector(props: I18nProps<Props>) {
  const [searchTerm, setSearchTerm] = useState('');

  const emptySquadAthletes = {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
    all_squads: false,
    squads: [],
    labels: [],
    segments: [],
  };

  const onClickSelectAllInEntireSquad = () => {
    const allAthletes = _flattenDeep(
      props.squadAthletes.position_groups.map((positionGroup) =>
        positionGroup.positions.map((position) =>
          position.athletes
            .filter(
              (athlete) =>
                props.disabledSquadAthletes.athletes.indexOf(athlete.id) === -1
            )
            .map((athlete) => athlete.id)
        )
      )
    );

    props.onSelectSquadAthletes({
      ...props.selectedSquadAthletes,
      athletes: allAthletes,
    });
  };

  const onClickClearAllInEntireSquad = () => {
    props.onSelectSquadAthletes({
      ...props.selectedSquadAthletes,
      athletes: [],
    });
  };

  const onClickSelectAllSquads = () => {
    const allSquads = props.squads
      .filter(
        (squad) => props.disabledSquadAthletes.squads.indexOf(squad.id) === -1
      )
      .map((squad) => squad.id);

    props.onSelectSquadAthletes({
      ...props.selectedSquadAthletes,
      squads: allSquads,
    });
  };

  const onClickClearAllSquads = () => {
    props.onSelectSquadAthletes({
      ...props.selectedSquadAthletes,
      squads: [],
    });
  };

  const onClickAllSquadsCheckbox = (allSquads) => {
    const selectedSquadAthletes = props.singleSelection
      ? {
          ...emptySquadAthletes,
          all_squads: true,
        }
      : {
          ...props.selectedSquadAthletes,
          all_squads: allSquads.checked,
        };

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const onClickSquadCheckbox = (squad) => {
    let selectedSquadAthletes;

    if (props.singleSelection) {
      selectedSquadAthletes = {
        ...emptySquadAthletes,
        squads: [squad.id],
      };
    } else {
      selectedSquadAthletes = {
        ...props.selectedSquadAthletes,
        squads: [...props.selectedSquadAthletes.squads, squad.id],
      };

      if (!squad.checked) {
        selectedSquadAthletes.squads = selectedSquadAthletes.athletes.filter(
          (athleteID) => athleteID !== squad.id
        );
      }
    }

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const onClickSelectAllInPositionGroup = (positionGroup) => {
    const selectedSquadAthletes = {
      ...props.selectedSquadAthletes,
    };

    const athletesInGroup = _flatten(
      positionGroup.positions.map((position) =>
        position.athletes
          .filter(
            (athlete) =>
              props.disabledSquadAthletes.athletes.indexOf(athlete.id) === -1
          )
          .map((athlete) => athlete.id)
      )
    );

    selectedSquadAthletes.athletes = _union(
      selectedSquadAthletes.athletes,
      athletesInGroup
    );

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const onClickClearAllInPositionGroup = (positionGroup) => {
    const selectedSquadAthletes = {
      ...props.selectedSquadAthletes,
    };

    const athletesInGroup = _flatten(
      positionGroup.positions.map((position) =>
        position.athletes.map((athlete) => athlete.id)
      )
    );

    selectedSquadAthletes.athletes = selectedSquadAthletes.athletes.filter(
      (athleteId) => athletesInGroup.indexOf(athleteId) === -1
    );

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const onClickEntireSquadCheckbox = (entireSquad) => {
    const selectedSquadAthletes = props.singleSelection
      ? {
          ...emptySquadAthletes,
          applies_to_squad: true,
        }
      : {
          ...props.selectedSquadAthletes,
          applies_to_squad: entireSquad.checked,
        };

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const onClickPositionGroupCheckbox = (positionGroup) => {
    let selectedSquadAthletes;
    const positionGroupId = parseInt(positionGroup.id, 10);

    if (props.singleSelection) {
      selectedSquadAthletes = {
        ...emptySquadAthletes,
        position_groups: [positionGroupId],
      };
    } else {
      selectedSquadAthletes = {
        ...props.selectedSquadAthletes,
        position_groups: [
          ...props.selectedSquadAthletes.position_groups,
          positionGroupId,
        ],
      };

      if (!positionGroup.checked) {
        selectedSquadAthletes.position_groups =
          selectedSquadAthletes.position_groups.filter(
            (positionGroupID) => positionGroupID !== positionGroupId
          );
      }
    }

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const onClickPositionCheckbox = (position) => {
    let selectedSquadAthletes;
    const positionId = parseInt(position.id, 10);

    if (props.singleSelection) {
      selectedSquadAthletes = {
        ...emptySquadAthletes,
        positions: [positionId],
      };
    } else {
      selectedSquadAthletes = {
        ...props.selectedSquadAthletes,
        positions: [...props.selectedSquadAthletes.positions, positionId],
      };

      if (!position.checked) {
        selectedSquadAthletes.positions =
          selectedSquadAthletes.positions.filter(
            (positionID) => positionID !== positionId
          );
      }
    }

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const onClickAthleteCheckbox = (athlete) => {
    let selectedSquadAthletes;
    const athleteId = parseInt(athlete.id, 10);

    if (props.singleSelection) {
      selectedSquadAthletes = { ...emptySquadAthletes, athletes: [athleteId] };
    } else {
      selectedSquadAthletes = {
        ...props.selectedSquadAthletes,
        athletes: [...props.selectedSquadAthletes.athletes, athleteId],
      };

      if (!athlete.checked) {
        selectedSquadAthletes.athletes = selectedSquadAthletes.athletes.filter(
          (athleteID) => athleteID !== athleteId
        );
      }
    }

    props.onSelectSquadAthletes(selectedSquadAthletes);
  };

  const getAthleteList = (athleteList) => (
    <ul className="athleteSelector__athleteList">
      {athleteList.map(
        (athlete) =>
          athlete.fullname.toLowerCase().indexOf(searchTerm) !== -1 && (
            <li
              key={`athlete_${athlete.id}`}
              className="athleteSelector__athleteItem"
            >
              <Checkbox
                id={athlete.id.toString()}
                label={athlete.fullname}
                toggle={onClickAthleteCheckbox}
                isChecked={
                  props.selectedSquadAthletes.athletes.indexOf(athlete.id) !==
                  -1
                }
                radioStyle={props.singleSelection}
                isDisabled={
                  props.disabledSquadAthletes.athletes.indexOf(athlete.id) !==
                  -1
                }
              />
            </li>
          )
      )}
    </ul>
  );

  const getPositionList = (positions) => (
    <ul className="athleteSelector__positionList">
      {positions.map((position) => (
        <li key={`position_${position.id}`}>
          {position.name.toLowerCase().indexOf(searchTerm) !== -1 && (
            <div className="athleteSelector__positionItem">
              <Checkbox
                id={position.id.toString()}
                label={position.name}
                secondaryLabel={`(${props.t('group')})`}
                toggle={onClickPositionCheckbox}
                isChecked={
                  props.selectedSquadAthletes.positions.indexOf(position.id) !==
                  -1
                }
                isDisabled={
                  props.disabledSquadAthletes.positions.indexOf(position.id) !==
                  -1
                }
                radioStyle={props.singleSelection}
              />
            </div>
          )}
          {getAthleteList(position.athletes)}
        </li>
      ))}
    </ul>
  );

  const getPositionGroupList = () => (
    <ul className="athleteSelector__positionGroupList">
      {props.isFetchingSquadAthletes && (
        <li className="athleteSelector__section">
          {props.t('Loading positions')}...
        </li>
      )}
      {!props.isFetchingSquadAthletes &&
        props.squadAthletes.position_groups.map((positionGroup) => (
          <li className="athleteSelector__section" key={positionGroup.id}>
            <header>
              <span className="athleteSelector__positionGroupName">
                {positionGroup.name}
              </span>
              <span>
                <span
                  className="athleteSelector__selectAll"
                  onClick={() => onClickSelectAllInPositionGroup(positionGroup)}
                >
                  {props.t('Select All')}
                </span>
                <span
                  className="athleteSelector__clearAll"
                  onClick={() => onClickClearAllInPositionGroup(positionGroup)}
                >
                  {props.t('Clear')}
                </span>
              </span>
            </header>
            {positionGroup.name.toLowerCase().indexOf(searchTerm) !== -1 && (
              <div className="athleteSelector__positionGroupItem">
                <Checkbox
                  id={positionGroup.id.toString()}
                  label={positionGroup.name}
                  secondaryLabel={`(${props.t('group')})`}
                  toggle={onClickPositionGroupCheckbox}
                  isChecked={
                    props.selectedSquadAthletes.position_groups.indexOf(
                      positionGroup.id
                    ) !== -1
                  }
                  isDisabled={
                    props.disabledSquadAthletes.position_groups.indexOf(
                      positionGroup.id
                    ) !== -1
                  }
                  radioStyle={props.singleSelection}
                />
              </div>
            )}
            {getPositionList(positionGroup.positions)}
          </li>
        ))}
    </ul>
  );

  const getEntireSquadSelector = () => {
    const entireSquadText = props.t('#sport_specific__Entire_Squad');
    return (
      <div className="athleteSelector__section athleteSelector__entireSquadSelector">
        <header>
          <span className="athleteSelector__entireSquadGroupName">
            {entireSquadText}
          </span>
          <span>
            <span
              className="athleteSelector__selectAll"
              onClick={() => onClickSelectAllInEntireSquad()}
            >
              {props.t('Select All')}
            </span>
            <span
              className="athleteSelector__clearAll"
              onClick={() => onClickClearAllInEntireSquad()}
            >
              {props.t('Clear')}
            </span>
          </span>
        </header>
        {entireSquadText.toLowerCase().indexOf(searchTerm) !== -1 && (
          <div className="athleteSelector__entireSquadItem">
            <Checkbox
              id="entire_squad"
              label={entireSquadText}
              secondaryLabel={`(${props.t('group')})`}
              toggle={onClickEntireSquadCheckbox}
              isChecked={props.selectedSquadAthletes.applies_to_squad}
              isDisabled={props.disabledSquadAthletes.applies_to_squad}
              radioStyle={props.singleSelection}
            />
          </div>
        )}
      </div>
    );
  };

  const getSquadList = () => (
    <ul className="athleteSelector__squadList">
      {props.isFetchingSquads && <li>{props.t('Loading squads')}...</li>}
      {!props.isFetchingSquads &&
        props.squads.map((squad) => (
          <li key={squad.id}>
            {squad.name.toLowerCase().indexOf(searchTerm) !== -1 && (
              <div className="athleteSelector__squadItem">
                <Checkbox
                  id={squad.id}
                  label={squad.name}
                  toggle={onClickSquadCheckbox}
                  isChecked={
                    props.selectedSquadAthletes.squads.indexOf(squad.id) !== -1
                  }
                  isDisabled={
                    props.disabledSquadAthletes.squads.indexOf(squad.id) !== -1
                  }
                  radioStyle={props.singleSelection}
                />
              </div>
            )}
          </li>
        ))}
    </ul>
  );

  const getSquadSection = () => {
    const allSquadsText = props.t('#sport_specific__All_Squads');
    return (
      <div className="athleteSelector__section athleteSelector__SquadSelector">
        <header>
          <span className="athleteSelector__SquadGroupName">
            {props.t('#sport_specific__Squads')}
          </span>
          <span>
            <span
              className="athleteSelector__selectAll"
              onClick={() => onClickSelectAllSquads()}
            >
              {props.t('Select All')}
            </span>
            <span
              className="athleteSelector__clearAll"
              onClick={() => onClickClearAllSquads()}
            >
              {props.t('Clear')}
            </span>
          </span>
        </header>
        {allSquadsText.toLowerCase().indexOf(searchTerm) !== -1 && (
          <div className="athleteSelector__allSquadsItem">
            <Checkbox
              id="all_squads"
              label={props.t('#sport_specific__All_Squads')}
              secondaryLabel={`(${props.t('group')})`}
              toggle={onClickAllSquadsCheckbox}
              isChecked={props.selectedSquadAthletes.all_squads}
              isDisabled={props.disabledSquadAthletes.all_squads}
              radioStyle={props.singleSelection}
            />
          </div>
        )}
        {getSquadList()}
      </div>
    );
  };

  return (
    <DropdownWrapper
      label={props.label}
      hasSearch
      showDropdownButton={props.showDropdownButton}
      searchTerm={searchTerm}
      dropdownTitle={getSelectedItems(
        props.selectedSquadAthletes,
        props.squadAthletes,
        props.squads
      )}
      onTypeSearchTerm={(typpedSearchTerm) => {
        setSearchTerm(typpedSearchTerm.toLowerCase());
      }}
      customClass={
        isSelectionEmpty(props.selectedSquadAthletes)
          ? 'dropdownWrapper--validationFailure'
          : ''
      }
      maxHeight="390"
    >
      <div
        className={classNames('athleteSelector', {
          'athleteSelector--singleSelection': props.singleSelection,
          'athleteSelector--onlyAthletes': props.onlyAthletes,
        })}
      >
        {getEntireSquadSelector()}
        {getPositionGroupList()}
        {props.squads && getSquadSection()}
      </div>
    </DropdownWrapper>
  );
}

AthleteSelector.defaultProps = {
  label: '',
  showDropdownButton: true,
  disabledSquadAthletes: {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
    all_squads: false,
    squads: [],
    label: [],
    segments: [],
  },
};

export default AthleteSelector;
export const AthleteSelectorTranslated = withNamespaces()(AthleteSelector);
