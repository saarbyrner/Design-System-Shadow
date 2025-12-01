// @flow

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';

import {
  createUserEventRequest,
  deleteUserEventRequest,
} from '@kitman/services';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import i18n from '@kitman/common/src/utils/i18n';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';

const useScoutRequestAccess = () => {
  const [requestStatus, setRequestStatus] = useState<string>('SUCCESS');

  const dispatch = useDispatch();

  const handleUserEventRequestApi = ({
    eventId,
    userEventRequests,
    setUserEventRequests,
  }: {
    eventId: number,
    userEventRequests?: Array<UserEventRequest>,
    setUserEventRequests?: (?Array<UserEventRequest>) => void,
  }) => {
    setRequestStatus('LOADING');
    createUserEventRequest({ eventId })
      .then((result) => {
        setRequestStatus('SUCCESS');
        const currentUserEventRequests = structuredClone(userEventRequests);

        setUserEventRequests?.([...currentUserEventRequests, result]);
        dispatch(
          add({
            status: toastStatusEnumLike.Success,
            title: i18n.t(
              `Request sent. Acceptance email required to attend the fixture.`
            ),
          })
        );
      })
      .catch(() => {
        setRequestStatus('FAILED');
        dispatch(
          add({
            status: toastStatusEnumLike.Error,
            title: i18n.t(`Request failed to send.`),
          })
        );
      });
  };

  const handleCancelUserEventRequestApi = ({
    userEventRequests,
    setUserEventRequests,
    userEventRequestId,
    useScoutName,
  }: {
    userEventRequests: Array<UserEventRequest>,
    setUserEventRequests: (Array<UserEventRequest>) => void,
    userEventRequestId: number,
    useScoutName?: boolean,
  }) => {
    setRequestStatus('LOADING');

    const currentUserEventRequest = userEventRequests.find(
      (request) => request.id === userEventRequestId
    );

    deleteUserEventRequest({ userEventRequestId })
      .then(() => {
        setRequestStatus('SUCCESS');
        const filteredUserEventRequests = userEventRequests?.filter(
          (request) => request.id !== userEventRequestId
        );

        setUserEventRequests?.(filteredUserEventRequests);
        dispatch(
          add({
            status: toastStatusEnumLike.Success,
            title: useScoutName
              ? i18n.t('{{scoutName}} access has been withdrawn.', {
                  scoutName: currentUserEventRequest?.user.fullname,
                })
              : i18n.t('Scout access has been withdrawn.'),
          })
        );
      })
      .catch(() => {
        setRequestStatus('FAILED');
        dispatch(
          add({
            status: toastStatusEnumLike.Error,
            title: useScoutName
              ? i18n.t('{{scoutName}} access withdraw failed.', {
                  scoutName: currentUserEventRequest?.user.fullname,
                })
              : i18n.t('Scout access withdraw failed.'),
          })
        );
      });
  };

  return {
    requestStatus,
    setRequestStatus,
    handleUserEventRequestApi,
    handleCancelUserEventRequestApi,
  };
};

export default useScoutRequestAccess;
