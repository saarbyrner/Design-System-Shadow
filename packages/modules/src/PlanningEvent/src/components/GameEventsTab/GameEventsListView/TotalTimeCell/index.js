// @flow
import { Fragment, useEffect, useCallback, useMemo, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import Tippy from '@tippyjs/react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import { InputTextField } from '@kitman/components';
import type {
  AthletePlayTime,
  GameActivity,
  GamePeriod,
  TimeCellFormatType,
} from '@kitman/common/src/types/GameEvent';
import type { GamePeriodDuration } from '@kitman/modules/src/PlanningEvent/types';
import { timeCellFormat } from '@kitman/common/src/consts/gameEventConsts';
import { getManualAthletePlayTimeForPeriod } from '@kitman/common/src/utils/planningEvent/athletePlayTimesUtils';

import { sumTotalMinutesByPosition, sumTotalMinutes } from '../../Helpers';
import baseStyle from './styles';

type Props = {
  type: TimeCellFormatType,
  athleteId: number,
  positionGroups: Array<PositionGroup>,
  gameActivities: Array<GameActivity>,
  periodDurations: Array<GamePeriodDuration>,
  isTimeEditable?: boolean,
  currentPeriod?: GamePeriod,
  manualPlayerSummaryTimeInfo?: ?Array<AthletePlayTime>,
  manualPlayerPeriodTimeInfo?: ?AthletePlayTime,
  handleUpdatingManualAthletePlayTimeInfo?: (number, number) => void,
};

export type TranslatedProps = I18nProps<Props>;

const TotalTimeCell = (props: TranslatedProps) => {
  const [gameActivityUpdates, setGameActivityUpdates] = useState([]);
  const [isManuallySettingTime, setIsManuallySettingTime] = useState(false);
  const [manualTime, setManualTime] = useState<?number>(null);

  const minimumValueInvalidityCheck = !(
    props.manualPlayerPeriodTimeInfo &&
    props.manualPlayerPeriodTimeInfo.position_id
  )
    ? +manualTime < 0
    : +manualTime <= 0;

  const isManualTimeInvalid =
    +manualTime > +props.currentPeriod?.duration || minimumValueInvalidityCheck;

  const hasManualPeriodMinutesChanged =
    props.manualPlayerPeriodTimeInfo &&
    props.manualPlayerPeriodTimeInfo?.minutes < +props.currentPeriod?.duration;

  const handleLeaveManualInput = () => {
    if (!isManualTimeInvalid) {
      props.handleUpdatingManualAthletePlayTimeInfo?.(
        manualTime || 0,
        props.athleteId
      );
    } else {
      setManualTime(null);
    }
    setIsManuallySettingTime(false);
  };

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        handleLeaveManualInput();
      }
    },
    [setIsManuallySettingTime, manualTime]
  );

  const positionsDropdownOptions = useMemo(
    () => [
      ...props.positionGroups
        .map((positionsGroup) =>
          positionsGroup.positions?.map(({ id, abbreviation }) => ({
            value: id,
            label: abbreviation,
          }))
        )
        .flat(),
      {
        value: 'SUBSTITUTE',
        label: props.t('Sub'),
      },
    ],
    [props.positionGroups]
  );

  const getInitialFormData = () => {
    const distinctPositions = [
      ...new Set(props.gameActivities.map((item) => item.relation?.id)),
    ];

    const positionTotals = distinctPositions.map((pos, index) => {
      let total = 0;
      props.periodDurations?.forEach((period) => {
        const manualPlayerInfo = getManualAthletePlayTimeForPeriod(
          props.athleteId,
          props.manualPlayerSummaryTimeInfo,
          +period.id
        );
        total += manualPlayerInfo?.minutes
          ? manualPlayerInfo?.minutes
          : sumTotalMinutesByPosition(
              props.gameActivities.filter(
                (gameActivity) => gameActivity.game_period_id === period.id
              ),
              period.min,
              period.max,
              String(pos)
            );
      });

      return {
        indexVal: index,
        total,
        relation_id: pos,
      };
    });

    return positionTotals;
  };

  useEffect(() => {
    setGameActivityUpdates(getInitialFormData());
  }, [props.gameActivities]);

  useEffect(() => {
    if (
      props.manualPlayerPeriodTimeInfo?.minutes &&
      props.manualPlayerPeriodTimeInfo.minutes !== manualTime
    )
      setManualTime(props.manualPlayerPeriodTimeInfo.minutes);
  }, [props.manualPlayerPeriodTimeInfo?.minutes, isManuallySettingTime]);

  const getTotalDuration = () => {
    let total = 0;

    props.periodDurations?.forEach((period) => {
      if (
        props.type === timeCellFormat.summary &&
        props.manualPlayerSummaryTimeInfo?.length
      ) {
        const manualAthleteTimeForPeriod = getManualAthletePlayTimeForPeriod(
          props.athleteId,
          props.manualPlayerSummaryTimeInfo,
          +period.id
        );

        const periodDuration = period.max - period.min;
        if (
          manualAthleteTimeForPeriod?.minutes &&
          manualAthleteTimeForPeriod.minutes < periodDuration
        ) {
          total += manualAthleteTimeForPeriod.minutes;
          return;
        }
      }

      total += sumTotalMinutes(
        props.gameActivities.filter((a) => a.game_period_id === period.id),
        period.min,
        period.max
      );
    });

    return total;
  };

  const getTimeValue = (autoMin: number) => {
    if (props.type === timeCellFormat.period && hasManualPeriodMinutesChanged) {
      return +props.manualPlayerPeriodTimeInfo?.minutes;
    }
    return autoMin;
  };

  const renderPositionTimeValues = (
    positionLabel: ?string,
    timeValue: number
  ) => (
    <>
      <div>{positionLabel}</div>
      <div data-testid="TotalTime|PositionSum">{timeValue}</div>
    </>
  );

  const renderGameActivityTimeInfo = () => {
    // if there are no assigned positions (sub)
    if (!gameActivityUpdates.length) {
      // we are looking at the period view
      if (props.manualPlayerPeriodTimeInfo) {
        return renderPositionTimeValues(
          'SUB',
          props.manualPlayerPeriodTimeInfo?.minutes
        );
      }
      // we are looking at the summary view
      if (props.manualPlayerSummaryTimeInfo) {
        return renderPositionTimeValues(
          'SUB',
          props.manualPlayerSummaryTimeInfo.reduce(
            (acc, playTime) => acc + playTime.minutes,
            0
          )
        );
      }
    }

    return gameActivityUpdates.map((gameActivity) => (
      <Fragment key={gameActivity.indexVal}>
        {gameActivity.relation_id &&
          renderPositionTimeValues(
            positionsDropdownOptions.find(
              (position) => position?.value === gameActivity.relation_id
            )?.label,
            getTimeValue(gameActivity.total)
          )}
      </Fragment>
    ));
  };

  const getGameActivitiesList = () => (
    <div css={[baseStyle.gameActivityForm, baseStyle.template]}>
      {/* Form header */}

      <div css={baseStyle.gameActivityFormLabel}>{props.t('Position')}</div>

      <div css={baseStyle.gameActivityFormLabel}>{props.t('Minutes')}</div>
      {/* Form content */}
      {renderGameActivityTimeInfo()}
    </div>
  );

  const renderManuallyTimeInput = () => (
    <InputTextField
      value={manualTime?.toString() || ''}
      onChange={(e) => setManualTime(+e.target.value)}
      inputType="number"
      onBlur={handleLeaveManualInput}
      onKeyDown={onKeyDown}
      invalid={isManualTimeInvalid}
      kitmanDesignSystem
      isClearable
    />
  );

  const renderTimeDisplay = () => (
    <button
      css={baseStyle.totalTimeContainer}
      className={props.isTimeEditable && 'toggle-time-cell'}
      data-testid={`TotalTime|Sum${props.isTimeEditable ? ' Editable' : ''}`}
      onClick={() => {
        if (props.isTimeEditable) setIsManuallySettingTime(true);
      }}
      type="button"
    >
      <span>{getTimeValue(getTotalDuration())}</span>
    </button>
  );

  return (
    <Tippy
      placement="bottom-start"
      content={
        <div css={baseStyle.tooltipWidth}>
          <div css={baseStyle.gameActivityTooltipContent}>
            {getGameActivitiesList()}
          </div>
        </div>
      }
      theme="neutral-tooltip--kitmanDesignSystem"
      interactive
      appendTo={document.body}
    >
      {isManuallySettingTime ? renderManuallyTimeInput() : renderTimeDisplay()}
    </Tippy>
  );
};

export const TotalTimeCellTranslated = withNamespaces()(TotalTimeCell);
export default TotalTimeCell;
