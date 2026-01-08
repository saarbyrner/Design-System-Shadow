// @flow
import { useState } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _flattenDeep from 'lodash/flattenDeep';
import _flatten from 'lodash/flatten';
import _union from 'lodash/union';
import _uniqBy from 'lodash/uniqBy';
import _uniq from 'lodash/uniq';
import { withNamespaces, setI18n } from 'react-i18next';
import classNames from 'classnames';
import i18n from '@kitman/common/src/utils/i18n';
import {
  Accordion,
  Checkbox,
  DropdownWrapper,
  IconButton,
} from '@kitman/components';
import type { CheckboxItem } from '@kitman/components/src/types';
import type { Athlete } from '@kitman/components/src/Athletes/types';
import type { MovedAthlete } from '@kitman/common/src/types/Athlete';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import type { PositionGroup, Position } from '../AthleteSelector/types';
import type {
  SquadData,
  StaffMemberData,
  AthletesAndStaffSelection,
  AthleteSelectionWithOptionalAdditionalData,
} from './types';
// set the i18n instance
setI18n(i18n);

type AthletesAndStaffSelectionWithName = {
  athletes: Array<AthleteSelectionWithOptionalAdditionalData>,
  staff: Array<string>,
};

type Props = {
  label?: string,
  squads?: Array<SquadData>,
  staff?: Array<StaffMemberData>,
  excludeId?: string,
  movedAthletes?: Array<MovedAthlete>,
  useUserIdsForAthletes: boolean,
  selection: AthletesAndStaffSelection | AthletesAndStaffSelectionWithName,
  onSelectionChanged: Function,
  singleSelection?: boolean,
  actionElement?: 'CHECKBOX' | 'PLUS_BUTTON',
  addTransitionOnSelection?: boolean,
  addAthleteDetailsToSelection?: boolean,
};

