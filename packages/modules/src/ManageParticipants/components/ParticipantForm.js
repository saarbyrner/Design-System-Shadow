// @flow
import { Fragment, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  ActionTooltip,
  Dropdown,
  InfoTooltip,
  InputNumeric,
  TabBar,
  TextButton,
  ToggleSwitch,
} from '@kitman/components';
import { getAvailabilityList } from '@kitman/common/src/utils/workload';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Squad, Participant, ParticipationLevel } from '../types';
import { ParticipantsFilterTranslated as ParticipantsFilter } from './ParticipantsFilter';
import {
  calculateWorkload,
  getFormErrors,
  getInitialAthleteFilters,
} from '../utils';

type Props = {
  eventType: 'GAME' | 'TRAINING_SESSION',
  availableSquads: Array<Squad>,
  primarySquads: Array<?Squad>,
  participants: Array<Participant>,
  participationLevels: Array<ParticipationLevel>,
  showSquadTab: boolean,
  onDurationChange: Function,
  onParticipationLevelChange: Function,
  onRpeChange: Function,
  onToggleIncludeInGroupCalculations: Function,
  onChangeAllDurations: Function,
  onChangeAllParticipationLevels: Function,
  onToggleAllIncludeInGroupCalculations: Function,
  onClickCancel: Function,
  onClickSave: Function,
};

