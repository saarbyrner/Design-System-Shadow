// @flow
import { useState } from 'react';
import moment from 'moment';

import useLocationHash from '@kitman/common/src/hooks/useLocationHash';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import {
  Accordion,
  AppStatus,
  LoadingSpinner,
  TextLink,
} from '@kitman/components';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import type { Athlete } from '@kitman/common/src/types/Athlete';

import {
  allowedAthleteHashes,
  allowedIssueHashes,
} from '../../shared/resources';
import { useGetAthleteIssuesQuery } from '../../services/api/playerSelectApi';
import { getIssueTypePath } from '../../../Medical/shared/utils';

const style = {
  accordion: {
    padding: '8px 12px',
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  athleteText: {
    color: colors.grey_100,
    fontWeight: 600,
  },
  issueText: {
    padding: '4px 4px 4px 32px',
    color: colors.grey_100,
    fontWeight: 600,
  },
  playerLink: {
    display: 'flex',
    textAlign: 'left',
  },
  nflPlayerId: {
    color: colors.grey_100,
    fontSize: 11,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
  },
  loadingSpinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 8,
  },
};

type NflAthlete = Athlete & { nfl_player_id: number, date_of_birth: string };

const AthleteList = ({
  athlete,
  trackAthleteClicks,
}: {
  athlete: NflAthlete,
  trackAthleteClicks: boolean,
}) => {
  const { trackEvent } = useEventTracking();
  const hash = useLocationHash();

  const [athleteId, setAthleteId] = useState<number | null>(null);

  const {
    data: athleteIssues,
    isError,
    isFetching,
  } = useGetAthleteIssuesQuery(
    {
      athleteId,
      issueStatus: 'open',
    },
    {
      skip: !athleteId || !window.getFlag('player-selector-side-nav'),
    }
  );

  const onClickAthlete = () => {
    if (!trackAthleteClicks) {
      return;
    }

    trackEvent(
      performanceMedicineEventNames.playerListPlayerSelected,
    );
  };

  const getContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }

    if (isFetching) {
      return (
        <div style={style.loadingSpinnerContainer}>
          <LoadingSpinner size={30} color={colors.grey_400} />
        </div>
      );
    }

    if (athleteIssues && athleteIssues.issues) {
      return athleteIssues.issues?.map((issue) => {
        return (
          <div
            style={style.issueText}
            key={`${issue.issue_type}_${issue.id}_${
              issue.issue_occurrence_title || issue.full_pathology
            }`}
          >
            <LinkTooltipCell
              valueLimit={25}
              longText={issue.issue_occurrence_title || issue.full_pathology}
              url={`/medical/athletes/${athlete.id}/${getIssueTypePath(
                issue.issue_type
              )}/${issue.id}${allowedIssueHashes.includes(hash) ? hash : ''}`}
              kitmanDesignSystem
              onClick={() => {
                if (!trackAthleteClicks) {
                  return;
                }
                trackEvent(
                  performanceMedicineEventNames.playerListIssueSelected,
                );
              }}
            />
          </div>
        );
      });
    }

    return null;
  };

  return (
    <div style={style.accordion}>
      <Accordion
        style={style.athleteText}
        iconAlign="left"
        title={
          <div>
            <div
              style={style.playerLink}
              key={`${athlete.nfl_player_id || athlete.id}_${athlete.fullname}`}
            >
              <TextLink
                text={`${athlete.lastname}, ${athlete.firstname}`}
                href={`/medical/athletes/${athlete.id}${
                  allowedAthleteHashes.includes(hash) ? hash : ''
                }`}
                kitmanDesignSystem
                onClick={() => onClickAthlete()}
              />
            </div>
            {athlete.id && (
              <div style={style.nflPlayerId}>{`${
                athlete.nfl_player_id || athlete.id
              } |  ${DateFormatter.formatShort(
                moment(athlete.date_of_birth)
              )}`}</div>
            )}
          </div>
        }
        onChange={() => {
          setAthleteId(() => athlete.id);
        }}
        content={getContent()}
        overrideStyles={{
          button: css({ display: 'flex', gap: '4px' }),
        }}
        isRightArrowIcon
      />
    </div>
  );
};

export default AthleteList;
