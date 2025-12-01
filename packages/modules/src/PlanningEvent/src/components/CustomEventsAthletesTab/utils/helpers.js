// @flow
import { UserAvatar, TextLink, ToggleSwitch } from '@kitman/components';
import type { AthleteEventV2, Athlete } from '@kitman/common/src/types/Event';
import type { Translation } from '@kitman/common/src/types/i18n';
import type {
  DataTableColumns,
  DataTableData,
} from '@kitman/modules/src/Medical/shared/components/DataTable/';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import type { Params as UpdateEventAttributesParams } from '@kitman/services/src/services/planning/updateEventAttributes';
import {
  createHeaderFunction,
  mapArrayToCells,
} from '../../../helpers/tableComponents';
import { style } from './style';

export const createAthletePagePath = (id: number) => `/athletes/${id}`;

export const createColumns = (
  t: Translation,
  participationLevels: Array<ParticipationLevel>,
  eventId: number,
  refetchTable: (input: UpdateEventAttributesParams) => Promise<void>,
  canEditEvent: boolean
) => {
  const fullParticipationLevelId = participationLevels.find(
    (item) => item.canonical_participation_level === 'full'
  )?.id;

  const noParticipationLevelId = participationLevels.find(
    (item) => item.canonical_participation_level === 'none'
  )?.id;

  const participantColumn: DataTableColumns = {
    Header: createHeaderFunction(t, 'Participants'),
    accessor: 'participant',
    width: 100,
    Cell: ({ value }: { value: Athlete }) => {
      const {
        firstname,
        lastname,
        fullname,
        avatar_url: avatarUrl,
        position,
        availability,
        id,
      } = value;
      return (
        <div css={style.athleteCell}>
          <div css={style.imageContainer}>
            <UserAvatar
              url={avatarUrl}
              firstname={firstname}
              lastname={lastname}
              displayInitialsAsFallback={false}
              availability={availability}
              statusDotMargin={-1}
            />
          </div>
          <div css={style.detailsContainer}>
            <TextLink text={fullname} href={createAthletePagePath(id)} />

            <span css={style.position}>{position.name}</span>
          </div>
        </div>
      );
    },
  };

  const attendanceColumn: DataTableColumns = {
    Header: ({
      data,
    }: {
      data: Array<{ attendance: ParticipationLevel } & { athlete_id: number }>,
    }) => {
      const initialAttendanceToggleValue =
        data.length > 0 &&
        data.every(
          ({ attendance }) =>
            attendance.canonical_participation_level === 'full'
        );
      return (
        <div css={[style.header, style.toggleStyles]}>
          <ToggleSwitch
            kitmanDesignSystem
            label={t('Attended')}
            isDisabled={!canEditEvent}
            isSwitchedOn={initialAttendanceToggleValue}
            toggle={async () => {
              await refetchTable({
                eventId,
                attributes: {
                  participation_level: initialAttendanceToggleValue
                    ? noParticipationLevelId
                    : fullParticipationLevelId,
                },
                filters: {},
                tab: 'athletes_tab',
                disableGrid: true,
              });
            }}
          />
        </div>
      );
    },
    accessor: 'attendance',
    width: 100,
    Cell: ({
      value,
    }: {
      value: ParticipationLevel & { athlete_id: number },
    }) => {
      return (
        <div css={[style.toggleColumnStyle, style.toggleStyles]}>
          <ToggleSwitch
            kitmanDesignSystem
            isDisabled={!canEditEvent}
            isSwitchedOn={value.canonical_participation_level === 'full'}
            toggle={async () => {
              await refetchTable({
                eventId,
                attributes: {
                  participation_level:
                    value.canonical_participation_level === 'full'
                      ? noParticipationLevelId
                      : fullParticipationLevelId,
                },
                athleteId: value.athlete_id,
                filters: {},
                tab: 'athletes_tab',
                disableGrid: true,
              });
            }}
          />
        </div>
      );
    },
  };

  const squadsColumn: DataTableColumns = {
    Header: createHeaderFunction(t, 'Squads'),
    accessor: 'squads',
    width: 100,
    Cell: ({ value }: { value: Array<string> }) => {
      return mapArrayToCells(value);
    },
  };

  return [participantColumn, attendanceColumn, squadsColumn];
};

export const createRows = (
  athleteEvents: Array<AthleteEventV2>
): DataTableData[] => {
  return athleteEvents.map(
    ({ athlete, participation_level: participationLevel }) => {
      return {
        squads: athlete.athlete_squads?.map(({ name }) => name),
        participant: { ...athlete },
        attendance: {
          ...participationLevel,
          athlete_id: athlete.id,
        },
      };
    }
  );
};
