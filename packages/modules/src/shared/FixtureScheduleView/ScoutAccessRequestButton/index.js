// @flow

import { withNamespaces } from 'react-i18next';

import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';
import { IconButton, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Chip } from '@kitman/playbook/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getScoutAccessTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getScoutAccessManagementData';
import useScoutRequestAccess from '../hooks/useScoutRequestAccess';

type Props = {
  eventId: number,
  userEventRequests?: Array<UserEventRequest>,
  setUserEventRequests?: (?Array<UserEventRequest>) => void,
  userEventRequest: UserEventRequest,
  requestButtonViewable: boolean,
};
const ScoutRequestAccessButton = (props: I18nProps<Props>) => {
  const userEventRequestForRow = props.userEventRequest;
  const { setUserEventRequests, userEventRequests, eventId } = props;

  const { requestStatus, handleUserEventRequestApi } = useScoutRequestAccess();
  const { trackEvent } = useEventTracking();

  if (userEventRequestForRow?.status === userEventRequestStatuses.pending) {
    return <Chip color="secondary" label={props.t('Pending')} />;
  }

  if (userEventRequestForRow?.status === userEventRequestStatuses.approved) {
    return (
      <div className="approvedStatusCell">
        <Chip color="success" label={props.t('Approved')} />
        {userEventRequestForRow?.attachment && (
          <a
            href={userEventRequestForRow?.attachment.url}
            download={userEventRequestForRow?.attachment.filename}
            target="_blank"
            rel="noreferrer"
          >
            <IconButton
              type="textOnly"
              icon="icon-export"
              isSmall
              isBorderless
              isDarkIcon
              testId="download-file-button"
            />
          </a>
        )}
      </div>
    );
  }

  if (userEventRequestForRow?.status === userEventRequestStatuses.denied) {
    return <Chip color="error" label={props.t('Rejected')} />;
  }

  if (userEventRequestForRow?.status === userEventRequestStatuses.expired) {
    return <Chip color="primary" label={props.t('Expired')} />;
  }

  if (props.requestButtonViewable)
    return (
      <TextButton
        text={props.t('Request access')}
        kitmanDesignSystem
        onClick={() => {
          handleUserEventRequestApi({
            setUserEventRequests,
            userEventRequests,
            eventId,
          });
          trackEvent(
            leagueOperationsEventNames.requestAccessClicked,
            getScoutAccessTrackingData({
              product: 'league-ops',
              productArea: 'schedule',
              feature: 'scout-access-management',
              isRequestedOnBehalfOf: false,
            })
          );
        }}
        isDisabled={requestStatus === 'LOADING'}
      />
    );

  return null;
};

export const ScoutRequestAccessButtonTranslated = withNamespaces()(
  ScoutRequestAccessButton
);
export default ScoutRequestAccessButton;