function AthleteAndStaffSelector(props: I18nProps<Props>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffExpanded, setStaffExpanded] = useState(false);
  const [expandedSquads, setExpandedSquads] = useState([]);

  const getStaffFullName = (staffMember: StaffMemberData) => {
    return staffMember.firstname.concat(' ', staffMember.lastname);
  };

  const positionGroupHasSearchMatch = (
    positionGroup: PositionGroup,
    searchValue: string
  ) => {
    if (searchValue === '') {
      return true;
    }

    const athleteFullNamesInPositionGroup = _flattenDeep(
      positionGroup.positions.map((position) =>
        position.athletes.map((athlete) => athlete.fullname.toLowerCase())
      )
    );

    return (
      athleteFullNamesInPositionGroup.filter(
        (athleteName) => athleteName.indexOf(searchValue) !== -1
      ).length > 0
    );
  };

  const squadHasSearchMatches = (squad: SquadData, searchValue: string) => {
    if (searchValue === '') {
      return true;
    }

    if (squad) {
      for (let i = 0; i < squad.position_groups.length; i++) {
        if (
          positionGroupHasSearchMatch(squad.position_groups[i], searchValue)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const staffHasSearchMatch = (searchValue: string) => {
    if (searchValue === '') {
      return true;
    }

    return (
      props.staff?.find(
        (staffMember) =>
          getStaffFullName(staffMember).toLowerCase().indexOf(searchValue) !==
          -1
      ) !== undefined
    );
  };

  const shouldExpandSquad = (squad: SquadData, searchValue: string) => {
    if (searchValue === '') {
      return expandedSquads.includes(squad.id);
    }
    return squadHasSearchMatches(squad, searchValue);
  };

  const shouldExpandStaff = (searchValue: string) => {
    if (searchValue === '') {
      return staffExpanded;
    }
    return staffHasSearchMatch(searchValue);
  };

  const updateAthletesSelection = (
    selectedAthletes: Array<AthleteSelectionWithOptionalAdditionalData>
  ) => {
    const updatedSelection = _cloneDeep(props.selection);
    if (props.singleSelection) {
      updatedSelection.staff = [];
    }

    const isArrayOfPrimitives = selectedAthletes.every(
      (athlete) => typeof athlete === 'number' || typeof athlete === 'string'
    );
    const isArrayOfObjects = selectedAthletes.every(
      (athlete) => typeof athlete === 'object'
    );
    let uniqueSelectedAthletes;
    if (isArrayOfPrimitives) {
      uniqueSelectedAthletes = _uniq(selectedAthletes);
    } else if (isArrayOfObjects) {
      uniqueSelectedAthletes = _uniqBy(selectedAthletes, 'id');
    } else {
      uniqueSelectedAthletes = selectedAthletes;
    }

    updatedSelection.athletes = uniqueSelectedAthletes;
    props.onSelectionChanged(updatedSelection);
  };

  const onSelectAllMovedAthletes = () => {
    const movedAthleteIds = props.movedAthletes?.map(({ id }) => `${id}`) ?? [];
    updateAthletesSelection([
      ...new Set([...props.selection.athletes, ...movedAthleteIds]),
    ]);
  };
  const onClearAllMovedAthletes = () => {
    const movedAthleteIds = props.movedAthletes?.map(({ id }) => `${id}`) ?? [];
    updateAthletesSelection([
      ...props.selection.athletes.filter((id) => !movedAthleteIds.includes(id)),
    ]);
  };

  const updateStaffSelection = (selectedStaffIds: Array<string>) => {
    const updatedSelection = _cloneDeep(props.selection);
    if (props.singleSelection) {
      updatedSelection.athletes = [];
    }
    updatedSelection.staff = selectedStaffIds;
    props.onSelectionChanged(updatedSelection);
  };

  const onClickSelectEntireStaff = () => {
    if (props.staff) {
      updateStaffSelection(
        props.staff.map((staffMember: StaffMemberData) => {
          return staffMember.id.toString();
        })
      );
    }
  };

  const onClickClearEntireStaff = () => {
    updateStaffSelection([]);
  };

  const getAthleteObjectValue = (
    athlete: Athlete | CheckboxItem
  ): AthleteSelectionWithOptionalAdditionalData => {
    if (props.addAthleteDetailsToSelection) {
      return {
        id: athlete.id.toString(),
        additionalData: {
          // $FlowIgnore firstname exists at this point
          firstname: athlete.additionalData?.firstname || athlete.firstname,
          // $FlowIgnore lastname exists at this point
          lastname: athlete.additionalData?.lastname || athlete.lastname,
          squad: athlete.additionalData?.squad || athlete.squad,
        },
      };
    }

    // Distinguishing Athlete from CheckboxItem as checkboxItem won't have user_id
    if (
      props.useUserIdsForAthletes &&
      (typeof athlete.user_id === 'string' ||
        typeof athlete.user_id === 'number')
    ) {
      return athlete.user_id.toString();
    }
    return athlete.id.toString();
  };

  /*
    For league_benchmarking import, we pass squad up to the parent
    component, for use within template creation. Due to this, it would
    technically scope the selections to squads, so ensuring that the comparison
    is only done using id
  */
  const filterClearedAthletes = (athletesInSelection) =>
    _union(props.selection.athletes, athletesInSelection).filter(
      (selectedAthlete) =>
        !athletesInSelection.some(
          (athleteInSelection) =>
            (selectedAthlete?.id || selectedAthlete) ===
            (athleteInSelection?.id || athleteInSelection)
        )
    );

  const onClickSelectEntireSquad = (squadId: number) => {
    if (props.squads) {
      const selectedSquad = props.squads.find((squad) => {
        return squad.id === squadId;
      });

      const athletesInSquad = _flattenDeep(
        selectedSquad?.position_groups.map((positionGroup) =>
          positionGroup.positions.map((position) =>
            position.athletes.map((athlete) =>
              getAthleteObjectValue({
                ...athlete,
                squad: selectedSquad.name,
              })
            )
          )
        )
      );

      updateAthletesSelection(
        _union(props.selection.athletes, athletesInSquad)
      );
    }
  };

  const onClickClearEntireSquad = (squadId: number) => {
    if (props.squads) {
      const selectedSquad = props.squads.find((squad) => {
        return squad.id === squadId;
      });

      const athletesInSquad = _flattenDeep(
        selectedSquad?.position_groups.map((positionGroup) =>
          positionGroup.positions.map((position) =>
            position.athletes.map((athlete) =>
              getAthleteObjectValue({ ...athlete, squad: selectedSquad.name })
            )
          )
        )
      );

      updateAthletesSelection(filterClearedAthletes(athletesInSquad));
    }
  };

  const onClickStaffCheckbox = (staffMember: CheckboxItem) => {
    if (staffMember.checked) {
      if (props.singleSelection) {
        updateStaffSelection([staffMember.id.toString()]);
      } else {
        updateStaffSelection([
          ...props.selection.staff,
          staffMember.id.toString(),
        ]);
      }
    } else {
      updateStaffSelection(
        props.selection.staff.filter(
          (staffId) => staffId !== staffMember.id.toString()
        )
      );
    }
  };

  const onClickSelectAllInPositionGroup = (
    positionGroup: PositionGroup,
    squadName
  ) => {
    const athletesInGroup = _flatten(
      positionGroup.positions.map((position) =>
        position.athletes.map((athlete) =>
          getAthleteObjectValue({ ...athlete, squad: squadName })
        )
      )
    );

    updateAthletesSelection(_union(props.selection.athletes, athletesInGroup));
  };

  const onClickClearAllInPositionGroup = (
    positionGroup: PositionGroup,
    squadName
  ) => {
    const athletesInGroup = _flatten(
      positionGroup.positions.map((position) =>
        position.athletes.map((athlete) =>
          getAthleteObjectValue({ ...athlete, squad: squadName })
        )
      )
    );
    updateAthletesSelection(filterClearedAthletes(athletesInGroup));
  };

  const onClickAthleteCheckbox = (athleteCheckbox: CheckboxItem) => {
    if (athleteCheckbox.checked) {
      if (props.singleSelection) {
        updateAthletesSelection([athleteCheckbox.id.toString()]);
      } else {
        updateAthletesSelection([
          ...props.selection.athletes,
          getAthleteObjectValue(athleteCheckbox),
        ]);
      }
    } else {
      updateAthletesSelection(
        props.selection.athletes.filter((athleteId) =>
          athleteId?.id
            ? athleteId.id !== athleteCheckbox.id.toString()
            : athleteId !== athleteCheckbox.id.toString()
        )
      );
    }
  };

  const getIsChecked = (athlete: Athlete): boolean => {
    return props.addAthleteDetailsToSelection
      ? props.selection.athletes.some(
          (selectedAthlete) =>
            selectedAthlete.id && selectedAthlete.id === athlete.id.toString()
        )
      : props.selection.athletes.includes(
          props.useUserIdsForAthletes
            ? athlete.user_id.toString()
            : athlete.id.toString()
        );
  };

  const getAthleteList = (athleteList, positionName, squadName) => (
    <ul className="athleteAndStaffSelector__athleteList">
      {athleteList.map(
        (athlete) =>
          athlete.fullname.toLowerCase().indexOf(searchTerm) !== -1 && (
            <li
              key={`athlete_${
                props.useUserIdsForAthletes
                  ? athlete.user_id.toString()
                  : athlete.id.toString()
              }`}
              className={classNames('athleteAndStaffSelector__athleteItem', {
                'athleteAndStaffSelector__athleteItem--transitionToAdded':
                  props.addTransitionOnSelection &&
                  props.selection.athletes.includes(
                    props.useUserIdsForAthletes
                      ? athlete.user_id.toString()
                      : athlete.id.toString()
                  ),
              })}
            >
              {props.actionElement === 'CHECKBOX' && (
                <Checkbox
                  id={
                    props.useUserIdsForAthletes
                      ? athlete.user_id.toString()
                      : athlete.id.toString()
                  }
                  label={
                    searchTerm === ''
                      ? athlete.fullname
                      : `${athlete.fullname} (${positionName})`
                  }
                  toggle={onClickAthleteCheckbox}
                  isChecked={getIsChecked(athlete)}
                  radioStyle={props.singleSelection}
                  // TODO: migrate below into new Checkbox component
                  additionalData={
                    props.addAthleteDetailsToSelection
                      ? {
                          firstname: athlete.firstname,
                          lastname: athlete.lastname,
                          squad: squadName,
                        }
                      : undefined
                  }
                />
              )}
              {props.actionElement === 'PLUS_BUTTON' && (
                <>
                  <span className="athleteAndStaffSelector__athleteName">
                    {searchTerm === ''
                      ? athlete.fullname
                      : `${athlete.fullname} (${positionName})`}
                  </span>
                  <span className="athleteAndStaffSelector__actionButton">
                    <IconButton
                      icon="icon-add"
                      onClick={() => {
                        updateAthletesSelection([
                          ...props.selection.athletes,
                          getAthleteObjectValue(athlete),
                        ]);
                      }}
                      isSmall
                      isTransparent
                    />
                  </span>
                </>
              )}
            </li>
          )
      )}
    </ul>
  );

  const getPositionList = (positions: Array<Position>, squadName) => (
    <ul className="athleteAndStaffSelector__positionList">
      {positions.map((position) => (
        <li key={`position_${position.id}`}>
          {searchTerm === '' && (
            <div className="athleteAndStaffSelector__positionItem">
              {position.name}
            </div>
          )}
          {getAthleteList(position.athletes, position.name, squadName)}
        </li>
      ))}
    </ul>
  );

  const getPositionGroupList = (
    squadId: number,
    positionGroups: Array<PositionGroup>,
    squadName
  ) => {
    if (positionGroups) {
      return (
        <ul className="athleteAndStaffSelector__positionGroupList">
          {positionGroups.map((positionGroup) => {
            const hasMatchesForSearch = positionGroupHasSearchMatch(
              positionGroup,
              searchTerm
            );
            return (
              hasMatchesForSearch && (
                <li
                  className="athleteAndStaffSelector__section"
                  key={`${squadId}_${positionGroup.id}`}
                >
                  <header>
                    <span className="athleteAndStaffSelector__positionGroupName">
                      {positionGroup.name}
                    </span>
                    {searchTerm === '' && !props.singleSelection && (
                      <span>
                        <span
                          className="athleteAndStaffSelector__selectAll"
                          onClick={() =>
                            onClickSelectAllInPositionGroup(
                              positionGroup,
                              squadName
                            )
                          }
                        >
                          {props.t('Select All')}
                        </span>
                        <span
                          className="athleteAndStaffSelector__clearAll"
                          onClick={() =>
                            onClickClearAllInPositionGroup(
                              positionGroup,
                              squadName
                            )
                          }
                        >
                          {props.t('Clear')}
                        </span>
                      </span>
                    )}
                  </header>
                  {getPositionList(positionGroup.positions, squadName)}
                </li>
              )
            );
          })}
        </ul>
      );
    }
    return undefined;
  };

  const getSquadHeader = (squadId: number) => {
    if (searchTerm === '')
      return (
        <header className="athleteAndStaffSelector__entireSectionHeader">
          <span className="athleteAndStaffSelector__sectionName">
            {props.t('Entire')} {props.t('#sport_specific__Squad')}
          </span>
          <span>
            <span
              className="athleteAndStaffSelector__selectAll"
              onClick={() => onClickSelectEntireSquad(squadId)}
            >
              {props.t('Select All')}
            </span>
            <span
              className="athleteAndStaffSelector__clearAll"
              onClick={() => onClickClearEntireSquad(squadId)}
            >
              {props.t('Clear')}
            </span>
          </span>
        </header>
      );
    return undefined;
  };

  const getSquads = () => {
    return (
      props.squads &&
      props.squads.map(
        (squad) =>
          squad.position_groups &&
          squadHasSearchMatches(squad, searchTerm) && (
            <Accordion
              title={
                <div className="athleteAndStaffSelector__accordionTitle">
                  {squad.name}
                </div>
              }
              key={`squad_${squad.id}`}
              content={
                <>
                  {!props.singleSelection && getSquadHeader(squad.id)}
                  {getPositionGroupList(
                    squad.id,
                    squad.position_groups,
                    squad.name
                  )}
                </>
              }
              onChange={() => {
                if (expandedSquads.includes(squad.id)) {
                  const removed = expandedSquads.filter(
                    (id) => id !== squad.id
                  );
                  setExpandedSquads(removed);
                } else {
                  const added = [...expandedSquads, squad.id];
                  setExpandedSquads(added);
                }
              }}
              isOpen={shouldExpandSquad(squad, searchTerm)}
            />
          )
      )
    );
  };

  const getStaffHeader = () => {
    if (searchTerm === '') {
      return (
        <header className="athleteAndStaffSelector__entireSectionHeader">
          <span className="athleteAndStaffSelector__sectionName">
            {props.t('Entire staff')}
          </span>
          <span>
            <span
              id="staffSelectAll"
              className="athleteAndStaffSelector__selectAll"
              onClick={() => onClickSelectEntireStaff()}
            >
              {props.t('Select All')}
            </span>
            <span
              id="staffClearAll"
              className="athleteAndStaffSelector__clearAll"
              onClick={() => onClickClearEntireStaff()}
            >
              {props.t('Clear')}
            </span>
          </span>
        </header>
      );
    }
    return undefined;
  };

  const movedAthleteHasSearchMatches = (searchValue: string) => {
    if (searchValue === '') {
      return props.movedAthletes;
    }
    const lowerCaseSearchValue = searchValue.toLocaleLowerCase();
    // todo ask BE to return fullName
    return props.movedAthletes?.filter(({ firstname, lastname }) => {
      const fullName = `${firstname} ${lastname}`;
      return fullName.toLocaleLowerCase().includes(lowerCaseSearchValue);
    });
  };

  const getMovedAthletes = () => {
    const filteredMovedAthlete = movedAthleteHasSearchMatches(searchTerm);
    return (
      filteredMovedAthlete &&
      filteredMovedAthlete.length > 0 && (
        <Accordion
          title={
            <div className="athleteAndStaffSelector__accordionTitle">
              {props.t('Past players')}
            </div>
          }
          content={
            filteredMovedAthlete && (
              <div className="athleteAndStaffSelector__movedAthleteSection">
                <header>
                  {searchTerm === '' && !props.singleSelection && (
                    <span>
                      <span
                        className="athleteAndStaffSelector__selectAll"
                        onClick={onSelectAllMovedAthletes}
                      >
                        {props.t('Select All')}
                      </span>
                      <span
                        className="athleteAndStaffSelector__clearAll"
                        onClick={onClearAllMovedAthletes}
                      >
                        {props.t('Clear')}
                      </span>
                    </span>
                  )}
                </header>
                {filteredMovedAthlete.map(({ id, firstname, lastname }) => {
                  const isChecked = props.selection.athletes.includes(`${id}`);
                  return (
                    <Checkbox
                      id={`${id}`}
                      label={`${firstname} ${lastname}`}
                      toggle={onClickAthleteCheckbox}
                      isChecked={isChecked}
                      radioStyle={props.singleSelection}
                      key={`movedAthleteSection_${id}`}
                      // TODO: migrate below into new Checkbox component
                      additionalData={
                        props.addAthleteDetailsToSelection && {
                          firstname,
                          lastname,
                        }
                      }
                    />
                  );
                })}
              </div>
            )
          }
          isOpen={filteredMovedAthlete.length > 0 && searchTerm.length > 0}
        />
      )
    );
  };

  const getStaffMembers = () => {
    return (
      props.staff &&
      props.staff.map((staffMember) => {
        // Skip staff member if is our user
        if (props.excludeId && staffMember.id === props.excludeId) {
          return undefined;
        }
        return (
          <li key={`staff_${staffMember.id}`}>
            {getStaffFullName(staffMember).toLowerCase().indexOf(searchTerm) !==
              -1 && (
              <div
                className={classNames('athleteAndStaffSelector__staffItem', {
                  'athleteAndStaffSelector__staffItem--transitionToAdded':
                    props.addTransitionOnSelection &&
                    props.selection.staff.includes(staffMember.id.toString()),
                })}
              >
                {props.actionElement === 'CHECKBOX' && (
                  <Checkbox
                    id={staffMember.id.toString()}
                    label={getStaffFullName(staffMember)}
                    toggle={onClickStaffCheckbox}
                    isChecked={props.selection.staff.includes(
                      staffMember.id.toString()
                    )}
                    radioStyle={props.singleSelection}
                  />
                )}
                {props.actionElement === 'PLUS_BUTTON' && (
                  <>
                    <span className="athleteAndStaffSelector__staffName">
                      {getStaffFullName(staffMember)}
                    </span>
                    <span className="athleteAndStaffSelector__actionButton">
                      <IconButton
                        icon="icon-add"
                        onClick={() => {
                          updateStaffSelection([
                            ...props.selection.staff,
                            staffMember.id.toString(),
                          ]);
                        }}
                        isSmall
                        isTransparent
                      />
                    </span>
                  </>
                )}
              </div>
            )}
          </li>
        );
      })
    );
  };

  const getStaffBlock = () => {
    return (
      <Accordion
        key="staff"
        title={
          <div className="athleteAndStaffSelector__accordionTitle">
            {props.t('All Staff')}
          </div>
        }
        content={
          <>
            {!props.singleSelection && getStaffHeader()}
            <ul className="athleteAndStaffSelector__staffList">
              {getStaffMembers()}
            </ul>
          </>
        }
        onChange={() => {
          setStaffExpanded(!staffExpanded);
        }}
        isOpen={shouldExpandStaff(searchTerm)}
      />
    );
  };

  return (
    <DropdownWrapper
      label={props.label}
      hasSearch
      showDropdownButton={false}
      searchTerm={searchTerm}
      dropdownTitle=""
      onTypeSearchTerm={(term) => {
        setSearchTerm(term.toLowerCase());
      }}
    >
      <div className="athleteAndStaffSelector">
        <div className="athleteAndStaffSelector__content">
          {props.squads && props.squads.length > 0 && (
            <>
              <div className="athleteAndStaffSelector__majorTitle">
                {props.t('#sport_specific__Squads')}
              </div>
              {getSquads()}
            </>
          )}
          {props.movedAthletes &&
            props.movedAthletes.length > 0 &&
            getMovedAthletes()}
          {props.staff && props.staff.length > 0 && (
            <>
              <div className="athleteAndStaffSelector__divider" />
              <div className="athleteAndStaffSelector__majorTitle">
                {props.t('Staff')}
              </div>
              {getStaffBlock()}
            </>
          )}
        </div>
      </div>
    </DropdownWrapper>
  );
}

AthleteAndStaffSelector.defaultProps = {
  addTransitionOnSelection: false,
  actionElement: 'CHECKBOX',
};

export default AthleteAndStaffSelector;
export const AthleteAndStaffSelectorTranslated = withNamespaces()(
  AthleteAndStaffSelector
);
