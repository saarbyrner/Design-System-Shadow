// @flow
import { useState } from 'react';
import $ from 'jquery';
import { TrackEvent } from '@kitman/common/src/utils';
import { withNamespaces } from 'react-i18next';
import { AppStatus, ChooseNameModal } from '@kitman/components';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

type Props = {
  dashboard: Dashboard,
  isModalOpen: boolean,
  onClickCloseButton: Function,
  onDashboardUpdate: Function,
  onRequestSuccess: Function,
};

function RenameDashboardModal(props: I18nProps<Props>) {
  const [feedbackModalStatus, setFeedbackModalStatus] = useState(null);
  const { trackEvent } = useEventTracking();

  const renameDashboard = (newDashboardName: string) => {
    setFeedbackModalStatus('loading');

    const updatedDashboard = Object.assign({}, props.dashboard, {
      name: newDashboardName,
    });

    $.ajax({
      method: 'PUT',
      url: `/analysis/dashboard/${props.dashboard.id}`,
      contentType: 'application/json',
      data: JSON.stringify(updatedDashboard),
    })
      .done(() => {
        setFeedbackModalStatus(null);
        props.onRequestSuccess();
        props.onDashboardUpdate(updatedDashboard);
      })
      .fail(() => {
        setFeedbackModalStatus('error');
      });
  };

  const onConfirm = (value) => {
    renameDashboard(value);
    // GA tracking
    TrackEvent('Graph Dashboard', 'Click', 'Confirm Rename Dashboard');
    // Mixpanel
    trackEvent(reportingEventNames.editDashboard);
  };

  return (
    <>
      <AppStatus
        status={feedbackModalStatus}
        close={() => setFeedbackModalStatus(null)}
      />
      <ChooseNameModal
        title={props.t('Rename Dashboard')}
        label={props.t('Name')}
        actionButtonText={props.t('Rename')}
        isOpen={props.isModalOpen}
        closeModal={() => {
          TrackEvent('Graph Dashboard', 'Click', 'Cancel Rename Dashboard');
          props.onClickCloseButton();
        }}
        value={props.dashboard.name}
        onConfirm={onConfirm}
      />
    </>
  );
}

export default RenameDashboardModal;
export const RenameDashboardModalTranslated =
  withNamespaces()(RenameDashboardModal);
