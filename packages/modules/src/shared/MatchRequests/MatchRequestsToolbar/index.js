// @flow
import { withNamespaces } from 'react-i18next';
import {
  Stack,
  Typography,
  Button,
  Toolbar,
  ButtonGroup,
  Tooltip,
} from '@kitman/playbook/components';
import rootTheme from '@kitman/playbook/themes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';

type Props = {
  selectedIds: Array<number>,
  userEventRequests: Array<UserEventRequest>,
  handleApprove: () => void,
  handleReject: () => void,
  handleUploadAttachment: () => void,
  isLoading: boolean,
};

const MatchRequestsToolbar = ({
  selectedIds,
  userEventRequests,
  handleApprove,
  handleReject,
  handleUploadAttachment,
  isLoading,
  t,
}: I18nProps<Props>) => {
  const selectedEvents = userEventRequests.filter(({ id }) =>
    selectedIds.includes(id)
  );

  const shouldAllowApprovedRejectedStatusesToBeChanged = window.getFlag(
    'league-ops-change-scout-request'
  );

  const canApproveStatus = selectedEvents.every(({ status }) => {
    if (shouldAllowApprovedRejectedStatusesToBeChanged) {
      return [
        userEventRequestStatuses.pending,
        userEventRequestStatuses.rejected,
        userEventRequestStatuses.denied,
      ].includes(status);
    }
    return status === userEventRequestStatuses.pending;
  });

  const canRejectStatus = selectedEvents.every(({ status }) => {
    if (shouldAllowApprovedRejectedStatusesToBeChanged) {
      return [
        userEventRequestStatuses.pending,
        userEventRequestStatuses.approved,
      ].includes(status);
    }
    return status === userEventRequestStatuses.pending;
  });

  const canUploadAttachments = selectedEvents.every(
    ({ status }) => status === userEventRequestStatuses.approved
  );

  const getUploadErrorText = () => {
    const areStatusesInconsistent = selectedEvents.some(
      ({ status }) => status !== selectedEvents[0].status
    );

    const inconsistentStatusesText = t(
      'Selected users have different available actions. Please reselect users with common actions'
    );
    const unavailableText = t('Action not applicable to selected users');

    return areStatusesInconsistent ? inconsistentStatusesText : unavailableText;
  };

  if (!selectedEvents.length) {
    return null;
  }

  const withDisabledTooltip = (
    element: React$Element<any>,
    tooltipText: string
  ) => {
    if (!element.props.disabled || isLoading) {
      return element;
    }

    // Disabled element do not trigger mouse events, so we need to wrap by span
    return (
      <Tooltip title={tooltipText}>
        <span>{element}</span>
      </Tooltip>
    );
  };

  return (
    <Toolbar
      sx={{
        backgroundColor: rootTheme.palette.primary.focus,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="subtitle1">
        {selectedEvents.length} {t('selected')}
      </Typography>
      <Stack direction="row" spacing={2}>
        {withDisabledTooltip(
          <Button
            color="secondary"
            variant="contained"
            onClick={handleUploadAttachment}
            disabled={!canUploadAttachments}
          >
            {t('Upload attachment')}
          </Button>,
          getUploadErrorText()
        )}
        {withDisabledTooltip(
          <ButtonGroup
            color="secondary"
            orientation="horizontal"
            variant="contained"
            sx={{
              boxShadow: 'none',
            }}
            disabled={isLoading}
          >
            <Button
              disabled={!canApproveStatus || isLoading}
              onClick={handleApprove}
            >
              {t('Approve request')}
            </Button>
            <Button
              disabled={!canRejectStatus || isLoading}
              onClick={handleReject}
            >
              {t('Reject request')}
            </Button>
          </ButtonGroup>,
          t('Action not applicable to selected users')
        )}
      </Stack>
    </Toolbar>
  );
};

export const MatchRequestsToolbarTranslated =
  withNamespaces()(MatchRequestsToolbar);
export default MatchRequestsToolbar;
