// @flow
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Stack } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import { dmrEventStatusProgress } from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';

type Props = {
  homeStatus?: string,
  awayStatus?: string,
  skipAutomaticGameTeamEmail?: boolean | null,
};
const MatchDayStatusInfo = (props: Props) => {
  const getIconName = (dmrStatus?: string) => {
    switch (dmrStatus) {
      case dmrEventStatusProgress.complete:
        return KITMAN_ICON_NAMES.CheckCircleOutline;
      case dmrEventStatusProgress.partial:
        return KITMAN_ICON_NAMES.ContrastOutlined;
      default:
        return KITMAN_ICON_NAMES.RadioBtnUnchecked;
    }
  };
  const getIconColor = (dmrStatus?: string) => {
    if (dmrStatus === 'COMPLETE') return { color: colors.green_200 };
    return { color: colors.grey_200 };
  };

  return (
    <Stack direction="row" spacing={1}>
      <KitmanIcon
        name={getIconName(props?.homeStatus)}
        sx={getIconColor(props?.homeStatus)}
      />
      {props.awayStatus !== undefined && (
        <KitmanIcon
          name={getIconName(props?.awayStatus)}
          sx={getIconColor(props?.awayStatus)}
        />
      )}
      {props.skipAutomaticGameTeamEmail && (
        <KitmanIcon
          sx={{ color: colors.red_100 }}
          name={KITMAN_ICON_NAMES.MailLockIcon}
        />
      )}
    </Stack>
  );
};

export default MatchDayStatusInfo;