const ParticipantForm = (props: I18nProps<Props>) => {
  const [primarySquadsById, setPrimarySquadsById] = useState({});
  const [selectedSquadId, setSelectedSquadId] = useState(
    props.availableSquads[0].id
  );
  const [participationLevelBulkEdit, setParticipationLevelBulkEdit] = useState(
    props.participationLevels[0].id
  );
  const [durationBulkEdit, setDurationBulkEdit] = useState('');
  const [
    includeInGroupCalculationsBulkEdit,
    setIncludeInGroupCalculationsBulkEdit,
  ] = useState(false);
  const [participantsErrors, setParticipantsErrors] = useState({});
  const [athleteFilters, setAthleteFilters] = useState(
    getInitialAthleteFilters(props.availableSquads, props.participants)
  );

  useEffect(() => {
    const squadsById =
      props.primarySquads.length > 0
        ? props.primarySquads.reduce((squadHash, squad) => {
            // $FlowFixMe squad must exist
            squadHash[squad.id] = squad.name; // eslint-disable-line no-param-reassign
            return squadHash;
          }, {})
        : {};
    setPrimarySquadsById(squadsById);
  }, [props.primarySquads]);

  const squadFilteredAthletes = athleteFilters.find(
    (athleteFilter) => athleteFilter.squadId === selectedSquadId
    // $FlowFixMe
  ).filteredAthletes;

  const onFilterChange = (filteredAthletes) => {
    setAthleteFilters(
      athleteFilters.map((filter) =>
        filter.squadId === selectedSquadId
          ? { ...filter, filteredAthletes }
          : filter
      )
    );
  };

  const getParticipantErrors = (athleteId) => {
    if (
      !participantsErrors[athleteId] ||
      participantsErrors[athleteId].length === 0
    ) {
      return null;
    }

    return (
      <tr className="participantForm__errors">
        <td>
          <ul>
            {participantsErrors[athleteId].map((error, index) => (
              <li key={index}>{error}</li> // eslint-disable-line react/no-array-index-key
            ))}
          </ul>
        </td>
      </tr>
    );
  };

  const getParticipantRow = (participant) => {
    const canonicalParticipationLevel = props.participationLevels.find(
      (participationLevel) =>
        participationLevel.id === participant.participation_level_id
    )?.canonical_participation_level;
    // first squad is always the current squad
    const isAthletePrimarySquadSelected =
      participant.primary_squad_id === props.availableSquads[0].id;

    return (
      <Fragment key={participant.athlete_id}>
        <tr>
          <td>
            <div className="participantForm__athleteCell">
              <InfoTooltip
                placement="top-start"
                content={
                  getAvailabilityList().find(
                    (availability) =>
                      availability.id === participant.availability
                  )?.name
                }
              >
                <span
                  className={`participantForm__availabilityCircle participantForm__availabilityCircle--${participant.availability}`}
                />
              </InfoTooltip>
              <div className="participantForm__athleteNameContainer">
                <span className="participantForm__athleteName">
                  {participant.athlete_fullname}
                </span>
                {participant.primary_squad_id && (
                  <span className="participantForm__primarySquadName">
                    {primarySquadsById[participant.primary_squad_id]}
                  </span>
                )}
              </div>
            </div>
          </td>

          <td>
            <Dropdown
              items={props.participationLevels}
              onChange={(participationLevelId) => {
                const selectedParticipationLevel =
                  props.participationLevels.find(
                    (participationLevel) =>
                      participationLevel.id === participationLevelId
                  );

                props.onParticipationLevelChange(
                  participant.athlete_id,
                  selectedParticipationLevel,
                  isAthletePrimarySquadSelected
                );
              }}
              value={participant.participation_level_id}
            />
          </td>

          <td className="text-center participantForm__includeInGroupCalculationsColumn">
            <ToggleSwitch
              isSwitchedOn={participant.include_in_group_calculations}
              toggle={() =>
                props.onToggleIncludeInGroupCalculations(participant.athlete_id)
              }
              isDisabled={canonicalParticipationLevel === 'none'}
            />
          </td>

          <td className="text-center">
            <div className="participantForm__durationField">
              <InputNumeric
                value={participant.duration}
                onChange={(duration) =>
                  props.onDurationChange(participant.athlete_id, duration)
                }
                disabled={canonicalParticipationLevel === 'none'}
                size="small"
              />
            </div>
          </td>
          <td className="text-center">
            <div className="participantForm__rpeField">
              <InputNumeric
                value={participant.rpe}
                onChange={(rpe) =>
                  props.onRpeChange(participant.athlete_id, rpe)
                }
                disabled={canonicalParticipationLevel === 'none'}
                size="small"
              />
            </div>
          </td>
          <td className="text-center">
            {calculateWorkload(participant.rpe, participant.duration)}
          </td>
        </tr>
        {getParticipantErrors(participant.athlete_id)}
      </Fragment>
    );
  };

  const getParticipantsRows = () => {
    const filteredParticipants = props.participants.filter((participant) =>
      squadFilteredAthletes.includes(participant.athlete_id)
    );

    if (filteredParticipants.length === 0) {
      return (
        <tr className="participantForm__noResult">
          <td>{props.t('No results found')}</td>
        </tr>
      );
    }

    return filteredParticipants.map((participant) =>
      getParticipantRow(participant)
    );
  };

  const durationBulkEditForm = () => {
    return (
      <>
        <div className="bulkEditTooltip__label">
          {props.eventType === 'GAME'
            ? props.t('Set all Game minutes')
            : props.t('Set all Training minutes')}
        </div>
        <div className="bulkEditTooltip__durationField">
          <InputNumeric
            value={durationBulkEdit}
            onChange={(duration) => {
              setDurationBulkEdit(duration);
            }}
            size="small"
          />
        </div>
      </>
    );
  };

  const participationLevelBulkEditForm = () => {
    return (
      <div className="bulkEditTooltip__participationLevelField">
        <Dropdown
          items={props.participationLevels}
          onChange={(participationLevel) =>
            setParticipationLevelBulkEdit(participationLevel)
          }
          value={participationLevelBulkEdit}
        />
      </div>
    );
  };

  const includeInGroupCalculationsBulkEditForm = () => {
    return (
      <div className="bulkEditIncludeInGroupCalculationsTooltip">
        <div className="bulkEditIncludeInGroupCalculationsTooltip__label">
          {props.t('Set to include all in group calculations')}
        </div>
        <ToggleSwitch
          isSwitchedOn={includeInGroupCalculationsBulkEdit}
          toggle={() => {
            setIncludeInGroupCalculationsBulkEdit(
              !includeInGroupCalculationsBulkEdit
            );
          }}
        />
      </div>
    );
  };

  const getEditTooltipTrigger = () => {
    return (
      <div className="participantForm__bulkEditCTA">{props.t('set')} ▾</div>
    );
  };

  const getBulkEditTooltip = (
    field: 'DURATION' | 'PARTICIPATION_LEVEL' | 'INCLUDE_IN_GROUP_CALCULATION'
  ) => {
    switch (field) {
      case 'DURATION': {
        return (
          <ActionTooltip
            actionSettings={{
              text: props.t('Set'),
              onCallAction: () => {
                if (props.eventType === 'GAME') {
                  TrackEvent(
                    'manage participation fixture',
                    'click',
                    'set duration'
                  );
                } else {
                  TrackEvent(
                    'manage participation training',
                    'click',
                    'set duration'
                  );
                }
                props.onChangeAllDurations(
                  squadFilteredAthletes,
                  durationBulkEdit
                );
              },
            }}
            content={durationBulkEditForm()}
            triggerElement={getEditTooltipTrigger()}
          />
        );
      }
      case 'PARTICIPATION_LEVEL': {
        return (
          <ActionTooltip
            actionSettings={{
              text: props.t('Set'),
              onCallAction: () => {
                if (props.eventType === 'GAME') {
                  TrackEvent(
                    'manage participation fixture',
                    'click',
                    'set participation level'
                  );
                } else {
                  TrackEvent(
                    'manage participation training',
                    'click',
                    'set participation level'
                  );
                }

                const selectedParticipationLevel =
                  props.participationLevels.find(
                    (participationLevel) =>
                      participationLevel.id === participationLevelBulkEdit
                  );

                props.onChangeAllParticipationLevels(
                  squadFilteredAthletes,
                  selectedParticipationLevel,
                  props.availableSquads[0].id
                );
              },
            }}
            content={participationLevelBulkEditForm()}
            triggerElement={getEditTooltipTrigger()}
          />
        );
      }
      case 'INCLUDE_IN_GROUP_CALCULATION': {
        return (
          <ActionTooltip
            actionSettings={{
              text: props.t('Set'),
              onCallAction: () => {
                if (props.eventType === 'GAME') {
                  TrackEvent(
                    'manage participation fixture',
                    'click',
                    'set include in average'
                  );
                } else {
                  TrackEvent(
                    'manage participation training',
                    'click',
                    'set include in average'
                  );
                }

                props.onToggleAllIncludeInGroupCalculations(
                  squadFilteredAthletes,
                  includeInGroupCalculationsBulkEdit
                );
              },
            }}
            content={includeInGroupCalculationsBulkEditForm()}
            triggerElement={getEditTooltipTrigger()}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="participantForm">
      {props.showSquadTab ? (
        <TabBar
          tabPanes={props.availableSquads.map((squad) => ({
            title: squad.name,
            content: (
              <ParticipantsFilter
                primarySquads={props.primarySquads}
                squad={squad}
                participants={props.participants}
                participationLevels={props.participationLevels}
                onFilterChange={onFilterChange}
              />
            ),
          }))}
          onClickTab={(tabIndex) =>
            setSelectedSquadId(props.availableSquads[+tabIndex].id)
          }
        />
      ) : (
        <ParticipantsFilter
          primarySquads={props.primarySquads}
          squad={props.availableSquads[0]}
          participants={props.participants}
          participationLevels={props.participationLevels}
          onFilterChange={onFilterChange}
        />
      )}
      <table className="participantForm__table table km-table">
        <thead>
          <tr>
            <th className="participantForm__athleteColumn">
              {props.t('#sport_specific__Athlete')}
            </th>

            <th>
              {props.t('Participation Level')}
              {getBulkEditTooltip('PARTICIPATION_LEVEL')}
            </th>

            <th className="text-center participantForm__includeInGroupCalculationsColumn">
              {props.t('Include in group calculations')}
              {getBulkEditTooltip('INCLUDE_IN_GROUP_CALCULATION')}
            </th>

            <th className="text-center">
              {props.eventType === 'GAME'
                ? props.t('Game minutes')
                : props.t('Training minutes')}
              {getBulkEditTooltip('DURATION')}
            </th>
            <th className="text-center">{props.t('RPE')}</th>
            <th className="text-center">{props.t('Load')}</th>
          </tr>
        </thead>
        <tbody>{getParticipantsRows()}</tbody>
      </table>
      <div className="participantForm__footer">
        <TextButton
          text={props.t('Cancel')}
          onClick={props.onClickCancel}
          type="secondary"
        />
        <TextButton
          text={props.t('Save')}
          onClick={() => {
            const { errors, isFormValid } = getFormErrors(props.participants);

            if (isFormValid) {
              props.onClickSave();
            } else {
              setParticipantsErrors(errors);
            }
          }}
          type="primary"
        />
      </div>
    </div>
  );
};

export default ParticipantForm;
export const ParticipantFormTranslated = withNamespaces()(ParticipantForm);
