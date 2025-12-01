// @flow
import { withNamespaces } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { GameActivity } from '@kitman/common/src/types/GameEvent';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { colors, breakPoints } from '@kitman/common/src/variables';
import styles from './styles';

type Props = {
  gameActivityEvent: GameActivity,
  handleOwnGoal: (eventIndex: number, markAsOwnGoal: boolean) => void,
  disabled: boolean,
  isOwnGoalCheckedForEvent: boolean,
};

const OwnGoalSwitch = (props: I18nProps<Props>) => {
  const isTabletView = useMediaQuery(`(max-width: ${breakPoints.tablet})`);

  const {
    handleOwnGoal,
    gameActivityEvent,
    disabled,
    isOwnGoalCheckedForEvent,
  } = props;

  const handleChange = (event) => {
    if (gameActivityEvent.activityIndex !== undefined) {
      handleOwnGoal(gameActivityEvent.activityIndex, event.target.checked);
    }
  };

  return (
    <FormControlLabel
      sx={styles.formControlSx}
      label={
        <Typography
          variant="body2"
          color={disabled ? colors.grey_200_38 : colors.grey_200}
        >
          {props.t('Mark as own goal')}
        </Typography>
      }
      labelPlacement={isTabletView ? 'end' : 'start'}
      disabled={disabled}
      disableRipple
      control={
        <Switch
          disableRipple
          checked={isOwnGoalCheckedForEvent}
          onChange={handleChange}
        />
      }
    />
  );
};

export const OwnGoalSwitchTranslated = withNamespaces()(OwnGoalSwitch);
export default OwnGoalSwitch;
