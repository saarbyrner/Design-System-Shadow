// @flow
import { useSelector } from 'react-redux';
import moment from 'moment';
import { formatDateWithTime } from '@kitman/common/src/utils/dateFormatter';
import { colors } from '@kitman/common/src/variables';
import {
  type StatusHistory,
  RegistrationStatusEnum,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { Stack, Typography } from '@kitman/playbook/components';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { formatRegistrationStatusCell } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/cells/index';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

type Props = I18nProps<{
  entry: StatusHistory,
}>;

const HistoryItem = (props: Props) => {
  const currentSquad = useSelector(getActiveSquad());
  const { permissions } = usePermissions();

  const formatDate = (date: string) => {
    return formatDateWithTime({ date: moment(date) });
  };

  const useRegistrationSystemStatus =
    window.featureFlags['league-ops-update-registration-status'];
  const currentDivision = useRegistrationSystemStatus
    ? currentSquad?.division?.[0]?.name || ''
    : 'MLS Next';

  const isUnapproved = props.entry.status === RegistrationStatusEnum.UNAPPROVED;
  const canManageUnapprove = permissions.registration.status.canManageUnapprove;

  const hasStatusReason = !!props.entry.registration_status_reason?.name;
  const hasAnnotations = !!props.entry.annotations?.length;

  const isStatusReasonShown =
    hasStatusReason && (!isUnapproved || canManageUnapprove);
  const isNotesStackShown =
    hasAnnotations && (!isUnapproved || canManageUnapprove);

  return (
    <Stack
      direction="column"
      sx={{ borderBottom: `1px solid ${colors.neutral_300}`, pb: 2 }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography
          varient="subtitle1"
          fontWeight={600}
          sx={{ color: colors.grey_200 }}
        >
          {currentDivision}
        </Typography>

        {formatRegistrationStatusCell({
          registrationStatus: props.entry.status,
          registrationSystemStatus: props.entry.registration_system_status,
          useRegistrationSystemStatus,
          withTooltip: false,
        })}
      </Stack>
      <Stack direction="row">
        <Typography variant="caption" sx={{ color: colors.grey_300 }}>
          {formatDate(props.entry.created_at)}
        </Typography>
      </Stack>

      {isStatusReasonShown && (
        <Typography
          variant="body2"
          sx={{
            color: colors.grey_300,
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        >
          <Typography component="span" fontSize={14} fontWeight={600}>
            {props.t('Reason: ')}
          </Typography>
          {props.entry.registration_status_reason?.name}
        </Typography>
      )}

      {isNotesStackShown && (
        <Stack direction="column">
          {props.entry.annotations.map((annotation) => {
            return (
              <Typography
                variant="body2"
                sx={{
                  color: colors.grey_300,
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
                key={annotation.annotation_date}
              >
                <Typography component="span" fontSize={14} fontWeight={600}>
                  {props.t('Notes: ')}
                </Typography>
                {annotation.content}
              </Typography>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export const HistoryItemTranslated = withNamespaces()(HistoryItem);
export default HistoryItem;
