// @flow
import {
  type UserType,
  type RegistrationStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

type ChangeStatusPanelTrackingData = {
  userType: UserType,
  status?: RegistrationStatus,
  reason?: string,
};

export const getChangeStatusPanelTrackingData = (
  props: ChangeStatusPanelTrackingData
): ChangeStatusPanelTrackingData => {
  const data: ChangeStatusPanelTrackingData = {
    userType: props.userType,
  };

  if (props.status) {
    data.status = props.status;
  }

  if (props.reason) {
    data.reason = props.reason;
  }

  return data;
};
