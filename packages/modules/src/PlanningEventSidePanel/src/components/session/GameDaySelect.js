// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import _range from 'lodash/range';
import { Select } from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import type { OnUpdateEventDetails } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const style = {
  gameDaySelect: css`
    .kitmanReactSelect__option--is-disabled {
      color: ${colors.grey_300_50};
    }
  `,
};

export type Props = {
  gameDayMinus: ?number,
  gameDayPlus: ?number,
  onUpdateEventDetails: OnUpdateEventDetails,
};

const formatGameDayValue = (gameDay: number): string => {
  return gameDay > 0 ? `+${gameDay}` : `${gameDay}`;
};

export const gameDaysOptions = (
  selectedMinus: ?number,
  selectedPlus: ?number
): Array<Option> => {
  /*
   * If just zero is selected don't disable anything as can make another selection
   * Otherwise:
   * If have 2 selections and neither is zero disable zero
   * If a negative number is selected disable every other negative number
   * If a positive number is selected disable every other positive number
   */
  const onlyZeroSelected =
    (selectedMinus === 0 || selectedPlus === 0) &&
    (selectedMinus == null || selectedPlus == null);

  const shouldDisableZero =
    selectedMinus !== 0 &&
    selectedPlus !== 0 &&
    selectedMinus != null &&
    selectedPlus != null;

  return _range(7, -8).map((gameDay) => {
    const otherNegativeDays =
      selectedMinus != null && selectedMinus !== gameDay;
    const otherPositiveDays = selectedPlus != null && selectedPlus !== gameDay;

    return {
      value: gameDay,
      label: formatGameDayValue(gameDay),
      isDisabled: onlyZeroSelected
        ? false
        : (shouldDisableZero && gameDay === 0) ||
          (otherNegativeDays && gameDay < 0) ||
          (otherPositiveDays && gameDay > 0),
    };
  });
};

const GameDaySelect = (props: I18nProps<Props>) => {
  const selection = [];

  // gameDaysOptions function logic depends on gameDayMinus being negative if not null or zero
  const minusNumber =
    props.gameDayMinus != null && props.gameDayMinus > 0
      ? -props.gameDayMinus
      : props.gameDayMinus;

  if (minusNumber != null) {
    selection.push(minusNumber);
  }
  if (props.gameDayPlus != null) {
    selection.push(props.gameDayPlus);
  }

  return (
    <div css={style.gameDaySelect}>
      <Select
        isMulti
        label={props.t('#sport_specific__Game_Day_+/-')}
        options={gameDaysOptions(minusNumber, props.gameDayPlus)}
        onChange={(values: Array<number>) => {
          const sortedSelection = [...values].sort();
          let gameDayPlus = null;
          let gameDayMinus = null;

          if (sortedSelection.length === 1) {
            if (sortedSelection[0] < 0) {
              gameDayMinus = sortedSelection[0];
            } else {
              gameDayPlus = sortedSelection[0];
            }
          }

          if (sortedSelection.length > 1) {
            gameDayMinus = sortedSelection[0];
            gameDayPlus = sortedSelection[1];
          }
          props.onUpdateEventDetails({
            game_day_minus: gameDayMinus,
            game_day_plus: gameDayPlus,
          });
        }}
        value={selection}
        menuPlacement="top"
      />
    </div>
  );
};

export const GameDaySelectTranslated: ComponentType<Props> =
  withNamespaces()(GameDaySelect);
export default GameDaySelect;
