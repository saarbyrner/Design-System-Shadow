// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';
import { AppStatus, TooltipMenu, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  eventId: number,
  onClickImportData: Function,
};

const ImportActions = (props: I18nProps<Props>) => {
  const [deleteDataStatus, setDeleteDataStatus] = useState();

  const deleteImportedData = () => {
    setDeleteDataStatus('PENDING');

    $.ajax({
      method: 'DELETE',
      url: `/planning_hub/events/${props.eventId}/imports/clear_data`,
    })
      .done(() => {
        setDeleteDataStatus('SUCCESS');
        window.location.reload();
      })
      .fail(() => {
        setDeleteDataStatus('FAILURE');
      });
  };

  const getStatus = () => {
    if (deleteDataStatus === 'CONFIRM') {
      return 'warning';
    }
    if (deleteDataStatus === 'PENDING') {
      return 'loading';
    }
    if (deleteDataStatus === 'SUCCESS') {
      return 'success';
    }
    if (deleteDataStatus === 'FAILURE') {
      return 'error';
    }

    return null;
  };

  const getAppStatusMessage = () => {
    if (deleteDataStatus === 'CONFIRM') {
      return props.t('Delete all imported data associated with this session?');
    }
    if (deleteDataStatus === 'PENDING') {
      return props.t('Deleting imported data');
    }
    if (deleteDataStatus === 'SUCCESS') {
      return props.t('Datapoints deleted');
    }
    if (deleteDataStatus === 'FAILURE') {
      return null;
    }

    return null;
  };

  return (
    <>
      <TooltipMenu
        placement="bottom-end"
        offset={[0, 10]}
        menuItems={[
          {
            description: props.t('Import Data'),
            icon: 'icon-upload',
            onClick: props.onClickImportData,
          },
          {
            description: props.t('Delete All Data'),
            icon: 'icon-bin',
            onClick: () => setDeleteDataStatus('CONFIRM'),
          },
        ]}
        tooltipTriggerElement={
          <TextButton
            iconAfter="icon-more"
            type="secondary"
            kitmanDesignSystem
          />
        }
      />

      {deleteDataStatus && (
        <AppStatus
          status={getStatus()}
          message={getAppStatusMessage()}
          hideConfirmation={() => setDeleteDataStatus(null)}
          confirmAction={() => {
            if (deleteDataStatus === 'CONFIRM') {
              deleteImportedData();
            }
          }}
        />
      )}
    </>
  );
};

export const ImportActionsTranslated = withNamespaces()(ImportActions);
export default ImportActions;
