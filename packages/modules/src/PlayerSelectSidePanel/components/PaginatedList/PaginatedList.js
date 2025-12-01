// @flow
import { useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import useLocationHash from '@kitman/common/src/hooks/useLocationHash';
import { colors } from '@kitman/common/src/variables';
import List from '@kitman/components/src/Athletes/components/List';
import { TextLink } from '@kitman/components';
import type { Option, Options } from '@kitman/components/src/Select';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';

import AthleteList from '../AthleteList/AthleteList';
import { allowedAthleteHashes } from '../../shared/resources';

const style = {
  athleteTextLinkContainer: {
    padding: '8px 36px',
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  positionName: {
    color: colors.grey_100,
    fontWeight: 600,
    fontSize: 14,
    padding: '4px 8px 4px 22px',
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  nflPlayerId: {
    color: colors.grey_100,
    fontSize: 11,
    fontWeight: 400,
  },
};

const PaginatedList = ({
  setSelectedParentOption,
  filteredOptions,
}: {
  setSelectedParentOption: Function,
  filteredOptions: Array<Option> | Array<Options> | null,
}) => {
  const { trackEvent } = useEventTracking();
  const virtuosoRef = useRef(null);

  const hash = useLocationHash();

  const getItemContent = (option) => {
    if (option.parent) {
      return (
        <List.Option
          key={`${option.value}_${option.label}`}
          title={option.label}
          onClick={() => {
            if (option.options?.length) {
              trackEvent(
                performanceMedicineEventNames.playerListSquadSelected,
              );
              setSelectedParentOption(option);
            } else {
              setSelectedParentOption(null);
            }
          }}
          renderRight={() => {
            return (
              !!option.options?.length && (
                <>
                  <i className="icon-next-right" />
                </>
              )
            );
          }}
        />
      );
    }

    if (option.athletes) {
      return (
        <div key={option.name}>
          <div css={style.positionName}>{option.name}</div>

          {option.athletes.map((athlete) => {
            if (athlete.has_injuries) {
              return (
                <AthleteList
                  key={athlete.id}
                  athlete={athlete}
                  trackAthleteClicks
                />
              );
            }
            return (
              <div
                css={style.athleteTextLinkContainer}
                key={`${athlete.id}_${athlete.fullname}`}
              >
                <TextLink
                  text={`${athlete.lastname}, ${athlete.firstname}`}
                  href={`/medical/athletes/${athlete.id}${
                    allowedAthleteHashes.includes(hash) ? hash : ''
                  }`}
                  kitmanDesignSystem
                  onClick={() => {
                    trackEvent(
                      performanceMedicineEventNames.playerListPlayerSelected,
                    );
                  }}
                />
                {athlete.id && (
                  <div css={style.nflPlayerId}>{`${
                    athlete.nfl_player_id || athlete.id
                  } | ${DateFormatter.formatShort(
                    moment(athlete.date_of_birth)
                  )}`}</div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    if (!option.has_injuries) {
      return (
        <div
          css={style.athleteTextLinkContainer}
          key={`${option.value}_${option.label}`}
        >
          <TextLink
            text={`${option.lastname}, ${option.firstname}`}
            href={`/medical/athletes/${option.id}${
              allowedAthleteHashes.includes(hash) ? hash : ''
            }`}
            kitmanDesignSystem
            onClick={() => {
              trackEvent(
                performanceMedicineEventNames.playerListPlayerSelected,
              );
            }}
          />
          {option.id && (
            <div css={style.nflPlayerId}>{`${
              option?.nfl_player_id || option.id
            } | ${DateFormatter.formatShort(
              moment(option.date_of_birth)
            )}`}</div>
          )}
        </div>
      );
    }
    if (option.has_injuries) {
      return (
        <AthleteList key={option.id} athlete={option} trackAthleteClicks />
      );
    }
    return null;
  };
  return (
    <Virtuoso
      ref={virtuosoRef}
      data={filteredOptions}
      totalCount={filteredOptions?.length}
      itemContent={(index, option) => getItemContent(option)}
    />
  );
};

export default PaginatedList;
