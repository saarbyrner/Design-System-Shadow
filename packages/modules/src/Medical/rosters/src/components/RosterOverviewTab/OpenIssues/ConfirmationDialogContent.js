// @flow
import { withNamespaces } from 'react-i18next';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { CircularProgress, Box, Avatar } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '@kitman/common/src/types';
import { style } from './style';

type IssueId = number;

type PendingChange = {
  issueId: IssueId,
  issueName: string,
  previousLabel: string,
  newLabel: string,
  dateLabel: string,
};

type PendingChanges = {
  [date: string]: Array<PendingChange>,
};

type ChangeStatuses = {
  [issueId: IssueId]: RequestStatus,
};

type ChangeErrors = {
  [issueId: IssueId]: string,
};

type Props = {
  athleteName: string,
  athleteAvatarUrl: string,
  pendingChanges: PendingChanges,
  changeStatuses: ChangeStatuses,
  changeErrors: ChangeErrors,
  saving: boolean,
  children?: any,
};

const ConfirmationDialogContent = ({
  athleteName,
  athleteAvatarUrl,
  pendingChanges,
  changeStatuses,
  changeErrors,
  saving,
  t,
}: I18nProps<Props>) => {
  const groupedChanges = pendingChanges;
  const dates = Object.keys(groupedChanges);

  const getStatusIcon = (status: ?RequestStatus) => {
    if (!saving && status !== 'SUCCESS') return null;
    switch (status) {
      case 'PENDING':
        return <CircularProgress size={16} />;
      case 'SUCCESS':
        return (
          <KitmanIcon
            name={KITMAN_ICON_NAMES.Check}
            css={style.statusIconSuccess}
          />
        );
      case 'FAILURE':
        return (
          <KitmanIcon
            name={KITMAN_ICON_NAMES.Close}
            css={style.statusIconError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box css={style.modalAthleteInfo}>
        <Avatar src={athleteAvatarUrl} sx={{ mr: 1 }} variant="square" />
        <span css={style.modalAthleteName}>{athleteName}</span>
      </Box>
      {dates.length === 0 ? (
        <span>{t('No changes detected')}</span>
      ) : (
        <Box>
          {dates.map((date) => (
            <Box key={`group-${date}`} css={style.modalChangeGroup}>
              {groupedChanges[date].map((c) => {
                const status = changeStatuses[c.issueId];
                const error = changeErrors[c.issueId];

                return (
                  <Box key={`change-${c.issueId}`} css={style.modalChangeItem}>
                    <Box css={style.modalChangeContent}>
                      <Box css={style.modalChangeDetails}>
                        <p css={style.modalIssueName}>{c.issueName}</p>
                        <p css={style.modalStatusChange}>
                          <span css={style.modalStatusPrevious}>
                            {c.previousLabel}
                          </span>
                          <span css={style.modalStatusArrow}>→</span>
                          <span>{c.newLabel}</span>
                        </p>
                        <p css={style.modalStatusDate}>
                          {t('Status date: {{date}}', {
                            date: c.dateLabel,
                          })}
                        </p>
                      </Box>
                      <Box css={style.modalIconContainer}>
                        {getStatusIcon(status)}
                      </Box>
                    </Box>
                    {error && (
                      <Box css={style.modalErrorBox}>
                        <KitmanIcon
                          name={KITMAN_ICON_NAMES.Close}
                          css={style.modalErrorIcon}
                        />
                        {error}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export const ConfirmationDialogContentTranslated = withNamespaces()(
  ConfirmationDialogContent
);
export default ConfirmationDialogContentTranslated;
