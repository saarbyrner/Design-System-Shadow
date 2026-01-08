// @flow
import { Fragment, useState } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  Accordion,
  Checkbox,
  DropdownWrapper,
  UserAvatar,
} from '@kitman/components';
import { type GameActivity } from '@kitman/common/src/types/GameEvent';
import { type MovedAthlete } from '@kitman/common/src/types/Athlete';
import { Chip, Stack, Tooltip } from '@kitman/playbook/components';
import {
  type PositionGroup,
  type Position,
} from '@kitman/components/src/AthleteSelector/types';
import {
  type Athlete,
  type GameStatus,
} from '@kitman/components/src/Athletes/types';
import {
  type SquadData,
  type AthletesAndStaffSelection,
} from '@kitman/components/src/PlayerSelection/types';
import AthleteAvailabilityPill from '@kitman/components/src/AthleteAvailabilityPill';
import { ATHLETE_GAME_STATUS_VALUE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import styles from './styles';

// set the i18n instance
setI18n(i18n);

const union = (array, ...args) => [...new Set(array.concat(...args))];

type Props = {
  label?: string,
  squads?: Array<SquadData>,
  movedAthletes?: Array<MovedAthlete>,
  selection: AthletesAndStaffSelection,
  onSelectionChanged: Function,
  gameActivities: Array<GameActivity>,
  showPlayerAddedError?: string,
  setShowPlayerAddedError?: (boolean) => void,
  maxSelectedAthletes: ?number,
  isImportedGame?: boolean,
  disablePositionGrouping?: boolean,
  hideAvailabilityStatus?: boolean,
};

const PlayerSelection = (props: I18nProps<Props>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSquads, setExpandedSquads] = useState<string[]>([]);
  const [selectedSquadPositionGroupIds, setSelectedSquadPositionGroupIds] =
    useState<string[]>([]);

  const positionGroupHasSearchMatch = (
    positionGroup: PositionGroup,
    searchValue: string
  ) => {
    if (searchValue === '') {
      return true;
    }

    return positionGroup.positions.some((position) =>
      position.athletes.some((athlete) => {
        return new RegExp(searchValue, 'i').test(athlete.fullname);
      })
    );
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

  const shouldExpandSquad = (squad: SquadData, searchValue: string) => {
    if (searchValue === '') {
      return expandedSquads.includes(squad.id);
    }
    return squadHasSearchMatches(squad, searchValue);
  };

  const updateAthletesSelection = (selectedAthleteIds: Array<string>) => {
    const uniqueSelectedAthleteIds = new Set(selectedAthleteIds);

    if (
      props.setShowPlayerAddedError &&
      props.maxSelectedAthletes !== null &&
      uniqueSelectedAthleteIds.size > +props.maxSelectedAthletes
    ) {
      props.setShowPlayerAddedError(true);
    } else if (props.setShowPlayerAddedError && props.showPlayerAddedError) {
      props.setShowPlayerAddedError(false);
    }
    props.onSelectionChanged({
      ...props.selection,
      athletes: selectedAthleteIds,
    });
  };

  const getAthletesInGroup = (positionGroup: PositionGroup) => {
    const athleteIds = [];
    positionGroup.positions.forEach((position) => {
      position.athletes.forEach((athlete) => {
        if (!athlete?.game_status || athlete?.game_status?.selectable)
          athleteIds.push(athlete.id.toString());
      });
    });

    return athleteIds;
  };

  const onClickSelectAllInPositionGroup = (positionGroup: PositionGroup) => {
    updateAthletesSelection(
      union(props.selection.athletes, getAthletesInGroup(positionGroup))
    );
  };

  const onClickClearAllInPositionGroup = (positionGroup: PositionGroup) => {
    const athletesInGroup = getAthletesInGroup(positionGroup);
    const athleteInGroupWithoutActivities = athletesInGroup.filter(
      (athlete) =>
        !props.gameActivities.find(
          (activity) => activity.athlete_id === +athlete
        )
    );
    updateAthletesSelection(
      props.selection.athletes.filter(
        (i) => !athleteInGroupWithoutActivities.includes(i)
      )
    );
  };

  const onClickAthleteCheckbox = (
    athleteId: string,
    squadPositionGroupKey?: string
  ) => {
    const athleteIndex = props.selection.athletes.findIndex(
      (id) => athleteId.toString() === id
    );
    if (athleteIndex > -1) {
      updateAthletesSelection(
        props.selection.athletes.filter((id) => athleteId.toString() !== id)
      );
      // uncheck position group
      setSelectedSquadPositionGroupIds((prev) =>
        prev.filter((item) => item !== squadPositionGroupKey)
      );
    } else {
      updateAthletesSelection(
        union(props.selection.athletes, athleteId.toString())
      );
    }
  };

  const onClickPositionGroupCheckbox = (
    positionGroupKey: string,
    positionGroup: PositionGroup
  ) => {
    const ids = new Set(selectedSquadPositionGroupIds);
    if (ids.has(positionGroupKey)) {
      ids.delete(positionGroupKey);
      onClickClearAllInPositionGroup(positionGroup);
    } else {
      ids.add(positionGroupKey);
      onClickSelectAllInPositionGroup(positionGroup);
    }

    setSelectedSquadPositionGroupIds([...ids]);
  };

  const onSelectEntireSquad = (squad) => {
    const athleteIds = new Set([]);
    const squadPositionIds = [];
    squad.position_groups.forEach((positionGroup) => {
      squadPositionIds.push(`${squad.id}_${positionGroup.id}`);
      positionGroup.positions.forEach((position) => {
        position.athletes.forEach((athlete) => {
          if (!athlete?.game_status || athlete?.game_status?.selectable)
            athleteIds.add(athlete.id.toString());
        });
      });
    });

    updateAthletesSelection(union(props.selection.athletes, [...athleteIds]));
    setSelectedSquadPositionGroupIds((prev) => {
      return union(prev, squadPositionIds);
    });
  };

  const onClearEntireSquad = (squad) => {
    const athleteIds = [];
    const squadPositionIds = [];
    squad.position_groups.forEach((positionGroup) => {
      squadPositionIds.push(`${squad.id}_${positionGroup.id}`);
      positionGroup.positions.forEach((position) => {
        position.athletes.forEach((athlete) => {
          athleteIds.push(athlete.id.toString());
        });
      });
    });

    const athleteIdsWithoutActivities = athleteIds.filter(
      (athlete) =>
        !props.gameActivities.find(
          (activity) => activity.athlete_id === +athlete
        )
    );
    const filteredIds = props.selection.athletes.filter(
      (athleteId) => !athleteIdsWithoutActivities.includes(athleteId)
    );
    const uniqueIds = [...new Set(filteredIds)];
    updateAthletesSelection(uniqueIds);

    const filteredPositionIds = selectedSquadPositionGroupIds.filter(
      (positionId) => !squadPositionIds.includes(positionId)
    );
    setSelectedSquadPositionGroupIds(filteredPositionIds);
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

  const renderGameStatus = (gameStatus: GameStatus) => (
    <Tooltip
      title={
        <span style={{ whiteSpace: 'pre-line' }}>{gameStatus.description}</span>
      }
      placement="bottom"
      slotProps={{
        popper: {
          sx: { zIndex: 2147483006 },
        },
      }}
    >
      <Chip
        color={gameStatus?.selectable ? 'success' : 'error'}
        label={ATHLETE_GAME_STATUS_VALUE[gameStatus.status]}
        size="medium"
      />
    </Tooltip>
  );

  const renderStatus = (athlete?: Athlete) => {
    if (athlete?.game_status) {
      return renderGameStatus(athlete?.game_status);
    }

    if (!props.hideAvailabilityStatus) {
      return <AthleteAvailabilityPill availability={athlete?.availability} />;
    }

    return null;
  };

  const renderAthlete = (
    athlete: Athlete,
    positionName: string,
    squadPositionGroupKey: string
  ) => {
    const matchesSearch = athlete.fullname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) {
      return null;
    }

    const athleteId = athlete.id.toString();
    const isChecked = props.selection.athletes.includes(athleteId);

    const hasActivity = props.gameActivities.some(
      (activity) => activity.athlete_id === athlete.id
    );
    const isUnselectable =
      athlete.game_status && !athlete.game_status.selectable;
    const isUserRowDisabled = hasActivity || isUnselectable;

    return (
      <li key={`athlete_${athlete.id}`} css={styles.athleteItem}>
        <div
          css={[styles.userRow, isUserRowDisabled && styles.userRowDisabled]}
          onClick={() => {
            if (!isUserRowDisabled) {
              onClickAthleteCheckbox(athleteId, squadPositionGroupKey);
            }
          }}
        >
          <div>
            <Checkbox.New
              id={athleteId}
              onClick={() => {}}
              checked={isChecked}
              disabled={isUserRowDisabled}
            />
            <div css={styles.userRowAvatar}>
              <UserAvatar
                url={athlete.avatar_url}
                firstname={athlete.firstname}
                lastname={athlete.lastname}
                size="SMALL"
                displayInitialsAsFallback
              />
            </div>
            <div>
              <p css={styles.userName}>{athlete.fullname}</p>
              <p css={styles.userRowAthletePosition}>
                {`${positionName}${
                  props.isImportedGame && athlete.designation
                    ? ` - ${athlete.designation}`
                    : ''
                }`}
              </p>
            </div>
          </div>
          {renderStatus(athlete)}
        </div>
      </li>
    );
  };

  const getPositionList = (
    positions: Array<Position>,
    squadPositionGroupKey: string
  ) => (
    <ul css={styles.positionList}>
      {positions.map((position) => {
        return (
          <li key={`position_${position.id}`}>
            <ul css={styles.athleteList}>
              {position?.athletes?.map((athlete) =>
                renderAthlete(athlete, position.name, squadPositionGroupKey)
              )}
            </ul>
          </li>
        );
      })}
    </ul>
  );

  const renderUngroupedPositonList = (
    squadId: string,
    positionGroups: Array<PositionGroup>
  ) => {
    const filteredGroups = positionGroups.filter((group) =>
      positionGroupHasSearchMatch(group, searchTerm)
    );

    const athletesList = filteredGroups
      .flatMap(({ id: groupId, positions }) =>
        positions.flatMap(({ name: positionName, athletes }) =>
          athletes.map((athlete) => ({
            ...athlete,
            positionName,
            squadPositionGroupKey: `${squadId}_${groupId}`,
          }))
        )
      )
      .sort((a, b) => (a.lastname ?? '').localeCompare(b.lastname ?? ''));

    return (
      <ul className="playerSelection__positionList--ungrouped">
        {athletesList.map((athlete) =>
          renderAthlete(
            athlete,
            athlete.positionName,
            athlete.squadPositionGroupKey
          )
        )}
      </ul>
    );
  };

  const getPositionGroupList = (
    squadId: string,
    positionGroups: Array<PositionGroup>
  ) => {
    if (positionGroups) {
      return (
        <ul css={styles.positionGroupList}>
          {positionGroups.map((positionGroup) => {
            const hasMatchesForSearch = positionGroupHasSearchMatch(
              positionGroup,
              searchTerm
            );
            const squadPositionGroupKey = `${squadId}_${positionGroup.id}`;
            const isChecked = selectedSquadPositionGroupIds.includes(
              squadPositionGroupKey
            );
            return (
              hasMatchesForSearch && (
                <li css={styles.section} key={squadPositionGroupKey}>
                  <header>
                    <div
                      onClick={() => {
                        onClickPositionGroupCheckbox(
                          squadPositionGroupKey,
                          positionGroup
                        );
                      }}
                      css={styles.positionGroupWrapper}
                    >
                      <Checkbox.New
                        id={squadPositionGroupKey}
                        onClick={() => {}}
                        checked={isChecked}
                      />
                      <span css={styles.positionGroupName}>
                        {positionGroup.name}
                      </span>
                    </div>
                  </header>
                  {getPositionList(
                    positionGroup.positions,
                    squadPositionGroupKey
                  )}
                </li>
              )
            );
          })}
        </ul>
      );
    }
    return null;
  };

  const onExpandSquad = (squad) => {
    if (expandedSquads.includes(squad.id)) {
      const removed = expandedSquads.filter((id) => id !== squad.id);
      setExpandedSquads(removed);
    } else {
      const added = [...expandedSquads, squad.id];
      setExpandedSquads(added);
    }
  };

  const getMovedAthletes = () => {
    const filteredMovedAthlete = movedAthleteHasSearchMatches(searchTerm);
    return (
      filteredMovedAthlete &&
      filteredMovedAthlete.length > 0 && (
        <Accordion
          title={
            <div css={styles.accordionTitle}>{props.t('Moved athletes')}</div>
          }
          action={
            <div css={styles.squadSelectAndClearContainer}>
              <p onClick={onSelectAllMovedAthletes} css={styles.selectAll}>
                {props.t('Select all moved athletes')}
              </p>
              <p onClick={onClearAllMovedAthletes} css={styles.clearAll}>
                {props.t('Clear')}
              </p>
            </div>
          }
          content={
            filteredMovedAthlete &&
            filteredMovedAthlete.map(({ id, firstname, lastname }) => {
              const isChecked = props.selection.athletes.includes(`${id}`);
              return (
                <li key={`athlete_${id}`}>
                  <div
                    css={styles.movedAthlete}
                    onClick={() => onClickAthleteCheckbox(`${id}`)}
                  >
                    <Checkbox.New
                      id={`${id}`}
                      onClick={() => {}}
                      checked={isChecked}
                    />
                    <span
                      css={styles.userName}
                    >{`${firstname} ${lastname}`}</span>
                  </div>
                </li>
              );
            })
          }
          isOpen={filteredMovedAthlete.length > 0 && searchTerm.length > 0}
        />
      )
    );
  };

  const getSquads = () => {
    return (
      props.squads &&
      props.squads.map((squad, index, array) => {
        const isLastItem = array.length - 1 !== index;

        if (
          !squadHasSearchMatches(squad, searchTerm) ||
          !squad.position_groups
        ) {
          return null;
        }

        return (
          <Fragment key={squad.id}>
            <Accordion
              title={<div css={styles.accordionTitle}>{squad.name}</div>}
              action={
                <div css={styles.squadSelectAndClearContainer}>
                  <p
                    onClick={() => onSelectEntireSquad(squad)}
                    css={styles.selectAll}
                  >
                    {props.t('Select entire squad')}
                  </p>
                  <p
                    onClick={() => onClearEntireSquad(squad)}
                    css={styles.clearAll}
                  >
                    {props.t('Clear')}
                  </p>
                </div>
              }
              key={`squad_${squad.id}`}
              content={
                props.disablePositionGrouping
                  ? renderUngroupedPositonList(squad.id, squad.position_groups)
                  : getPositionGroupList(squad.id, squad.position_groups)
              }
              onChange={() => onExpandSquad(squad)}
              isOpen={shouldExpandSquad(squad, searchTerm)}
            />
            {isLastItem && <div css={styles.divider} />}
          </Fragment>
        );
      })
    );
  };

  return (
    <Stack sx={styles.playerSelectionContainer}>
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
        <div css={styles.playerSelection}>
          <div className="playerSelection__content">
            {props.squads && props.squads.length > 0 && (
              <div css={styles.squadsContainer}>{getSquads()}</div>
            )}
            <div css={styles.squadsContainer}>{getMovedAthletes()}</div>
          </div>
        </div>
      </DropdownWrapper>
    </Stack>
  );
};

export default PlayerSelection;
export const PlayerSelectionTranslated = withNamespaces()(PlayerSelection);
