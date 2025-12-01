// @flow
import { useState } from 'react';
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';

import { AppStatus, Checkbox, ChooseNameModal } from '@kitman/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import type { ModalStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

type Props = {
  newDashboardName: string,
  isModalOpen: boolean,
  canSeeHiddenVariables: boolean,
  isDashboardHidden: boolean,
  onRequestSuccess: Function,
  onClickCloseButton: Function,
  onDashboardNameChange: Function,
  onToggleHideDashboard: Function,
};

const AddDashboardModal = (props: I18nProps<Props>) => {
  const [feedbackModalStatus, setFeedbackModalStatus] =
    useState<ModalStatus>(null);
  const { trackEvent } = useEventTracking();

  const addDashboard = (newDashboardName: string) => {
    setFeedbackModalStatus('loading');
    trackEvent(reportingEventNames.createDashboard);

    $.ajax({
      method: 'POST',
      url: '/analysis/dashboard',
      contentType: 'application/json',
      data: JSON.stringify({
        name: newDashboardName,
        layout: {},
        is_hidden: props.isDashboardHidden,
      }),
    })
      .done((response) => {
        setFeedbackModalStatus('success');

        props.onRequestSuccess();
        // Redirect to the new dashboard
        window.location.assign(`/analysis/dashboard/${response.id}`);
      })
      .fail(() => {
        setFeedbackModalStatus('error');
      });
  };

  return (
    <>
      <AppStatus
        status={feedbackModalStatus}
        close={() => setFeedbackModalStatus(null)}
      />
      <ChooseNameModal
        title={props.t('New Dashboard')}
        label={props.t('Name')}
        isOpen={props.isModalOpen}
        closeModal={() => props.onClickCloseButton()}
        value={props.newDashboardName}
        onChange={(value) => props.onDashboardNameChange(value)}
        onConfirm={(value) => {
          addDashboard(value);
        }}
        adminContent={
          props.canSeeHiddenVariables && (
            <div className="analyticalDashboard__hideDashboard">
              <Checkbox
                id="analyticalDashboard_hideDashboard"
                label={props.t('Hide dashboard')}
                isChecked={props.isDashboardHidden}
                toggle={(checkbox) =>
                  props.onToggleHideDashboard(checkbox.checked)
                }
              />
            </div>
          )
        }
      />
    </>
  );
};

export const AddDashboardModalTranslated = withNamespaces()(AddDashboardModal);
export default AddDashboardModal;
