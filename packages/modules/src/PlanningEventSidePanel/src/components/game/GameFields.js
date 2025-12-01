// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import type { ComponentType } from 'react';

import {
  Select,
  InputNumeric,
  Checkbox,
  InputText,
  withSelectServiceSuppliedOptions,
} from '@kitman/components';
import {
  getTeams,
  getOrganisationTeams,
  getCompetitions,
  getVenueTypes,
} from '@kitman/services';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';
import type {
  EventGameFormData,
  GameAttributesValidity,
  OnUpdateEventDetails,
} from '../../types';

export type Props = {
  event: EventGameFormData,
  eventValidity: GameAttributesValidity,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
};

export const isEventDateInFuture = (event: EventGameFormData) => {
  const startTimeWithTimezone = moment.tz(
    event.start_time,
    event.local_timezone
  );
  return startTimeWithTimezone.isAfter(moment().endOf('day'));
};

const GameFields = (props: I18nProps<Props>) => {
  const isFutureEvent = isEventDateInFuture(props.event);

  const TeamSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getOrganisationTeams, {
        dataId: 'organisation_team_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    [props.onDataLoadingStatusChanged]
  );

  const OppositionSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getTeams, {
        dataId: 'team_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    [props.onDataLoadingStatusChanged]
  );

  const CompetitionSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getCompetitions, {
        dataId: 'competition_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    [props.onDataLoadingStatusChanged]
  );

  const VenueSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getVenueTypes, {
        dataId: 'venue_type_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    [props.onDataLoadingStatusChanged]
  );

  return (
    <>
      <div css={style.teamScoreRow}>
        <TeamSelect
          label={props.t('Team')}
          onChange={(value) => {
            props.onUpdateEventDetails({ organisation_team_id: value });
          }}
          value={props.event.organisation_team_id}
          invalid={props.eventValidity.organisation_team_id?.isInvalid}
          data-testid="GameFields|Team"
        />
        <InputNumeric
          label={props.t('Score')}
          name="score"
          value={props.event.score ?? undefined}
          onChange={(value) => {
            props.onUpdateEventDetails({ score: value });
          }}
          disabled={isFutureEvent}
          kitmanDesignSystem
          isInvalid={props.eventValidity.score?.isInvalid}
          data-testid="GameFields|Score"
        />
      </div>
      <div css={style.teamScoreRow}>
        <OppositionSelect
          label={props.t('Opposition')}
          onChange={(value) => {
            props.onUpdateEventDetails({ team_id: value });
          }}
          value={props.event.team_id}
          invalid={props.eventValidity.team_id?.isInvalid}
          data-testid="GameFields|Opposition"
        />
        <InputNumeric
          label={props.t('Score')}
          name="score"
          value={props.event.opponent_score ?? undefined}
          onChange={(value) => {
            props.onUpdateEventDetails({
              opponent_score: value,
            });
          }}
          disabled={isFutureEvent}
          kitmanDesignSystem
          isInvalid={props.eventValidity.opponent_score?.isInvalid}
          data-testid="GameFields|OpponentScore"
        />
      </div>
      <CompetitionSelect
        label={props.t('Competition')}
        onChange={(value) => {
          props.onUpdateEventDetails({ competition_id: value });
        }}
        value={props.event.competition_id}
        invalid={props.eventValidity.competition_id?.isInvalid}
        data-testid="GameFields|Competition"
      />
      <div css={style.twoColumnGrid}>
        <InputNumeric
          name="roundNumber"
          label={props.t('#sport_specific__Round_number')}
          onChange={(value) => {
            props.onUpdateEventDetails({ round_number: value });
          }}
          value={props.event.round_number ?? undefined}
          kitmanDesignSystem
          isInvalid={props.eventValidity.round_number?.isInvalid}
          optional
          data-testid="GameFields|RoundNumber"
        />
        <VenueSelect
          label={props.t('Venue')}
          onChange={(value) => {
            props.onUpdateEventDetails({ venue_type_id: value });
          }}
          value={props.event.venue_type_id}
          invalid={props.eventValidity.venue_type_id?.isInvalid}
          data-testid="GameFields|Venue"
        />
      </div>
      <div>
        <Checkbox
          name="createTurnaroundMarker"
          id="createTurnaroundMarker"
          label={props.t('Create Turnaround Marker')}
          isChecked={props.event.turnaround_fixture}
          kitmanDesignSystem
          toggle={(data) => {
            props.onUpdateEventDetails({ turnaround_fixture: data.checked });
          }}
          data-testid="GameFields|CreateTurnaroundMarker"
        />
      </div>
      <div>
        <span css={style.optionalLabel}>{props.t('Turnaround prefix')}</span>
        <InputText
          placeholder={props.t('Turnaround prefix')}
          onValidation={({ value }) => {
            if (value !== props.event.turnaround_prefix) {
              props.onUpdateEventDetails({ turnaround_prefix: value });
            }
          }}
          value={props.event.turnaround_prefix || ''}
          maxLength={2}
          showRemainingChars={false}
          showCharsLimitReached={false}
          disabled={!props.event.turnaround_fixture}
          kitmanDesignSystem
          invalid={props.eventValidity.turnaround_prefix?.isInvalid}
          data-testid="GameFields|TurnaroundPrefix"
        />
      </div>
    </>
  );
};

export const GameFieldsTranslated: ComponentType<Props> =
  withNamespaces()(GameFields);
export default GameFields;
